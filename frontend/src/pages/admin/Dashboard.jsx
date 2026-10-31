import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, Inbox, Loader, Sparkles } from 'lucide-react';
import PageHeader from '../../components/admin/PageHeader';
import RangeSelector from '../../components/admin/RangeSelector';
import StatCard from '../../components/admin/StatCard';
import InquiryTable from '../../components/admin/InquiryTable';
import InquiryDetailPanel from '../../components/admin/InquiryDetailPanel';
import TrendChart from '../../components/admin/charts/TrendChart';
import DonutChart from '../../components/admin/charts/DonutChart';
import ActivityWidget from '../../components/admin/widgets/ActivityWidget';
import StatusProgressWidget from '../../components/admin/widgets/StatusProgressWidget';
import CategoryWidget from '../../components/admin/widgets/CategoryWidget';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { ErrorState, Skeleton } from '../../components/ui/Feedback';
import { PageTransition } from '../../components/ui/Motion';
import { useAsync } from '../../hooks/useAsync';
import { useInquiryActions } from '../../hooks/useInquiryActions';
import { useAuth } from '../../context/AuthContext';
import { dashboardService } from '../../services/dashboardService';
import { inquiryService } from '../../services/inquiryService';
import { DATE_RANGE_OPTIONS, USER_TYPE_COLORS } from '../../utils/constants';

const VALID_RANGES = DATE_RANGE_OPTIONS.map((o) => o.value);

