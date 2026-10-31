import { useCallback, useEffect, useState } from 'react';
import { Calendar, Copy, Mail, Phone, RefreshCcw, Tag, Trash2, UserRound } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ErrorState, Skeleton } from '../ui/Feedback';
import StatusSelect from './StatusSelect';
import { useToast } from '../../context/ToastContext';
import { inquiryService } from '../../services/inquiryService';
import { formatDateTime, timeAgo } from '../../utils/format';

function Field({ icon: Icon, label, children, action }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-cream px-4 py-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-soft">
        <Icon size={14} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">{label}</p>
        <div className="mt-0.5 break-words text-sm font-medium text-ink">{children}</div>
      </div>
      {action}
    </div>
  );
}

/**
 * Side panel showing the full inquiry. Always fetches a fresh copy by id so the
 * message and timestamps are exact, even when opened from a notification link.
 */
export default function InquiryDetailPanel({ inquiryId, open, onClose, onStatusChange, onDelete, updating = false }) {
  const toast = useToast();
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!inquiryId) return;
    setLoading(true);
    setError(null);
    try {
      setInquiry(await inquiryService.get(inquiryId));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [inquiryId]);

  useEffect(() => {
    if (open) load();
    else setInquiry(null);
  }, [open, load]);

  const handleStatus = async (status) => {
    const updated = await onStatusChange?.(inquiry, status);
    if (updated) setInquiry(updated);
  };

  const copy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied`);
    } catch {
      toast.error('Clipboard is not available');
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      variant="side"
      title="Inquiry details"
      description={inquiry ? `Received ${timeAgo(inquiry.created_at)}` : undefined}
      footer={
        inquiry && (
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            {onDelete ? (
              <Button variant="danger" icon={Trash2} onClick={() => onDelete(inquiry)}>
                Delete inquiry
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <a href={`mailto:${inquiry.email}?subject=${encodeURIComponent(`Re: your ${inquiry.category} inquiry`)}`}>
                <Button variant="secondary" icon={Mail}>
                  Reply by email
                </Button>
              </a>
              <a href={`tel:${inquiry.phone.replace(/[^\d+]/g, '')}`}>
                <Button icon={Phone}>Call</Button>
              </a>
            </div>
          </div>
        )
      }
    >
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
          <Skeleton className="h-40" />
        </div>
      ) : error ? (
        <ErrorState message={error.message} onRetry={load} />
      ) : inquiry ? (
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Avatar name={inquiry.name} size="lg" />
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-heading text-xl font-semibold text-ink">{inquiry.name}</h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <Badge tone="outline">{inquiry.user_type}</Badge>
                <Badge tone="sand">{inquiry.category}</Badge>
              </div>
            </div>
          </div>

          <div className="rounded-xl3 border border-line p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Current status</p>
                <p className="mt-0.5 text-xs text-muted">Last updated {timeAgo(inquiry.updated_at)}</p>
              </div>
              <StatusSelect value={inquiry.status} onChange={handleStatus} loading={updating} size="md" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              icon={Mail}
              label="Email"
              action={
                <button type="button" onClick={() => copy(inquiry.email, 'Email')} className="rounded-full p-1.5 text-muted hover:bg-white hover:text-ink" aria-label="Copy email">
                  <Copy size={14} />
                </button>
              }
            >
              <a href={`mailto:${inquiry.email}`} className="hover:underline">
                {inquiry.email}
              </a>
            </Field>
            <Field
              icon={Phone}
              label="Phone"
              action={
                <button type="button" onClick={() => copy(inquiry.phone, 'Phone number')} className="rounded-full p-1.5 text-muted hover:bg-white hover:text-ink" aria-label="Copy phone">
                  <Copy size={14} />
                </button>
              }
            >
              <a href={`tel:${inquiry.phone}`} className="hover:underline">
                {inquiry.phone}
              </a>
            </Field>
            <Field icon={UserRound} label="User type">
              {inquiry.user_type}
            </Field>
            <Field icon={Tag} label="Category">
              {inquiry.category}
            </Field>
            <Field icon={Calendar} label="Submitted">
              {formatDateTime(inquiry.created_at)}
            </Field>
            <Field icon={RefreshCcw} label="Last updated">
              {formatDateTime(inquiry.updated_at)}
            </Field>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted">Message</p>
            <div className="whitespace-pre-wrap rounded-xl3 bg-sand/60 p-5 text-sm leading-relaxed text-ink">
              {inquiry.message}
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-muted">ID {inquiry.id}</p>
        </div>
      ) : null}
    </Modal>
  );
}
