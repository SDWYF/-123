import * as XLSX from 'xlsx';
import { RawTaxRecord, TaxRecord, AnalysisSummary } from '../types';

export const parseExcelFile = (file: File): Promise<TaxRecord[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Robust Header Detection: Find the row containing key columns
        const jsonMatrix = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        let headerRowIndex = 0;
        let foundHeader = false;

        // Clean string helper: remove spaces, to lower case
        const clean = (s: any) => String(s).replace(/\s+/g, '').toLowerCase();

        for (let i = 0; i < Math.min(jsonMatrix.length, 20); i++) { // Scan first 20 rows
            const row = jsonMatrix[i].map(clean);
            // Check for key columns using fuzzy matching
            // "序号", "受理人" or "业务类型" are strong indicators
            const hasId = row.some(c => c.includes("序号"));
            const hasOperator = row.some(c => c.includes("受理人"));
            const hasBizType = row.some(c => c.includes("业务类型"));

            if (hasId && (hasOperator || hasBizType)) {
                headerRowIndex = i;
                foundHeader = true;
                break;
            }
        }

        // Parse with correct header row
        const rawData = XLSX.utils.sheet_to_json<RawTaxRecord>(worksheet, { range: headerRowIndex });

        if (!foundHeader && rawData.length > 0) {
             console.warn("Could not auto-detect header row, assuming row 0.");
        }

        // Normalize Data
        const normalizedData: TaxRecord[] = rawData.filter(row => row["序号"] !== undefined).map((row, index) => {
            const rawDuration = row["办理时长（超20分钟业务填写）"];
            let duration = 0;
            if (typeof rawDuration === 'number') {
                duration = rawDuration;
            } else if (typeof rawDuration === 'string') {
                // Extract number from string like "25分钟"
                const match = rawDuration.match(/(\d+(\.\d+)?)/);
                duration = match ? parseFloat(match[0]) : 0;
            }

            // Helper to get value ignoring exact column name spacing issues if needed
            // But sheet_to_json uses the keys from the header row.
            // Since we found the header row, the keys should match what's in the Excel file.
            // However, to be safe against "业务类型 1" vs "业务类型1", we rely on the specific keys requested.
            // If the user's excel has "业务类型", but we expect "业务类型1", we might miss it.
            // Let's stick to the requested keys but add fallbacks if common variations exist.
            
            return {
                id: row["序号"] || index + 1,
                subjectType: row["课征主体登记类型"] || "未知",
                taxAuthority: row["主管税务机关"] || "未知",
                // Try to find business type key if exact match fails
                businessType: row["业务类型1"] || row["业务类型"] || "其他",
                operator: row["受理人"] || "未知",
                successStatus: (row["是否办成"] || "否").trim(),
                duration: duration,
                visitReason: row["进厅原因"] || "常规办理",
                guided: (row["是否引导体验征纳互动"] || "否").trim(),
                remarks: row["备注（未引导/未发起情况）"] || ""
            };
        });

        resolve(normalizedData);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

export const calculateSummary = (data: TaxRecord[]): AnalysisSummary => {
    const totalRecords = data.length;
    if (totalRecords === 0) {
        return {
            totalRecords: 0,
            successRate: 0,
            avgDurationLong: 0,
            topBusinessTypes: [],
            topReasons: [],
            guidanceRate: 0,
            operatorStats: [],
            subjectTypeDist: [],
            taxAuthorityDist: [],
            businessBySubject: []
        };
    }

    const successCount = data.filter(r => r.successStatus === '是').length;
    const guidedCount = data.filter(r => r.guided === '是').length;
    
    // Duration stats
    const longDurationRecords = data.filter(r => r.duration > 0);
    const totalDuration = longDurationRecords.reduce((acc, curr) => acc + curr.duration, 0);
    const avgDurationLong = longDurationRecords.length > 0 ? totalDuration / longDurationRecords.length : 0;

    // Helper to count frequencies
    const countFreq = (key: keyof TaxRecord) => {
        const counts: Record<string, number> = {};
        data.forEach(r => {
            const val = String(r[key] || "未知").trim();
            if (val === "") return;
            counts[val] = (counts[val] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
    };

    // Operator Stats
    const operatorMap: Record<string, { total: number; success: number }> = {};
    data.forEach(r => {
        const op = r.operator || "未知";
        if (!operatorMap[op]) operatorMap[op] = { total: 0, success: 0 };
        operatorMap[op].total += 1;
        if (r.successStatus === '是') operatorMap[op].success += 1;
    });
    const operatorStats = Object.entries(operatorMap)
        .map(([name, stats]) => ({
            name,
            count: stats.total,
            successRate: stats.total > 0 ? (stats.success / stats.total) * 100 : 0
        }))
        .sort((a, b) => b.count - a.count);

    // Business by Subject Analysis
    // 1. Get top subjects
    const subjectDist = countFreq('subjectType');
    const topSubjects = subjectDist.slice(0, 4).map(s => s.name); // Top 4 subjects

    // 2. For each top subject, get their top businesses
    const businessBySubject = topSubjects.map(subject => {
        const recordsForSubject = data.filter(r => r.subjectType === subject);
        const businessCounts: Record<string, number> = {};
        recordsForSubject.forEach(r => {
             const b = r.businessType || "其他";
             businessCounts[b] = (businessCounts[b] || 0) + 1;
        });
        const sortedBusiness = Object.entries(businessCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // Top 5 businesses for this subject
        
        return {
            subject,
            data: sortedBusiness
        };
    });

    return {
        totalRecords,
        successRate: (successCount / totalRecords) * 100,
        avgDurationLong,
        topBusinessTypes: countFreq('businessType'),
        topReasons: countFreq('visitReason'),
        guidanceRate: (guidedCount / totalRecords) * 100,
        operatorStats,
        subjectTypeDist: subjectDist.map(i => ({ name: i.name, value: i.count })),
        taxAuthorityDist: countFreq('taxAuthority').map(i => ({ name: i.name, value: i.count })),
        businessBySubject
    };
};