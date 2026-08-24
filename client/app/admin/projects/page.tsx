"use client";

import { useState } from "react";
import {
  Plus, Edit2, Trash2, Image as ImageIcon,
  Loader2, Building2, LayoutGrid, Search, Filter,
} from "lucide-react";
import AdminHeader from "../../../components/admin/AdminHeader";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "../../../components/ui/store/Table";
import Modal from "../../../components/ui/store/Modal";
import Pagination from "../../../components/ui/store/Pagination";
import ProjectForm from "../../../components/admin/forms/ProjectForm";
import { useProjects, Project } from "../../../hooks/useProjects";
import Input from "../../../components/ui/store/Input";
import Label from "../../../components/ui/store/Label";

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  ACTIVE:    { label: "Active",     classes: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
  UPCOMING:  { label: "Upcoming",   classes: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  DRAFT:     { label: "Draft",      classes: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20" },
  SOLD_OUT:  { label: "Sold Out",   classes: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  COMPLETED: { label: "Completed",  classes: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
  ARCHIVED:  { label: "Archived",   classes: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" },
};

const STATUSES = ["ACTIVE", "UPCOMING", "DRAFT", "SOLD_OUT", "COMPLETED", "ARCHIVED"];
const PROPERTY_TYPES = ["APARTMENT", "VILLA", "PLOT", "TOWNSHIP", "COMMERCIAL", "OFFICE"];

export default function AdminProjectsPage() {
  const {
    projects, total, page, pageSize, loading, error,
    filters, setFilters, createProject, updateProject,
    deleteProject, addImageUrl, removeImage,
  } = useProjects();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [galleryProject, setGalleryProject] = useState<Project | null>(null);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");
  const [addingImage, setAddingImage] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleOpenCreate = () => { setEditingProject(null); setFormModalOpen(true); };
  const handleOpenEdit = (project: Project) => { setEditingProject(project); setFormModalOpen(true); };

  const handleFormSubmit = async (data: any) => {
    if (editingProject) await updateProject(editingProject.id, data);
    else await createProject(data);
    setFormModalOpen(false);
    setEditingProject(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try { await deleteProject(deleteId); setDeleteId(null); }
    finally { setDeleting(false); }
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryProject || !newImageUrl) return;
    setAddingImage(true);
    try {
      await addImageUrl(galleryProject.id, { imageUrl: newImageUrl, altText: newImageAlt || undefined });
      setNewImageUrl(""); setNewImageAlt("");
    } finally { setAddingImage(false); }
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  const StatusBadge = ({ status }: { status: string }) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.DRAFT;
    return (
      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.classes}`}>
        {cfg.label}
      </span>
    );
  };

  return (
    <div>
      <AdminHeader
        onOpenSidebar={() => setSidebarOpen(true)}
        title="Projects"
        subtitle="Manage development projects, pricing, galleries, and specifications"
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
            <span className="hidden sm:inline">Add Project</span>
          </button>
        }
      />

      <div className="p-4 sm:p-6 space-y-5 max-w-[1400px] mx-auto">

        {/* ── Stats Strip ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Projects", value: total, icon: Building2, color: "var(--brand)" },
            { label: "Active",         value: projects.filter(p => p.status === "ACTIVE").length, icon: LayoutGrid, color: "#10b981" },
            { label: "Upcoming",       value: projects.filter(p => p.status === "UPCOMING").length, icon: LayoutGrid, color: "#3b82f6" },
            { label: "Draft",          value: projects.filter(p => p.status === "DRAFT").length, icon: LayoutGrid, color: "#71717a" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center gap-3 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${stat.color}18` }}
                >
                  <Icon size={17} style={{ color: stat.color }} />
                </div>
                <div>
                  <div className="text-xl font-bold text-[var(--text-primary)] leading-tight">{stat.value}</div>
                  <div className="text-[11px] text-[var(--text-muted)]">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Filter Toolbar ───────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-[var(--text-muted)] pointer-events-none">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search projects or city..."
              value={filters.search || ""}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 transition-all"
            />
          </div>

          {/* Filter chips row */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={15} className="text-[var(--text-muted)] flex-shrink-0" />

            {/* Status filter */}
            <select
              value={filters.status || ""}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value || undefined, page: 1 }))}
              className="h-10 px-3 pr-8 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 transition-all cursor-pointer appearance-none"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23737373' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}
            >
              <option value="">All Statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </select>

            {/* Property type filter */}
            <select
              value={filters.propertyType || ""}
              onChange={(e) => setFilters((prev) => ({ ...prev, propertyType: e.target.value || undefined, page: 1 }))}
              className="h-10 px-3 pr-8 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 transition-all cursor-pointer appearance-none"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23737373' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}
            >
              <option value="">All Types</option>
              {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>

            {/* Clear filters */}
            {(filters.search || filters.status || filters.propertyType) && (
              <button
                onClick={() => setFilters({ page: 1 })}
                className="h-10 px-3 rounded-xl border border-[var(--border)] text-xs font-medium text-[var(--text-muted)] hover:text-[var(--destructive)] hover:border-[var(--destructive)]/40 transition-all cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
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
            <p className="text-sm text-[var(--text-muted)] font-medium">Loading projects...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/8 text-[var(--destructive)] text-sm font-medium">
            {error}
          </div>
        ) : projects.length === 0 ? (
          <div className="p-20 text-center border-2 border-dashed border-[var(--border)] rounded-2xl bg-[var(--surface)]/40">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-foreground) 160%)" }}
            >
              <Building2 size={28} style={{ color: "var(--background)" }} />
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">No projects yet</h3>
            <p className="text-sm text-[var(--text-muted)] mt-1.5 max-w-xs mx-auto">
              Get started by adding your first real estate project.
            </p>
            <button
              onClick={handleOpenCreate}
              className="mt-5 h-10 px-5 rounded-xl text-sm font-semibold inline-flex items-center gap-2 cursor-pointer transition-all duration-200"
              style={{ background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-foreground) 160%)", color: "var(--background)" }}
            >
              <Plus size={16} /> Add Project
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Developer</TableHead>
                  <TableHead>Price Range</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    {/* Project name + cover */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {project.coverImage ? (
                          <img
                            src={project.coverImage}
                            alt={project.name}
                            className="h-10 w-10 rounded-xl object-cover border border-[var(--border)] flex-shrink-0"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-xl border border-[var(--border)] flex items-center justify-center flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, var(--brand)18 0%, var(--border) 100%)" }}
                          >
                            <Building2 size={17} className="text-[var(--text-muted)]" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-semibold text-[var(--text-primary)] text-sm truncate max-w-[160px]">{project.name}</div>
                          <div className="text-[11px] text-[var(--text-muted)] font-mono">/{project.slug}</div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-[11px] font-semibold px-2 py-1 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--text-secondary)]">
                        {project.propertyType}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm text-[var(--text-primary)] font-medium">{project.city || "—"}</div>
                      {project.state && <div className="text-[11px] text-[var(--text-muted)]">{project.state}</div>}
                    </TableCell>

                    <TableCell>
                      <span className="text-sm text-[var(--text-secondary)]">{project.developer?.name || "—"}</span>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">
                        {project.priceMin || project.priceMax ? (
                          <>{project.currency} {project.priceMin?.toLocaleString() ?? "0"}{project.priceMax ? ` – ${project.priceMax.toLocaleString()}` : "+"}</>
                        ) : (
                          <span className="text-[var(--text-muted)] font-normal text-xs">Price on request</span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell><StatusBadge status={project.status} /></TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setGalleryProject(project)}
                          title="Gallery"
                          className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--brand)] transition-all cursor-pointer"
                        >
                          <ImageIcon size={15} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(project)}
                          title="Edit"
                          className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteId(project.id)}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border border-[var(--border)] rounded-2xl bg-[var(--surface)]">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  totalResults={total}
                  onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Modals ──────────────────────────────────────────── */}

      {/* Create / Edit */}
      <Modal open={formModalOpen} onClose={() => setFormModalOpen(false)}>
        <ProjectForm project={editingProject} onSubmit={handleFormSubmit} onCancel={() => setFormModalOpen(false)} />
      </Modal>

      {/* Gallery */}
      <Modal open={!!galleryProject} onClose={() => setGalleryProject(null)}>
        {galleryProject && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-primary)]">Project Gallery</h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{galleryProject.name}</p>
              </div>
            </div>

            <form onSubmit={handleAddImage} className="space-y-3 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)]">
              <Label>Add Image by URL</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input type="url" required placeholder="https://images.unsplash.com/..." value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} />
                <Input type="text" placeholder="Alt text / caption (optional)" value={newImageAlt} onChange={(e) => setNewImageAlt(e.target.value)} />
              </div>
              <button
                type="submit"
                disabled={addingImage}
                className="h-9 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"
                style={{ background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-foreground) 160%)", color: "var(--background)" }}
              >
                {addingImage && <Loader2 size={13} className="animate-spin" />}
                Add to Gallery
              </button>
            </form>

            <div className="space-y-2">
              <Label>Current Gallery ({galleryProject.gallery?.length ?? 0} images)</Label>
              {galleryProject.gallery && galleryProject.gallery.length > 0 ? (
                <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto rounded-xl p-1">
                  {galleryProject.gallery.map((img) => (
                    <div key={img.id} className="group relative rounded-xl overflow-hidden border border-[var(--border)] aspect-video">
                      <img src={img.imageUrl} alt={img.altText || "Project"} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={async () => { await removeImage(galleryProject.id, img.id); }}
                        className="absolute top-1 right-1 p-1 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[var(--text-muted)] py-6 text-center border border-dashed border-[var(--border)] rounded-xl">
                  No gallery images yet.
                </p>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-[var(--border)]">
              <button
                onClick={() => setGalleryProject(null)}
                className="h-9 px-5 rounded-xl border border-[var(--border)] text-sm font-medium hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)}>
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--destructive)]/10 flex items-center justify-center mb-2">
            <Trash2 size={22} className="text-[var(--destructive)]" />
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">Delete Project?</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            This will permanently remove the project and all associated gallery images. This action cannot be undone.
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
              Delete Project
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
