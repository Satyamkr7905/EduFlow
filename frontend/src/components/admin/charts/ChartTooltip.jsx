/** Shared tooltip that matches the design system instead of Recharts' default. */
export default function ChartTooltip({ active, payload, label, labelFormatter, valueFormatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-line bg-white px-3.5 py-2.5 shadow-lift">
      {label !== undefined && (
        <p className="mb-1 text-xs font-medium text-muted">{labelFormatter ? labelFormatter(label, payload) : label}</p>
      )}
      <ul className="space-y-1">
        {payload.map((entry) => (
          <li key={entry.dataKey || entry.name} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: entry.color || entry.payload?.fill }} />
            <span className="text-muted">{entry.name}</span>
            <span className="ml-auto font-semibold text-ink">
              {valueFormatter ? valueFormatter(entry.value, entry) : entry.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
