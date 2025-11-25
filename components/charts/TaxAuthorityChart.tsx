import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AnalysisSummary } from '../../types';

interface Props {
  data: AnalysisSummary;
}

const TaxAuthorityChart: React.FC<Props> = ({ data }) => {
  const chartData = data.taxAuthorityDist.slice(0, 10); // Show top 10

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-[400px]">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">所属主管税务机关分布 (Top 10)</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
            <XAxis type="number" hide />
            <YAxis 
                type="category" 
                dataKey="name" 
                width={140} 
                tick={{fontSize: 11, fill: '#6b7280'}} 
                interval={0}
            />
            <Tooltip 
                 cursor={{fill: '#f3f4f6'}}
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} name="业务量">
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`rgba(99, 102, 241, ${1 - index * 0.05})`} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaxAuthorityChart;