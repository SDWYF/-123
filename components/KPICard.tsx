import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  colorClass: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, subtext, icon, colorClass }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
      </div>
      <div className={`p-3 rounded-lg ${colorClass}`}>
        {icon}
      </div>
    </div>
  );
};

export default KPICard;
