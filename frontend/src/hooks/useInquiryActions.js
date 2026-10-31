import { useCallback, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { inquiryService } from '../services/inquiryService';

/** Broadcast so other widgets (nav badge, stats) can refresh. */
export const notifyInquiriesChanged = () => window.dispatchEvent(new Event('inquiries:changed'));

/**
 * Shared status-update and delete flows (with confirmation) used by the
 * dashboard and the inquiries page.
 *
 * @param {object} opts
 * @param {(inquiry) => void} [opts.onUpdated]  called with the fresh inquiry
 * @param {(id) => void}      [opts.onDeleted]
 */
export function useInquiryActions({ onUpdated, onDeleted } = {}) {
  const toast = useToast();
  const [updatingId, setUpdatingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const updateStatus = useCallback(
    async (inquiry, status) => {
      if (!inquiry || inquiry.status === status) return null;
      setUpdatingId(inquiry.id);
      try {
        const { inquiry: updated, message } = await inquiryService.updateStatus(inquiry.id, status);
        onUpdated?.(updated);
        notifyInquiriesChanged();
        toast.success(message);
        return updated;
      } catch (err) {
        toast.error(err.message || 'Could not update status');
        return null;
      } finally {
        setUpdatingId(null);
      }
    },
    [onUpdated, toast]
  );

  const requestDelete = useCallback((inquiry) => setDeleteTarget(inquiry), []);
  const cancelDelete = useCallback(() => {
    if (!deleting) setDeleteTarget(null);
  }, [deleting]);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return false;
    setDeleting(true);
    try {
      await inquiryService.remove(deleteTarget.id);
      onDeleted?.(deleteTarget.id);
      notifyInquiriesChanged();
      toast.success(`Inquiry from ${deleteTarget.name} deleted`);
      setDeleteTarget(null);
      return true;
    } catch (err) {
      toast.error(err.message || 'Could not delete inquiry');
      return false;
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, onDeleted, toast]);

  return { updatingId, updateStatus, deleteTarget, requestDelete, cancelDelete, confirmDelete, deleting };
}
