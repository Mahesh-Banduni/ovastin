"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Briefcase, Loader2, Check, X } from "lucide-react";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "../../../components/ui/store/Table";
import Modal from "../../../components/ui/store/Modal";
import Pagination from "../../../components/ui/store/Pagination";
import ServiceForm from "../../../components/admin/forms/ServiceForm";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import { useServices, ServiceItem } from "../../../hooks/useServices";
import Button from "@/components/ui/store/Button";
import SearchInput from "@/components/ui/store/SearchInput";

export default function AdminServicesPage() {
  const {
    services, total, page, pageSize, loading, error,
    search, setSearch, setPage, createService, updateService, deleteService,
  } = useServices();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleOpenCreate = () => { setEditingService(null); setFormModalOpen(true); };
  const handleOpenEdit = (service: ServiceItem) => { setEditingService(service); setFormModalOpen(true); };

  const handleFormSubmit = async (data: any) => {
    if (editingService) await updateService(editingService.id, data);
    else await createService(data);
    setFormModalOpen(false);
    setEditingService(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try { await deleteService(deleteId); setDeleteId(null); }
    finally { setDeleting(false); }
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* ── Top Page Header Banner (as shown in reference) ────── */}
      <AdminPageHeader
        icon={Briefcase}
        title="Services"
        subtitle="Manage architectural, design, advisory, and property consulting services."
        count={total}
        countLabel="total"
        action={
          <Button variant="primary" onClick={handleOpenCreate}>
            <Plus size={16} strokeWidth={2.25} />
            <span>Add Service</span>
          </Button>
        }
      />

        {/* ── Search Bar ──────────────────────────────────────── */}
        <div className="max-w-sm">
          <SearchInput
            placeholder="Search services by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
          />
        </div>

        {/* ── Content ─────────────────────────────────────────── */}
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4 border border-[var(--border)] rounded-2xl bg-[var(--surface)]">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: "var(--brand)" }} />
              <div className="relative w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-foreground) 160%)" }}>
                <Loader2 size={20} className="animate-spin" style={{ color: "var(--background)" }} />
              </div>
            </div>
            <p className="text-sm text-[var(--text-muted)] font-medium">Loading services...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/8 text-[var(--destructive)] text-sm font-medium">
            {error}
          </div>
        ) : services.length === 0 ? (
          <div className="p-20 text-center border-2 border-dashed border-[var(--border)] rounded-2xl bg-[var(--surface)]/40">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-foreground) 160%)" }}
            >
              <Briefcase size={28} style={{ color: "var(--background)" }} />
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">No services yet</h3>
            <p className="text-sm text-[var(--text-muted)] mt-1.5 max-w-xs mx-auto">
              Add the services you offer to showcase on the client website.
            </p>
            <Button
              variant="primary"
              onClick={handleOpenCreate}
              className="mt-5"
            >
              <Plus size={16} /> Add Service
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div className="font-semibold text-[var(--text-primary)] text-sm">{service.name}</div>
                      {service.description && (
                        <div className="text-[11px] text-[var(--text-muted)] line-clamp-1 max-w-xs mt-0.5">
                          {service.description}
                        </div>
                      )}
                    </TableCell>

                    <TableCell>
                      <span className="text-[11px] font-mono bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text-secondary)] px-2 py-1 rounded-lg">
                        /{service.slug}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm font-semibold text-[var(--text-primary)] font-mono tabular-nums">
                        #{service.sortOrder}
                      </span>
                    </TableCell>

                    <TableCell>
                      {service.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          <Check size={11} />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-500/10 text-zinc-500 border border-zinc-500/20">
                          <X size={11} />
                          Inactive
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          onClick={() => handleOpenEdit(service)}
                          title="Edit"
                          className="h-8 w-8 p-2"
                        >
                          <Edit2 size={15}/>
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => setDeleteId(service.id)}
                          title="Delete"
                          className="h-8 w-8 p-2"
                        >
                          <Trash2 size={15}/>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="p-4 border border-[var(--border)] rounded-2xl bg-[var(--surface)]">
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

      {/* ── Modals ──────────────────────────────────────────── */}

      <Modal open={formModalOpen} onClose={() => setFormModalOpen(false)}>
        <ServiceForm service={editingService} onSubmit={handleFormSubmit} onCancel={() => setFormModalOpen(false)} />
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)}>
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--destructive)]/10 flex items-center justify-center mb-2">
            <Trash2 size={22} className="text-[var(--destructive)]" />
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">Delete Service?</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Are you sure you want to remove this service? This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={deleting}
              className="h-9 px-4"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="h-9 px-5"
            >
              {deleting && <Loader2 size={14} className="animate-spin" />}
              Delete Service
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
