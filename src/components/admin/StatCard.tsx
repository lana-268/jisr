import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  iconBg: string;
  trend?: string;
  trendColor?: string;
  loading?: boolean;
}

export function StatCard({ label, value, icon, iconBg, trend, trendColor = 'text-emerald-600', loading }: StatCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 animate-pulse">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-4 bg-slate-200 rounded w-24" />
            <div className="h-8 bg-slate-200 rounded w-16" />
            <div className="h-3 bg-slate-200 rounded w-32" />
          </div>
          <div className="w-12 h-12 bg-slate-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow duration-200 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 tabular-nums">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {trend && (
            <p className={`mt-1.5 text-xs font-medium ${trendColor}`}>{trend}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200 ${iconBg}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
