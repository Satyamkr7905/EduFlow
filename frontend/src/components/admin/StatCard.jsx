import { motion } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { useCountUp } from '../../hooks/useCountUp';
import { formatNumber } from '../../utils/format';
import { cn } from '../../utils/cn';
import { COLORS } from '../../utils/constants';

const TONES = {
  dark: { card: 'bg-ink text-white', label: 'text-white/60', line: COLORS.sage, fill: COLORS.sage, chip: 'bg-white/10 text-white' },
  lavender: { card: 'bg-lavender text-ink', label: 'text-ink/60', line: COLORS.ink, fill: COLORS.ink, chip: 'bg-white/60 text-ink' },
  coral: { card: 'bg-coral text-white', label: 'text-white/70', line: '#FFFFFF', fill: '#FFFFFF', chip: 'bg-white/20 text-white' },
  sage: { card: 'bg-sage text-ink', label: 'text-ink/60', line: COLORS.ink, fill: COLORS.ink, chip: 'bg-white/60 text-ink' },
};

export default function StatCard({ label, value, change, sparkline = [], tone = 'dark', icon: Icon, hint, index = 0 }) {
  const animated = useCountUp(value);
  const t = TONES[tone];
  const chartData = sparkline.map((v, i) => ({ i, v }));
  const gradientId = `spark-${tone}`;

  const trend = change === null || change === undefined ? null : change > 0 ? 'up' : change < 0 ? 'down' : 'flat';
  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className={cn('relative flex min-h-[172px] flex-col justify-between overflow-hidden rounded-xl3 p-5 shadow-soft', t.card)}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={cn('text-xs font-medium', t.label)}>{label}</p>
          <p className="mt-1.5 font-heading text-4xl font-semibold leading-none tracking-tight">
            {formatNumber(animated)}
          </p>
        </div>
        {Icon && (
          <span className={cn('flex h-9 w-9 items-center justify-center rounded-full', t.chip)}>
            <Icon size={16} />
          </span>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          {trend ? (
            <span className={cn('pill', t.chip)}>
              <TrendIcon size={13} />
              {Math.abs(change)}%
              <span className="opacity-70">vs prev.</span>
            </span>
          ) : (
            <span className={cn('pill', t.chip)}>{hint || 'All time'}</span>
          )}
        </div>
        <div className="h-12 w-28 shrink-0">
          {chartData.length > 1 && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={t.fill} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={t.fill} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={t.line}
                  strokeWidth={2}
                  fill={`url(#${gradientId})`}
                  isAnimationActive
                  animationDuration={900}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </motion.div>
  );
}
