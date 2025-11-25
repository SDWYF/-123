export interface RawTaxRecord {
  "序号": number;
  "课征主体登记类型": string;
  "主管税务机关": string;
  "业务类型1": string;
  "受理人": string;
  "是否办成": string;
  "办理时长（超20分钟业务填写）"?: string | number;
  "进厅原因": string;
  "是否引导体验征纳互动": string;
  "备注（未引导/未发起情况）"?: string;
}

export interface TaxRecord {
  id: number;
  subjectType: string;
  taxAuthority: string;
  businessType: string;
  operator: string;
  successStatus: string; // "是" | "否"
  duration: number; // Normalized to number (minutes)
  visitReason: string;
  guided: string; // "是" | "否"
  remarks: string;
}

export interface AnalysisSummary {
  totalRecords: number;
  successRate: number; // 0-100
  avgDurationLong: number; // Average of recorded durations
  topBusinessTypes: { name: string; count: number }[];
  topReasons: { name: string; count: number }[];
  guidanceRate: number; // 0-100
  operatorStats: { name: string; count: number; successRate: number }[];
  subjectTypeDist: { name: string; value: number }[];
  taxAuthorityDist: { name: string; value: number }[];
  // Top 5 business types breakdown by top 3 subject types
  businessBySubject: {
    subject: string;
    data: { name: string; count: number }[];
  }[];
}