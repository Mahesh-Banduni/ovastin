"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Trophy, Loader2, Check, X } from "lucide-react";
import AdminHeader from "../../../components/admin/AdminHeader";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../../components/ui/store/Table";
import Modal from "../../../components/ui/store/Modal";
import SearchInput from "../../../components/ui/store/SearchInput";
import Pagination from "../../../components/ui/store/Pagination";
import AwardForm from "../../../components/admin/forms/AwardForm";
import { useAwards, AwardItem } from "../../../hooks/useAwards";

export default function AdminAwardsPage() {
  const {
    awards,
    total,
    page,
    pageSize,
    loading,
    error,
    search,
    setSearch,
    setPage,
    createAward,
    updateAward,
    deleteAward,
  } = useAwards();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingAward, setEditingAward] = useState<AwardItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleOpenCreate = () => {
    setEditingAward(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (award: AwardItem) => {
    setEditingAward(award);
    setFormModalOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    if (editingAward) {
      await updateAward(editingAward.id, data);
    } else {
      await createAward(data);
    }
    setFormModalOpen(false);
    setEditingAward(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteAward(deleteId);
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div>
      <AdminHeader
        onOpenSidebar={() => {}}
        title="Awards & Recognitions"
        subtitle="Manage honors, industry certificates, and architectural milestones"
        action={
          <button
            onClick={handleOpenCreate}
            className="h-10 px-4 rounded-xl bg-[var(--brand)] text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm shadow-[var(--brand)]/20 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Award</span>
          </button>
        }
      />

      <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="max-w-md">
          <SearchInput
            placeholder="Search awards by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
          />
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 border border-[var(--border)] rounded-2xl bg-[var(--surface)]">
            <Loader2 className="animate-spin text-[var(--brand)]" size={32} />
            <p className="text-sm text-[var(--text-muted)]">Loading awards...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 text-[var(--destructive)] text-sm">
            {error}
          </div>
        ) : awards.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-[var(--border)] rounded-2xl bg-[var(--surface)]/50">
            <Trophy className="mx-auto text-[var(--text-muted)] mb-3" size={40} />
            <h3 className="text-base font-semibold text-[var(--text-primary)]">No awards found</h3>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Add your firm's accolades to display credibility on the website.
            </p>
            <button
              onClick={handleOpenCreate}
              className="mt-4 h-10 px-4 rounded-xl bg-[var(--brand)] text-white text-sm font-medium hover:opacity-90 inline-flex items-center gap-2"
            >
              <Plus size={16} />
              Add Award
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Award / Honor</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {awards.map((award) => (
                    <TableRow key={award.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {award.imageUrl ? (
                            <img
                              src={award.imageUrl}
                              alt={award.name}
                              className="h-10 w-10 rounded-lg object-cover border border-[var(--border)]"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--border)] flex items-center justify-center">
                              <Trophy size={18} />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-[var(--text-primary)]">
                              {award.name}
                            </div>
                            {award.description && (
                              <div className="text-xs text-[var(--text-muted)] line-clamp-1 max-w-sm">
                                {award.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          {award.year || "—"}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="text-sm text-[var(--text-secondary)] font-mono">
                          {award.sortOrder}
                        </span>
                      </TableCell>

                      <TableCell>
                        {award.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            <Check size={12} />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-600 border border-zinc-500/20">
                            <X size={12} />
                            Inactive
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(award)}
                            title="Edit Award"
                            className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteId(award.id)}
                            title="Delete Award"
                            className="p-2 rounded-lg hover:bg-[var(--destructive)]/10 text-[var(--text-secondary)] hover:text-[var(--destructive)] transition-colors cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
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
      </div>

      {/* Create / Edit Modal */}
      <Modal open={formModalOpen} onClose={() => setFormModalOpen(false)}>
        <AwardForm
          award={editingAward}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Confirm Award Deletion
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Are you sure you want to delete this award record?
          </p>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
            <button
              onClick={() => setDeleteId(null)}
              disabled={deleting}
              className="h-10 px-4 rounded-xl border border-[var(--border)] text-sm font-medium hover:bg-[var(--surface-hover)]"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="h-10 px-5 rounded-xl bg-[var(--destructive)] text-white text-sm font-medium hover:opacity-90 flex items-center gap-2 cursor-pointer"
            >
              {deleting && <Loader2 size={16} className="animate-spin" />}
              Delete Award
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
