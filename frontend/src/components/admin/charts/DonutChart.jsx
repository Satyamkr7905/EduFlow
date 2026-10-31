import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import ChartTooltip from './ChartTooltip';
import { EmptyState } from '../../ui/Feedback';
import { COLORS } from '../../../utils/constants';

/**
 * Donut with a centred total and a legend list. `colors` maps name → hex.
 */
export default function DonutChart({ data = [], colors = {}, centerLabel = 'Total', height = 220, emptyTitle = 'No data yet' }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (!total) {
    return <EmptyState icon={PieIcon} title={emptyTitle} description="Data appears here as inquiries arrive." className="py-8" />;
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="relative shrink-0" style={{ width: height, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="68%"
              outerRadius="100%"
              paddingAngle={3}
              cornerRadius={8}
              stroke="none"
              animationDuration={900}
              animationEasing="ease-out"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={colors[entry.name] || COLORS.sand} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-3xl font-semibold text-ink">{total}</span>
          <span className="text-[11px] font-medium text-muted">{centerLabel}</span>
        </div>
      </div>

      <ul className="w-full space-y-2.5">
        {data.map((entry) => {
          const pct = Math.round((entry.value / total) * 100);
          return (
            <li key={entry.name} className="flex items-center gap-3 text-sm">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: colors[entry.name] || COLORS.sand }} />
              <span className="flex-1 truncate text-ink">{entry.name}</span>
              <span className="font-medium text-ink">{entry.value}</span>
              <span className="w-10 text-right text-xs text-muted">{pct}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
