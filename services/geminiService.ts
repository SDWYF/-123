import { GoogleGenAI } from "@google/genai";
import { AnalysisSummary } from "../types";

export const generateTaxAnalysis = async (summary: AnalysisSummary): Promise<string> => {
  // Data Validation
  if (!summary || summary.totalRecords === 0) {
    return "暂无数据可供分析。请确保上传了包含有效记录的 Excel 文件。";
  }

  try {
    // Robust API Key retrieval for Browser environments
    let apiKey = "";
    try {
        // @ts-ignore
        if (typeof process !== "undefined" && process.env && process.env.API_KEY) {
            // @ts-ignore
            apiKey = process.env.API_KEY;
        }
    } catch (e) {
        console.warn("Failed to read process.env", e);
    }
    
    if (!apiKey) {
        // Fallback or throw if critical
        // If we are in an environment where the key is injected elsewhere or via a proxy, this might be handled differently,
        // but for standard usage, we need the key.
        throw new Error("API Key 未找到。请确保环境变量 API_KEY 已正确配置。");
    }

    const ai = new GoogleGenAI({ apiKey });

    // Construct a data-rich prompt
    const prompt = `
      您是一位资深的税务大厅运营管理专家。请根据以下提供的月度工作台账汇总数据，撰写一份专业的分析报告。

      ### 数据概览
      - 总业务量：${summary.totalRecords} 笔
      - 业务办成率：${summary.successRate.toFixed(2)}%
      - 征纳互动引导率：${summary.guidanceRate.toFixed(2)}%
      - 长耗时业务（>20分钟）平均时长：${summary.avgDurationLong.toFixed(1)} 分钟
      
      ### 详细数据
      - 高频业务前五：${summary.topBusinessTypes.slice(0, 5).map(t => `${t.name}(${t.count})`).join(', ')}
      - 主要进厅原因：${summary.topReasons.slice(0, 3).map(r => `${r.name}(${r.count})`).join(', ')}
      - 受理人Top5工作量：${summary.operatorStats.slice(0, 5).map(o => `${o.name}(${o.count}笔, 成功率${o.successRate.toFixed(0)}%)`).join(', ')}
      - 服务主体分布：${summary.subjectTypeDist.slice(0, 3).map(s => `${s.name}(${s.value})`).join(', ')}

      ### 报告撰写要求
      请严格按照以下三个部分进行撰写，不需要额外的前言或寒暄，直接进入正文。请使用 Markdown 格式（使用 ## 作为一级标题，* 作为列表）：

      ## 1. 高频业务分析
      *   结合“进厅原因”和“业务类型”数据，分析纳税人进厅的主要需求。
      *   指出哪些业务占据了主要资源，是否存在可以通过线上化分流的空间。
      *   分析不同主体（如${summary.subjectTypeDist[0]?.name || '纳税人'}）的特定业务需求倾向。

      ## 2. 受理人工作量分析
      *   分析受理窗口的工作负荷情况（基于Top 5受理人数据）。
      *   如果成功率有明显差异，简要分析可能的原因（如业务复杂性或业务熟练度）。

      ## 3. 总结分析
      *   **总体评价**：评价本月大厅的运行效率（办成率、引导率）。
      *   **改进建议**：针对上述分析，提出具体的可执行建议（例如：针对高频事项开设专窗、加强导税分流、提升数字化引导率等）。

      请语气专业、客观、简练，适合呈报给税务局领导查阅。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text;
    
    if (!text) {
        return "⚠️ **分析完成，但内容为空**。请重试。";
    }

    return text;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Return a plain text error message that is guaranteed to render
    return `⚠️ **分析报告生成失败**\n\n原因：${error.message || "网络连接不稳定或服务暂时不可用"}\n\n建议：\n1. 请检查您的网络连接。\n2. 确保 API Key 配置正确。\n3. 点击右上角刷新按钮重试。`;
  }
};