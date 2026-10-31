import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, RefreshCw } from 'lucide-react';
import PageHeader from '../../components/admin/PageHeader';
import InquiryFilters from '../../components/admin/InquiryFilters';
import InquiryTable from '../../components/admin/InquiryTable';
import InquiryDetailPanel from '../../components/admin/InquiryDetailPanel';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Pagination } from '../../components/ui/Pagination';
import { PageTransition } from '../../components/ui/Motion';
import { useAsync } from '../../hooks/useAsync';
import { useDebounce } from '../../hooks/useDebounce';
import { useInquiryActions } from '../../hooks/useInquiryActions';
import { inquiryService } from '../../services/inquiryService';
import { CATEGORIES, STATUSES, USER_TYPES } from '../../utils/constants';
import { formatNumber } from '../../utils/format';

const FILTER_KEYS = ['search', 'status', 'category', 'user_type', 'from', 'to'];
const PAGE_SIZE = 10;

const sanitize = (key, value) => {
  if (!value) return '';
  if (key === 'status') return STATUSES.includes(value) ? value : '';
  if (key === 'category') return CATEGORIES.includes(value) ? value : '';
  if (key === 'user_type') return USER_TYPES.includes(value) ? value : '';
  if (key === 'from' || key === 'to') return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : '';
  return value;
};

export default function Inquiries() {
  const [params, setParams] = useSearchParams();

  // Everything meaningful lives in the URL → shareable, refresh-safe, back-button friendly.
  const filters = useMemo(
    () => Object.fromEntries(FILTER_KEYS.map((k) => [k, sanitize(k, params.get(k))])),
    [params]
  );
  const page = Math.max(1, Number(params.get('page')) || 1);
  const openId = params.get('open');

  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, 350);

  const updateParams = useCallback(
    (patch, { resetPage = true } = {}) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(patch)) {
            if (value === '' || value === null || value === undefined) next.delete(key);
            else next.set(key, String(value));
          }
          if (resetPage) next.delete('page');
          return next;
        },
        { replace: true }
      );
    },
    [setParams]
  );

  // Two-way sync between the search box and the URL without clobbering fast typing:
  // `lastSynced` remembers the last value that crossed the boundary in either direction.
  const lastSynced = useRef(filters.search);

  useEffect(() => {
    if (debouncedSearch !== lastSynced.current) {
      lastSynced.current = debouncedSearch;
      if (debouncedSearch !== filters.search) updateParams({ search: debouncedSearch });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    if (filters.search !== lastSynced.current) {
      lastSynced.current = filters.search;
      setSearchInput(filters.search);
    }
  }, [filters.search]);

  const fetcher = useCallback(
    () => inquiryService.list({ ...filters, page, limit: PAGE_SIZE }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters.search, filters.status, filters.category, filters.user_type, filters.from, filters.to, page]
  );
  const { data, loading, error, refetch, setData } = useAsync(fetcher, [fetcher]);

  // If the current page became empty after a delete, step back a page.
  useEffect(() => {
    if (data && data.inquiries.length === 0 && data.pagination.page > 1 && data.pagination.total > 0) {
      updateParams({ page: data.pagination.page - 1 }, { resetPage: false });
    }
  }, [data, updateParams]);

  const actions = useInquiryActions({
    onUpdated: (updated) =>
      setData((prev) =>
        prev ? { ...prev, inquiries: prev.inquiries.map((i) => (i.id === updated.id ? updated : i)) } : prev
      ),
    onDeleted: (id) => {
      setData((prev) =>
        prev
          ? {
              ...prev,
              inquiries: prev.inquiries.filter((i) => i.id !== id),
              pagination: { ...prev.pagination, total: Math.max(0, prev.pagination.total - 1) },
            }
          : prev
      );
      if (openId === id) updateParams({ open: '' }, { resetPage: false });
      refetch({ silent: true });
    },
  });

  const activeCount = FILTER_KEYS.filter((k) => filters[k]).length;
  const clearAll = () => {
    setSearchInput('');
    updateParams(Object.fromEntries(FILTER_KEYS.map((k) => [k, ''])));
  };

  const total = data?.pagination?.total;

  return (
    <PageTransition>
      <PageHeader
        title="Inquiries"
        subtitle={
          total === undefined
            ? 'Search, filter and manage every inquiry.'
            : `${formatNumber(total)} ${total === 1 ? 'inquiry' : 'inquiries'} match your current view.`
        }
        actions={
          <>
            <Button variant="secondary" size="sm" icon={RefreshCw} onClick={() => refetch()} loading={loading && !!data}>
              Refresh
            </Button>
            <Link to="/inquire" target="_blank" rel="noopener">
              <Button size="sm" iconRight={ArrowUpRight}>
                Public form
              </Button>
            </Link>
          </>
        }
      />

      <Card className="mb-4" padding="p-4 sm:p-5">
        <InquiryFilters
          filters={filters}
          onChange={(patch) => updateParams(patch)}
          onClear={clearAll}
          activeCount={activeCount}
          searchInput={searchInput}
          onSearchInput={setSearchInput}
        />
      </Card>

      <Card padding="p-3 sm:p-4">
        <InquiryTable
          inquiries={data?.inquiries || []}
          loading={loading && !data}
          error={error}
          onRetry={() => refetch()}
          onView={(inq) => updateParams({ open: inq.id }, { resetPage: false })}
          onStatusChange={actions.updateStatus}
          onDelete={actions.requestDelete}
          updatingId={actions.updatingId}
          emptyTitle={activeCount ? 'No inquiries match these filters' : 'No inquiries yet'}
          emptyDescription={
            activeCount
              ? 'Try widening your search or clearing a filter.'
              : 'Inquiries submitted on the public website will appear here.'
          }
          emptyAction={
            activeCount ? (
              <Button variant="secondary" size="sm" onClick={clearAll}>
                Clear all filters
              </Button>
            ) : undefined
          }
        />
        {data && data.pagination.total > 0 && (
          <Pagination
            className="border-t border-line px-2 pt-4 mt-2"
            pagination={data.pagination}
            onPageChange={(p) => updateParams({ page: p === 1 ? '' : p }, { resetPage: false })}
          />
        )}
      </Card>

      <InquiryDetailPanel
        inquiryId={openId}
        open={!!openId}
        onClose={() => updateParams({ open: '' }, { resetPage: false })}
        onStatusChange={actions.updateStatus}
        onDelete={actions.requestDelete}
        updating={actions.updatingId === openId}
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
