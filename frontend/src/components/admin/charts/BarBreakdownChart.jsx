import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart3 } from 'lucide-react';
import ChartTooltip from './ChartTooltip';
import { EmptyState } from '../../ui/Feedback';
import { COLORS } from '../../../utils/constants';

/** Rounded vertical bars – used for "Inquiries by user type". */
export default function BarBreakdownChart({ data = [], colors = {}, height = 220, emptyTitle = 'No data yet' }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) {
    return <EmptyState icon={BarChart3} title={emptyTitle} description="Data appears here as inquiries arrive." className="py-8" />;
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -22 }} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke={COLORS.line} strokeDasharray="3 6" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: COLORS.muted }} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: COLORS.muted }} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(23,23,23,0.04)' }} />
          <Bar dataKey="value" name="Inquiries" radius={[12, 12, 12, 12]} animationDuration={900} animationEasing="ease-out" maxBarSize={56}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={colors[entry.name] || COLORS.sand} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
