import React, { useState } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import { TaxRecord } from './types';
import * as XLSX from 'xlsx';

// Make XLSX available globally for debugging if needed, but primarily used in utils
// We need to ensure we import it to include it in the bundle
const _ = XLSX;

function App() {
  const [data, setData] = useState<TaxRecord[] | null>(null);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="pb-20">
        {!data ? (
          <div className="animate-fade-in-up">
             <div className="max-w-4xl mx-auto mt-12 text-center px-4">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                   智能解析，洞察数据价值
                </h2>
                <p className="mt-4 text-lg text-gray-500">
                   上传税务大厅月度工作台账 Excel，自动生成多维可视化图表与 AI 深度分析报告。
                </p>
             </div>
             <FileUpload onDataLoaded={setData} />
             
             {/* Demo Instruction */}
             <div className="max-w-xl mx-auto mt-12 text-center text-sm text-gray-400">
                <p>隐私安全声明：数据仅在本地浏览器解析，只有统计摘要会发送给 AI 生成报告。</p>
             </div>
          </div>
        ) : (
          <Dashboard data={data} onReset={() => setData(null)} />
        )}
      </main>
    </div>
  );
}

export default App;
