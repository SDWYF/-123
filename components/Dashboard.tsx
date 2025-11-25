import React, { useMemo } from 'react';
import { TaxRecord } from '../types';
import { calculateSummary } from '../utils/excelParser';
import KPICard from './KPICard';
import { Users, CheckCircle, Clock, Smartphone } from 'lucide-react';
import BusinessDistribution from './charts/BusinessDistribution';
import ReasonBarChart from './charts/ReasonBarChart';
import SubjectTypeChart from './charts/SubjectTypeChart';
import TaxAuthorityChart from './charts/TaxAuthorityChart';
import BusinessBySubjectChart from './charts/BusinessBySubjectChart';
import OperatorWorkloadChart from './charts/OperatorWorkloadChart';
import AIAnalysis from './AIAnalysis';

interface DashboardProps {
  data: TaxRecord[];
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onReset }) => {
  const summary = useMemo(() => calculateSummary(data), [data]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Controls */}
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">月度数据概览</h2>
            <p className="text-sm text-gray-500 mt-1">数据来源：上传的 Excel 台账</p>
        </div>
        <button 
          onClick={onReset}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
        >
          上传新文件
        </button>
      </div>

      {/* KPI Cards (包括事项办成率、征纳互动引导率) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="月度总业务量" 
          value={summary.totalRecords} 
          icon={<Users className="w-6 h-6 text-blue-600" />} 
          colorClass="bg-blue-50"
        />
        <KPICard 
          title="事项办成率" 
          value={`${summary.successRate.toFixed(1)}%`} 
          subtext={`成功办结 ${Math.round(summary.totalRecords * (summary.successRate/100))} 笔`}
          icon={<CheckCircle className="w-6 h-6 text-green-600" />} 
          colorClass="bg-green-50"
        />
        <KPICard 
          title="征纳互动引导率" 
          value={`${summary.guidanceRate.toFixed(1)}%`} 
          icon={<Smartphone className="w-6 h-6 text-purple-600" />} 
          colorClass="bg-purple-50"
        />
        <KPICard 
          title="长耗时业务均时" 
          value={`${summary.avgDurationLong.toFixed(1)}分`} 
          subtext=">20分钟业务统计"
          icon={<Clock className="w-6 h-6 text-amber-600" />} 
          colorClass="bg-amber-50"
        />
      </div>

      {/* AI Analysis (高频业务分析、受理人工作量分析、总结分析) */}
      <AIAnalysis summary={summary} />

      {/* Charts Section 1: Business Types & Tax Authority */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 业务类型情况 */}
        <BusinessDistribution data={summary} />
        {/* 所属主管税务机关情况 */}
        <TaxAuthorityChart data={summary} />
      </div>

      {/* Charts Section 2: Subject Type & Reasons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* 课征主体登记类型情况 */}
         <SubjectTypeChart data={summary} />
         {/* 进厅主要原因 */}
         <ReasonBarChart data={summary} />
      </div>

      {/* Charts Section 3: Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 进厅高频业务（按主体分类） */}
        <BusinessBySubjectChart data={summary} />
        {/* 受理人工作量 (辅助 AI 分析) */}
        <OperatorWorkloadChart data={summary} />
      </div>
      
    </div>
  );
};

export default Dashboard;