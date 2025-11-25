import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AnalysisSummary } from '../../types';

interface Props {
  data: AnalysisSummary;
}

const SubjectTypeChart: React.FC<Props> = ({ data }) => {
  const chartData = data.subjectTypeDist;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-96">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">服务主体类型分布</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{fontSize: 12, fill: '#6b7280'}} />
            <YAxis tick={{fontSize: 12, fill: '#6b7280'}} />
            <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} name="数量" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SubjectTypeChart;
