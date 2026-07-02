import React from 'react';

const StatCard = ({ title, value, icon: Icon, description, color = 'indigo' }) => {
  const colorMap = {
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-500/20',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-500/20',
    amber: 'text-amber-600 bg-amber-50 border-amber-500/20',
    rose: 'text-rose-600 bg-rose-50 border-rose-500/20',
  };

  return (
    <div className="glass-panel glass-panel-hover p-8 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-50 transition-all duration-300"></div>

      <div className="space-y-1.5 z-10">
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-none pt-1">{value}</h3>
        {description && <p className="text-sm text-slate-500 pt-1.5">{description}</p>}
      </div>
      
      {Icon && (
        <div className={`p-4.5 rounded-xl border shrink-0 z-10 transition-transform duration-300 group-hover:scale-110 ${colorMap[color] || colorMap.indigo}`}>
          <Icon size={28} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
