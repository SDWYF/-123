import React, { useEffect, useState } from 'react';
import { Sparkles, RefreshCcw, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateTaxAnalysis } from '../services/geminiService';
import { AnalysisSummary } from '../types';

interface Props {
  summary: AnalysisSummary;
}

const AIAnalysis: React.FC<Props> = ({ summary }) => {
  const [report, setReport] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAnalysis = async () => {
    // Prevent fetching if no data
    if (summary.totalRecords === 0) {
        setReport("暂无数据。请上传 Excel 文件以生成分析。");
        return;
    }

    setLoading(true);
    setReport(""); // Clear previous report while loading
    
    try {
        const result = await generateTaxAnalysis(summary);
        setReport(result);
    } catch (e) {
        console.error(e);
        setReport("⚠️ 发生意外错误，无法生成报告。请检查控制台日志。");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (summary.totalRecords > 0) {
        fetchAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summary]);

  const isError = report.startsWith("⚠️") || report.includes("生成分析报告时发生错误");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-indigo-100 overflow-hidden flex flex-col min-h-[400px]">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 text-white">
          <Sparkles className="w-5 h-5" />
          <h2 className="font-semibold text-lg">AI 智能分析报告</h2>
        </div>
        <button 
            onClick={fetchAnalysis}
            disabled={loading || summary.totalRecords === 0}
            className="text-white/80 hover:text-white transition-colors disabled:opacity-50 p-1 rounded hover:bg-white/10"
            title="重新生成分析"
        >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="p-6 flex-1 bg-white relative">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 z-10 space-y-4 rounded-b-xl">
            <div className="relative w-12 h-12">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full animate-pulse"></div>
                <div className="absolute top-0 left-0 w-full h-full border-t-4 border-indigo-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-indigo-600 font-medium animate-pulse text-sm">Gemini 正在深度分析您的数据...</p>
          </div>
        )}

        <article className={`prose prose-sm md:prose-base max-w-none ${loading ? 'opacity-30' : 'opacity-100'} transition-opacity text-gray-800`}>
            {report ? (
                isError ? (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 flex gap-3 items-start">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div className="whitespace-pre-wrap font-medium text-sm">{report}</div>
                    </div>
                ) : (
                    // Explicitly styling text color to ensure visibility
                    <div className="text-gray-800 prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
                        <ReactMarkdown>{report}</ReactMarkdown>
                    </div>
                )
            ) : (
                <div className="text-center text-gray-400 py-20 italic">
                    {summary.totalRecords === 0 ? "请先上传数据文件" : "等待分析结果..."}
                </div>
            )}
        </article>
      </div>
    </div>
  );
};

export default AIAnalysis;