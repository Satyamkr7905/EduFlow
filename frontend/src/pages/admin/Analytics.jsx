import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, RefreshCw } from 'lucide-react';
import PageHeader from '../../components/admin/PageHeader';
import RangeSelector from '../../components/admin/RangeSelector';
import TrendChart from '../../components/admin/charts/TrendChart';
import DonutChart from '../../components/admin/charts/DonutChart';
import BarBreakdownChart from '../../components/admin/charts/BarBreakdownChart';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ErrorState, Skeleton } from '../../components/ui/Feedback';
import { PageTransition } from '../../components/ui/Motion';
import { useAsync } from '../../hooks/useAsync';
import { useToast } from '../../context/ToastContext';
import { dashboardService } from '../../services/dashboardService';
import { CATEGORY_COLORS, DATE_RANGE_OPTIONS, STATUS_STYLES, USER_TYPE_COLORS } from '../../utils/constants';
import { formatBucket } from '../../utils/format';

const VALID_RANGES = DATE_RANGE_OPTIONS.map((o) => o.value);
const STATUS_COLORS = Object.fromEntries(Object.entries(STATUS_STYLES).map(([k, v]) => [k, v.color]));

export default function Analytics() {
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const range = VALID_RANGES.includes(params.get('range')) ? params.get('range') : '30d';
  const setRange = (value) => setParams(value === '30d' ? {} : { range: value }, { replace: true });

  const fetcher = useCallback(
    () => Promise.all([dashboardService.analytics(range), dashboardService.stats(range)]),
    [range]
  );
  const { data, loading, error, refetch } = useAsync(fetcher, [fetcher]);
  const [analytics, stats] = data || [];
  const isLoading = loading && !data;

  const insights = useMemo(() => {
    if (!analytics || !stats) return [];
    const topCategory = analytics.byCategory[0];
    const topUser = analytics.byUserType[0];
    const peak = analytics.trend.reduce((best, t) => (t.total > (best?.total ?? -1) ? t : best), null);
    const items = [];
    if (topCategory) items.push({ label: 'Most common category', value: topCategory.name, meta: `${topCategory.value} inquiries` });
    if (topUser) items.push({ label: 'Most active audience', value: topUser.name, meta: `${topUser.value} inquiries` });
    if (peak && peak.total > 0) items.push({ label: 'Busiest period', value: formatBucket(peak.bucket, peak.unit), meta: `${peak.total} received` });
    items.push({ label: 'Resolution rate', value: `${stats.resolutionRate}%`, meta: `${stats.totals.resolved} of ${stats.totals.total} resolved` });
    return items;
  }, [analytics, stats]);

  const exportCsv = () => {
    if (!analytics) return;
    const rows = [
      ['Period', 'Total', 'New', 'In Progress', 'Resolved'],
      ...analytics.trend.map((t) => [formatBucket(t.bucket, t.unit), t.total, t.new, t.inProgress, t.resolved]),
      [],
      ['Category', 'Count'],
      ...analytics.byCategory.map((c) => [c.name, c.value]),
      [],
      ['User type', 'Count'],
      ...analytics.byUserType.map((u) => [u.name, u.value]),
      [],
      ['Status', 'Count'],
      ...analytics.byStatus.map((s) => [s.name, s.value]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eduflow-analytics-${range}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Analytics exported as CSV');
  };

  return (
    <PageTransition>
      <PageHeader
        title="Analytics"
        subtitle="Understand where inquiries come from and how quickly they're resolved."
        actions={
          <>
            <RangeSelector value={range} onChange={setRange} id="analytics" />
            <Button variant="secondary" size="sm" icon={RefreshCw} onClick={() => refetch()} loading={loading && !!data}>
              Refresh
            </Button>
            <Button size="sm" icon={Download} onClick={exportCsv} disabled={!analytics}>
              Export CSV
            </Button>
          </>
        }
      />

      {error ? (
        <Card>
          <ErrorState message={error.message} onRetry={() => refetch()} />
        </Card>
      ) : (
        <>
          {/* Insight chips */}
          <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl3" />)
              : insights.map((item, i) => {
                  const tones = ['bg-ink text-white', 'bg-sage text-ink', 'bg-lavender text-ink', 'bg-sand text-ink'];
                  return (
                    <div key={item.label} className={`rounded-xl3 p-5 shadow-soft ${tones[i % tones.length]}`}>
                      <p className="text-xs font-medium opacity-70">{item.label}</p>
                      <p className="mt-1 truncate font-heading text-2xl font-semibold">{item.value}</p>
                      <p className="mt-0.5 text-xs opacity-70">{item.meta}</p>
                    </div>
                  );
                })}
          </div>

          <Card className="mb-4">
            <CardHeader title="Inquiry trends" subtitle="Stacked by status for the selected period" />
            {isLoading ? <Skeleton className="h-[320px]" /> : <TrendChart trend={analytics.trend} height={320} stacked />}
          </Card>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader title="By category" subtitle="Share of each inquiry type" />
              {isLoading ? <Skeleton className="h-[220px]" /> : <DonutChart data={analytics.byCategory} colors={CATEGORY_COLORS} centerLabel="Inquiries" />}
            </Card>
            <Card>
              <CardHeader title="By user type" subtitle="Parents, students and schools" />
              {isLoading ? <Skeleton className="h-[220px]" /> : <BarBreakdownChart data={analytics.byUserType} colors={USER_TYPE_COLORS} />}
            </Card>
            <Card>
              <CardHeader title="Status distribution" subtitle="Where inquiries sit right now" />
              {isLoading ? <Skeleton className="h-[220px]" /> : <DonutChart data={analytics.byStatus} colors={STATUS_COLORS} centerLabel="Inquiries" />}
            </Card>
          </div>
        </>
      )}
    </PageTransition>
  );
}
