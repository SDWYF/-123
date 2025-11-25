import React from 'react';
import { FileBarChart } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
                <FileBarChart className="h-6 w-6 text-white" />
            </div>
            <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">税务大厅智能台账分析系统</h1>
                <p className="text-xs text-gray-500 hidden sm:block">月度工作台账 · 智能可视化 · 深度分析</p>
            </div>
          </div>
          <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
            Powered by Gemini 2.5
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;