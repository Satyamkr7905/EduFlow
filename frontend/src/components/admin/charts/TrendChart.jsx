import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartTooltip from './ChartTooltip';
import { COLORS } from '../../../utils/constants';
import { formatBucket } from '../../../utils/format';
import { EmptyState } from '../../ui/Feedback';
import { TrendingUp } from 'lucide-react';

export default function TrendChart({ trend = [], height = 280, stacked = false }) {
  const data = useMemo(
    () =>
      trend.map((t) => ({
        label: formatBucket(t.bucket, t.unit),
        Total: t.total,
        New: t.new,
        'In Progress': t.inProgress,
        Resolved: t.resolved,
      })),
    [trend]
  );

  const hasData = data.some((d) => d.Total > 0);
  if (!hasData) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="No inquiries in this period"
        description="Trends will appear here as inquiries come in."
        className="py-10"
      />
    );
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id="trend-total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.ink} stopOpacity={0.18} />
              <stop offset="100%" stopColor={COLORS.ink} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="trend-resolved" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.sageDark} stopOpacity={0.35} />
              <stop offset="100%" stopColor={COLORS.sageDark} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={COLORS.line} strokeDasharray="3 6" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: COLORS.muted }}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: COLORS.muted }} />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: COLORS.line }} />
          {stacked ? (
            <>
              <Area type="monotone" dataKey="New" stackId="1" stroke={COLORS.lavenderDark} fill={COLORS.lavender} fillOpacity={0.8} animationDuration={900} />
              <Area type="monotone" dataKey="In Progress" stackId="1" stroke={COLORS.coral} fill={COLORS.coral} fillOpacity={0.55} animationDuration={900} />
              <Area type="monotone" dataKey="Resolved" stackId="1" stroke={COLORS.sageDark} fill={COLORS.sage} fillOpacity={0.9} animationDuration={900} />
            </>
          ) : (
            <>
              <Area type="monotone" dataKey="Total" stroke={COLORS.ink} strokeWidth={2} fill="url(#trend-total)" animationDuration={900} />
              <Area type="monotone" dataKey="Resolved" stroke={COLORS.sageDark} strokeWidth={2} fill="url(#trend-resolved)" animationDuration={900} />
            </>
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
