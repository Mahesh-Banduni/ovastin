"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Briefcase, Loader2, Check, X, Search } from "lucide-react";
import AdminHeader from "../../../components/admin/AdminHeader";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "../../../components/ui/store/Table";
import Modal from "../../../components/ui/store/Modal";
import Pagination from "../../../components/ui/store/Pagination";
import ServiceForm from "../../../components/admin/forms/ServiceForm";
import { useServices, ServiceItem } from "../../../hooks/useServices";

export default function AdminServicesPage() {
  const {
    services, total, page, pageSize, loading, error,
    search, setSearch, setPage, createService, updateService, deleteService,
  } = useServices();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  const activeCount = services.filter((s) => s.isActive).length;

  return (
    <div>
      <AdminHeader
        onOpenSidebar={() => setSidebarOpen(true)}
        title="Services"
        subtitle="Manage architectural, design, advisory, and property consulting services"
        action={
          <button
            onClick={handleOpenCreate}
            className="h-9 px-4 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-foreground) 160%)",
              color: "var(--background)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Service</span>
          </button>
        }
      />

      <div className="p-4 sm:p-6 space-y-5 max-w-[1400px] mx-auto">

        {/* ── Stats Strip ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Total Services", value: total, color: "var(--brand)" },
            { label: "Active", value: activeCount, color: "#10b981" },
            { label: "Inactive", value: total - activeCount, color: "#71717a" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${stat.color}18` }}
              >
                <Briefcase size={17} style={{ color: stat.color }} />
              </div>
              <div>
                <div className="text-xl font-bold text-[var(--text-primary)] leading-tight">{stat.value}</div>
                <div className="text-[11px] text-[var(--text-muted)]">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Search Bar ──────────────────────────────────────── */}
        <div className="relative max-w-sm">
          <span className="absolute inset-y-0 left-3.5 flex items-center text-[var(--text-muted)] pointer-events-none">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search services by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-10 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-3 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <X size={15} />
            </button>
          )}
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
            <button
              onClick={handleOpenCreate}
              className="mt-5 h-10 px-5 rounded-xl text-sm font-semibold inline-flex items-center gap-2 cursor-pointer transition-all"
              style={{ background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-foreground) 160%)", color: "var(--background)" }}
            >
              <Plus size={16} /> Add Service
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Icon / Symbol</TableHead>
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
                      <span className="text-[11px] font-semibold px-2 py-1 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--text-secondary)]">
                        {service.icon || "Default"}
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
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(service)}
                          title="Edit"
                          className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteId(service.id)}
                          title="Delete"
                          className="p-2 rounded-lg hover:bg-[var(--destructive)]/10 text-[var(--text-muted)] hover:text-[var(--destructive)] transition-all cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
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
      </div>

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
            <button
              onClick={() => setDeleteId(null)}
              disabled={deleting}
              className="h-9 px-4 rounded-xl border border-[var(--border)] text-sm font-medium hover:bg-[var(--surface-hover)] cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="h-9 px-5 rounded-xl bg-[var(--destructive)] text-white text-sm font-semibold hover:opacity-90 flex items-center gap-2 cursor-pointer transition-all"
            >
              {deleting && <Loader2 size={14} className="animate-spin" />}
              Delete Service
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
