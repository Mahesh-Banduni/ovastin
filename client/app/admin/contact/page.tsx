"use client";

import { useState } from "react";
import { Inbox, Trash2, Mail, Phone, Clock, Eye, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../../components/ui/store/Table";
import Modal from "../../../components/ui/store/Modal";
import Pagination from "../../../components/ui/store/Pagination";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import { useContact, ContactSubmission } from "../../../hooks/useContact";
import Button from "@/components/ui/store/Button";
import Tabs from "@/components/ui/store/Tabs";

export default function AdminContactPage() {
  const {
    submissions,
    total,
    page,
    pageSize,
    loading,
    error,
    isReadFilter,
    setIsReadFilter,
    setPage,
    markRead,
    deleteSubmission,
  } = useContact();

  const [activeSubmission, setActiveSubmission] = useState<ContactSubmission | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleOpenDetail = async (item: ContactSubmission) => {
    setActiveSubmission(item);
    if (!item.isRead) {
      await markRead(item.id);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteSubmission(deleteId);
      if (activeSubmission?.id === deleteId) {
        setActiveSubmission(null);
      }
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* ── Top Page Header Banner ─────────────────────────── */}
      <AdminPageHeader
        icon={Inbox}
        title="Contact Form Submissions"
        subtitle="Review client inquiries, property requests, and consultation leads."
        count={total}
        countLabel="total"
      />
        {/* Status Filter Tabs */}
        <Tabs
          tabs={[{ label: "All Inquiries", value: "all" }, { label: "Unread Only", value: "unread" }, { label: "Read Only", value: "read" }]}
          active={isReadFilter === undefined ? "all" : isReadFilter ? "read" : "unread"}
          onChange={(value) => setIsReadFilter(value === "all" ? undefined : value === "read")}
        />

        {/* Content Section */}
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 border border-[var(--border)] rounded-2xl bg-[var(--surface)]">
            <Loader2 className="animate-spin text-[var(--brand)]" size={32} />
            <p className="text-sm text-[var(--text-muted)]">Loading submissions...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 text-[var(--destructive)] text-sm">
            {error}
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-[var(--border)] rounded-2xl bg-[var(--surface)]/50">
            <Inbox className="mx-auto text-[var(--text-muted)] mb-3" size={40} />
            <h3 className="text-base font-semibold text-[var(--text-primary)]">No messages received</h3>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Contact submissions from the website will appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sender Name</TableHead>
                    <TableHead>Contact Information</TableHead>
                    <TableHead>Message Snippet</TableHead>
                    <TableHead>Received Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((sub) => (
                    <TableRow key={sub.id} className={!sub.isRead ? "bg-[var(--brand)]/[0.02]" : ""}>
                      <TableCell>
                        <div className="font-semibold text-[var(--text-primary)]">
                          {sub.name}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-[var(--text-primary)]">
                            <Mail size={12} className="text-[var(--text-muted)]" />
                            <span>{sub.email}</span>
                          </div>
                          {sub.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                              <Phone size={12} />
                              <span>{sub.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <p className="text-xs text-[var(--text-secondary)] line-clamp-1 max-w-xs">
                          {sub.message}
                        </p>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] whitespace-nowrap">
                          <Clock size={12} />
                          <span>
                            {new Date(sub.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        {sub.isRead ? (
                          <span className="text-xs font-medium text-[var(--text-muted)]">
                            Read
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]/20">
                            New Unread
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button variant="ghost"
                            onClick={() => handleOpenDetail(sub)}
                            title="View Full Message"
                            className="h-8 w-8 p-2 text-[var(--text-secondary)]"
                          >
                            <Eye size={16} />
                          </Button>
                          <Button variant="ghost"
                            onClick={() => setDeleteId(sub.id)}
                            title="Delete Inquiry"
                            className="h-8 w-8 p-2 text-[var(--text-secondary)] hover:text-[var(--destructive)]"
                          >
                            <Trash2 size={16} style={{ color: "var(--text-primary)" }} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border border-[var(--border)] rounded-xl bg-[var(--surface)]">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  totalResults={total}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        )}

      {/* View Message Detail Modal */}
      <Modal open={!!activeSubmission} onClose={() => setActiveSubmission(null)}>
        {activeSubmission && (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Message from {activeSubmission.name}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Received on {new Date(activeSubmission.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs">
              <div>
                <span className="text-[var(--text-muted)] block">Email:</span>
                <span className="font-medium text-[var(--text-primary)]">{activeSubmission.email}</span>
              </div>
              <div>
                <span className="text-[var(--text-muted)] block">Phone:</span>
                <span className="font-medium text-[var(--text-primary)]">{activeSubmission.phone || "Not provided"}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-[var(--text-primary)]">Full Message</span>
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
                {activeSubmission.message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
              <Button variant="danger"
                type="button"
                onClick={() => {
                  setDeleteId(activeSubmission.id);
                }}
                className="h-8 px-2 text-xs text-[var(--destructive)]"
              >
                <Trash2 size={14} />
                Delete Submission
              </Button>

              <Button variant="outline"
                type="button"
                onClick={() => setActiveSubmission(null)}
                className="h-10 px-5"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Delete Contact Submission
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Are you sure you want to permanently delete this contact inquiry?
          </p>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
            <Button variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={deleting}
              className="h-10 px-4"
            >
              Cancel
            </Button>
            <Button variant="danger"
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="h-10 px-5"
            >
              {deleting && <Loader2 size={16} className="animate-spin" />}
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
