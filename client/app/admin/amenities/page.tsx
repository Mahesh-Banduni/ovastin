"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Sparkles, Loader2 } from "lucide-react";
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
import AmenityForm from "../../../components/admin/forms/AmenityForm";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import { useAmenities, AmenityItem } from "../../../hooks/useAmenities";
import Button from "@/components/ui/store/Button";

export default function AdminAmenitiesPage() {
  const {
    amenities,
    total,
    page,
    pageSize,
    loading,
    error,
    search,
    setSearch,
    setPage,
    createAmenity,
    updateAmenity,
    deleteAmenity,
  } = useAmenities();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<AmenityItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleOpenCreate = () => {
    setEditingAmenity(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (amenity: AmenityItem) => {
    setEditingAmenity(amenity);
    setFormModalOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    if (editingAmenity) {
      await updateAmenity(editingAmenity.id, data);
    } else {
      await createAmenity(data);
    }
    setFormModalOpen(false);
    setEditingAmenity(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteAmenity(deleteId);
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
        icon={Sparkles}
        title="Amenities"
        subtitle="Manage shared features, clubhouses, recreational amenities, and specifications."
        count={total}
        countLabel="total"
        action={
          <Button variant="primary" onClick={handleOpenCreate}>
            <Plus size={16} strokeWidth={2.25} />
            <span>Add Amenity</span>
          </Button>
        }
      />
        {/* Search Bar */}
        <div className="max-w-md">
          <SearchInput
            placeholder="Search amenities by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
          />
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 border border-[var(--border)] rounded-2xl bg-[var(--surface)]">
            <Loader2 className="animate-spin text-[var(--brand)]" size={32} />
            <p className="text-sm text-[var(--text-muted)]">Loading amenities...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 text-[var(--destructive)] text-sm">
            {error}
          </div>
        ) : amenities.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-[var(--border)] rounded-2xl bg-[var(--surface)]/50">
            <Sparkles className="mx-auto text-[var(--text-muted)] mb-3" size={40} />
            <h3 className="text-base font-semibold text-[var(--text-primary)]">No amenities found</h3>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Add amenities like Swimming Pool, Clubhouse, Gym to link with projects.
            </p>
            <Button
              variant="primary"
              onClick={handleOpenCreate}
              className="mt-4"
            >
              <Plus size={16} />
              Add Amenity
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Amenity Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Icon Identifier</TableHead>
                    <TableHead>Linked Projects</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {amenities.map((amenity) => (
                    <TableRow key={amenity.id}>
                      <TableCell>
                        <div className="font-semibold text-[var(--text-primary)]">
                          {amenity.name}
                        </div>
                        {amenity.description && (
                          <div className="text-xs text-[var(--text-muted)] line-clamp-1 max-w-sm">
                            {amenity.description}
                          </div>
                        )}
                      </TableCell>

                      <TableCell>
                        <span className="text-xs font-mono text-[var(--text-secondary)]">
                          /{amenity.slug}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="text-xs font-medium px-2 py-1 rounded bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text-secondary)]">
                          {amenity.icon || "Default"}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]/20">
                          {amenity._count?.projects || 0} Projects
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button variant="primary"
                            onClick={() => handleOpenEdit(amenity)}
                            title="Edit Amenity"
                            className="h-8 w-8 p-2"
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button variant="danger"
                            onClick={() => setDeleteId(amenity.id)}
                            title="Delete Amenity"
                            className="h-8 w-8 p-2"
                          >
                            <Trash2 size={16}/>
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

      {/* Create / Edit Modal */}
      <Modal open={formModalOpen} onClose={() => setFormModalOpen(false)}>
        <AmenityForm
          amenity={editingAmenity}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Confirm Amenity Deletion
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Are you sure you want to delete this amenity? It will be unlinked from any associated projects.
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
              Delete Amenity
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
