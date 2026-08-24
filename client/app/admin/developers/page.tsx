"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Users, ExternalLink, Loader2 } from "lucide-react";
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
import DeveloperForm from "../../../components/admin/forms/DeveloperForm";
import { useDevelopers, DeveloperItem } from "../../../hooks/useDevelopers";

export default function AdminDevelopersPage() {
  const {
    developers,
    total,
    page,
    pageSize,
    loading,
    error,
    search,
    setSearch,
    setPage,
    createDeveloper,
    updateDeveloper,
    deleteDeveloper,
  } = useDevelopers();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingDeveloper, setEditingDeveloper] = useState<DeveloperItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleOpenCreate = () => {
    setEditingDeveloper(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (developer: DeveloperItem) => {
    setEditingDeveloper(developer);
    setFormModalOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    if (editingDeveloper) {
      await updateDeveloper(editingDeveloper.id, data);
    } else {
      await createDeveloper(data);
    }
    setFormModalOpen(false);
    setEditingDeveloper(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteDeveloper(deleteId);
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
        title="Developers & Partners"
        subtitle="Manage collaborating real estate developers and building consortiums"
        action={
          <button
            onClick={handleOpenCreate}
            className="h-10 px-4 rounded-xl bg-[var(--brand)] text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm shadow-[var(--brand)]/20 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Developer</span>
          </button>
        }
      />

      <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="max-w-md">
          <SearchInput
            placeholder="Search developers by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
          />
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 border border-[var(--border)] rounded-2xl bg-[var(--surface)]">
            <Loader2 className="animate-spin text-[var(--brand)]" size={32} />
            <p className="text-sm text-[var(--text-muted)]">Loading developers...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 text-[var(--destructive)] text-sm">
            {error}
          </div>
        ) : developers.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-[var(--border)] rounded-2xl bg-[var(--surface)]/50">
            <Users className="mx-auto text-[var(--text-muted)] mb-3" size={40} />
            <h3 className="text-base font-semibold text-[var(--text-primary)]">No developers found</h3>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Add developer profiles to associate them with projects.
            </p>
            <button
              onClick={handleOpenCreate}
              className="mt-4 h-10 px-4 rounded-xl bg-[var(--brand)] text-white text-sm font-medium hover:opacity-90 inline-flex items-center gap-2"
            >
              <Plus size={16} />
              Add Developer
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Developer</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead>Active Projects</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {developers.map((developer) => (
                    <TableRow key={developer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {developer.logo ? (
                            <img
                              src={developer.logo}
                              alt={developer.name}
                              className="h-10 w-10 rounded-lg object-contain p-1 bg-white border border-[var(--border)]"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] font-bold">
                              {developer.name[0]}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-[var(--text-primary)]">
                              {developer.name}
                            </div>
                            {developer.description && (
                              <div className="text-xs text-[var(--text-muted)] line-clamp-1 max-w-sm">
                                {developer.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="text-xs font-mono text-[var(--text-secondary)]">
                          /{developer.slug}
                        </span>
                      </TableCell>

                      <TableCell>
                        {developer.website ? (
                          <a
                            href={developer.website}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-[var(--brand)] hover:underline"
                          >
                            <span>Visit Site</span>
                            <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span className="text-xs text-[var(--text-muted)]">—</span>
                        )}
                      </TableCell>

                      <TableCell>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text-secondary)]">
                          {developer._count?.projects || 0} Projects
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(developer)}
                            title="Edit Developer"
                            className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteId(developer.id)}
                            title="Delete Developer"
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
        <DeveloperForm
          developer={editingDeveloper}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Confirm Developer Deletion
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Are you sure you want to delete this developer profile?
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
              Delete Developer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