export default function Dashboard() {
  const { admin } = useAuth();
  const [params, setParams] = useSearchParams();
  const range = VALID_RANGES.includes(params.get('range')) ? params.get('range') : '30d';
  const setRange = (value) => setParams(value === '30d' ? {} : { range: value }, { replace: true });

  const statsFetcher = useCallback(() => dashboardService.stats(range), [range]);
  const analyticsFetcher = useCallback(() => dashboardService.analytics(range), [range]);
  const recentFetcher = useCallback(() => inquiryService.list({ limit: 6 }), []);

  const stats = useAsync(statsFetcher, [statsFetcher]);
  const analytics = useAsync(analyticsFetcher, [analyticsFetcher]);
  const recent = useAsync(recentFetcher, [recentFetcher]);

  const [selectedId, setSelectedId] = useState(null);

  const { refetch: refetchStats } = stats;
  const { refetch: refetchAnalytics } = analytics;
  const { refetch: refetchRecent } = recent;
  const refreshAll = useCallback(() => {
    refetchStats({ silent: true });
    refetchAnalytics({ silent: true });
    refetchRecent({ silent: true });
  }, [refetchStats, refetchAnalytics, refetchRecent]);

  // Inquiries submitted elsewhere (e.g. notifications) – keep numbers fresh
  useEffect(() => {
    window.addEventListener('inquiries:changed', refreshAll);
    return () => window.removeEventListener('inquiries:changed', refreshAll);
  }, [refreshAll]);

  const actions = useInquiryActions({
    onUpdated: (updated) => {
      recent.setData((prev) =>
        prev ? { ...prev, inquiries: prev.inquiries.map((i) => (i.id === updated.id ? updated : i)) } : prev
      );
    },
    onDeleted: (id) => {
      recent.setData((prev) => (prev ? { ...prev, inquiries: prev.inquiries.filter((i) => i.id !== id) } : prev));
      setSelectedId((current) => (current === id ? null : current));
    },
  });

  const totals = stats.data?.totals;
  const changes = stats.data?.changes || {};
  const sparklines = stats.data?.sparklines || {};
  const firstName = admin?.name?.split(' ')[0];

  return (
    <PageTransition>
      <PageHeader
        title="Overview"
        subtitle={`Welcome back${firstName ? `, ${firstName}` : ''}. Here's what's happening with your inquiries.`}
        actions={<RangeSelector value={range} onChange={setRange} id="dashboard" />}
      />

      {/* Stats */}
      {stats.error ? (
        <Card className="mb-6">
          <ErrorState message={stats.error.message} onRetry={() => stats.refetch()} />
        </Card>
      ) : (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.loading && !stats.data ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="min-h-[172px] rounded-xl3" />)
          ) : (
            <>
              <StatCard index={0} tone="dark" label="Total inquiries" icon={Inbox} value={totals?.total ?? 0} change={changes.total} sparkline={sparklines.total} />
              <StatCard index={1} tone="lavender" label="New inquiries" icon={Sparkles} value={totals?.new ?? 0} change={changes.new} sparkline={sparklines.new} />
              <StatCard index={2} tone="coral" label="In progress" icon={Loader} value={totals?.inProgress ?? 0} change={changes.inProgress} sparkline={sparklines.inProgress} />
              <StatCard index={3} tone="sage" label="Resolved" icon={CheckCircle2} value={totals?.resolved ?? 0} change={changes.resolved} sparkline={sparklines.resolved} />
            </>
          )}
        </div>
      )}

      {/* Trend + widgets */}
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Inquiry trends"
            subtitle="Submissions over time, with how many were resolved"
            action={
              <Link to="/admin/analytics">
                <Button variant="secondary" size="sm" iconRight={ArrowUpRight}>
                  Full analytics
                </Button>
              </Link>
            }
          />
          {analytics.error ? (
            <ErrorState message={analytics.error.message} onRetry={() => analytics.refetch()} />
          ) : analytics.loading && !analytics.data ? (
            <Skeleton className="h-[280px]" />
          ) : (
            <TrendChart trend={analytics.data?.trend} />
          )}
        </Card>

        <StatusProgressWidget totals={totals} resolutionRate={stats.data?.resolutionRate} loading={stats.loading && !stats.data} />
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <CategoryWidget byCategory={analytics.data?.byCategory} loading={analytics.loading && !analytics.data} />

        <Card>
          <CardHeader title="By user type" subtitle="Who is reaching out" />
          {analytics.loading && !analytics.data ? (
            <Skeleton className="h-[200px]" />
          ) : (
            <DonutChart data={analytics.data?.byUserType || []} colors={USER_TYPE_COLORS} centerLabel="People" height={170} emptyTitle="No inquiries yet" />
          )}
        </Card>

        <ActivityWidget items={analytics.data?.recentActivity} loading={analytics.loading && !analytics.data} />
      </div>

      {/* Recent inquiries */}
      <Card padding="p-4 sm:p-6">
        <CardHeader
          className="px-2"
          title="Recent inquiries"
          subtitle="The latest submissions across all channels"
          action={
            <Link to="/admin/inquiries">
              <Button variant="secondary" size="sm" iconRight={ArrowUpRight}>
                View all
              </Button>
            </Link>
          }
        />
        <InquiryTable
          compact
          inquiries={recent.data?.inquiries || []}
          loading={recent.loading && !recent.data}
          error={recent.error}
          onRetry={() => recent.refetch()}
          onView={(inq) => setSelectedId(inq.id)}
          onStatusChange={actions.updateStatus}
          onDelete={actions.requestDelete}
          updatingId={actions.updatingId}
          emptyTitle="No inquiries yet"
          emptyDescription="Once visitors submit the public form, their inquiries appear here."
          emptyAction={
            <Link to="/inquire" target="_blank" rel="noopener">
              <Button variant="secondary" size="sm" iconRight={ArrowUpRight}>
                Open public form
              </Button>
            </Link>
          }
        />
      </Card>

      <InquiryDetailPanel
        inquiryId={selectedId}
        open={!!selectedId}
        onClose={() => setSelectedId(null)}
        onStatusChange={actions.updateStatus}
        onDelete={actions.requestDelete}
        updating={actions.updatingId === selectedId}
      />

      <ConfirmDialog
        open={!!actions.deleteTarget}
        onClose={actions.cancelDelete}
        onConfirm={actions.confirmDelete}
        loading={actions.deleting}
        title="Delete this inquiry?"
        confirmLabel="Delete"
        description={
          actions.deleteTarget
            ? `This permanently removes the inquiry from ${actions.deleteTarget.name}. This action cannot be undone.`
            : ''
        }
      />
    </PageTransition>
  );
}
