import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { AnalysisSummary } from '../../types';

interface Props {
  data: AnalysisSummary;
}

const OperatorWorkloadChart: React.FC<Props> = ({ data }) => {
  const chartData = data.operatorStats.slice(0, 10); // Top 10 operators

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-96">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">受理人工作量 Top 10</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{fontSize: 12, fill: '#6b7280'}} />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" tick={{fontSize: 12}} />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tick={{fontSize: 12}} unit="%" />
            <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar yAxisId="left" dataKey="count" name="业务量" fill="#8884d8" barSize={30} radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="successRate" name="办成率" stroke="#82ca9d" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OperatorWorkloadChart;