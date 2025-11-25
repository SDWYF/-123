import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AnalysisSummary } from '../../types';

interface Props {
  data: AnalysisSummary;
}

const BusinessBySubjectChart: React.FC<Props> = ({ data }) => {
  // Transform data for the chart: We want to show the top businesses for the top subjects
  // Since businesses vary per subject, a simple stacked chart is hard. 
  // We will create a flat list that highlights the top business for each subject
  
  const chartData = data.businessBySubject.flatMap(subjectGroup => 
    subjectGroup.data.slice(0, 3).map(biz => ({
        subject: subjectGroup.subject,
        business: biz.name,
        count: biz.count,
        label: `${biz.name}`
    }))
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-[450px]">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">进厅高频业务分析 (按主体分类)</h3>
      <div className="flex-1 w-full min-h-0 overflow-y-auto">
         {/* Custom List Visualization for better readability than a complex chart */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.businessBySubject.map((group, idx) => (
                <div key={idx} className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                    <h4 className="font-bold text-gray-700 mb-3 flex items-center">
                        <span className="w-2 h-6 bg-blue-500 rounded-sm mr-2"></span>
                        {group.subject}
                    </h4>
                    <div className="space-y-2">
                        {group.data.slice(0, 5).map((biz, bIdx) => (
                            <div key={bIdx} className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 truncate mr-2" title={biz.name}>{biz.name}</span>
                                <div className="flex items-center">
                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                                        <div 
                                            className="h-full bg-blue-400" 
                                            style={{ width: `${(biz.count / group.data[0].count) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="font-mono text-gray-700 w-6 text-right">{biz.count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default BusinessBySubjectChart;