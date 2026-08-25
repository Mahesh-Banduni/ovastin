"use client";

import { useState } from "react";
import {
  Plus, Edit2, Trash2, Image as ImageIcon,
  Loader2, Building2, Filter,
} from "lucide-react";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "../../../components/ui/store/Table";
import Modal from "../../../components/ui/store/Modal";
import Pagination from "../../../components/ui/store/Pagination";
import ProjectForm from "../../../components/admin/forms/ProjectForm";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import { ImageUpload } from "../../../components/admin/ImageUpload";
import { useProjects, Project } from "../../../hooks/useProjects";
import Input from "../../../components/ui/store/Input";
import Label from "../../../components/ui/store/Label";
import Button from "@/components/ui/store/Button";
import SearchInput from "@/components/ui/store/SearchInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/store/Select";

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  ACTIVE: { label: "Active", classes: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
  UPCOMING: { label: "Upcoming", classes: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  DRAFT: { label: "Draft", classes: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20" },
  SOLD_OUT: { label: "Sold Out", classes: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  COMPLETED: { label: "Completed", classes: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
  ARCHIVED: { label: "Archived", classes: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" },
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
    <div className="p-4 sm:p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* ── Top Page Header Banner ─────────────────────────── */}
      <AdminPageHeader
        icon={Building2}
        title="Projects"
        subtitle="Manage development projects, pricing, galleries, and specifications."
        count={total}
        countLabel="total"
        action={
          <Button variant="primary" onClick={handleOpenCreate}>
            <Plus size={16} strokeWidth={2.25} />
            <span>Add Project</span>
          </Button>
        }
      />

      {/* ── Filter Toolbar ───────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 max-w-sm">
          <SearchInput
            placeholder="Search projects or city..."
            value={filters.search || ""}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
            onClear={() => setFilters((prev) => ({ ...prev, search: undefined, page: 1 }))}
          />
        </div>

        {/* Filter chips row */}
        <div className="flex items-center gap-2 flex-col sm:flex-row">
          {/* Status filter */}
          <Select value={filters.status || "all"} onValueChange={(value: string) => setFilters((prev) => ({ ...prev, status: value === "all" ? undefined : value, page: 1 }))}>
            <SelectTrigger className="h-10 w-auto min-w-36"><SelectValue placeholder="All Statuses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* Property type filter */}
          <Select value={filters.propertyType || "all"} onValueChange={(value: string) => setFilters((prev) => ({ ...prev, propertyType: value === "all" ? undefined : value, page: 1 }))}>
            <SelectTrigger className="h-10 w-auto min-w-32"><SelectValue placeholder="All Types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {PROPERTY_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* Clear filters */}
          {(filters.search || filters.status || filters.propertyType) && (
            <Button
              variant="outline"
              onClick={() => setFilters({ page: 1 })}
              className="h-10 px-3 text-xs font-medium"
            >
              Clear
            </Button>
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
          <p className="text-sm text-[var(--text-muted)] mt-1.5 max-w-xs mx-auto mb-2">
            Get started by adding your first real estate project.
          </p>
          <Button
            variant="primary"
            onClick={handleOpenCreate}
          >
            <Plus size={16} strokeWidth={2.25} />
            <span className="hidden sm:inline">Add Project</span>
          </Button>
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
                <TableHead className="sticky right-0 z-10 bg-[var(--surface)] text-right">Actions</TableHead>
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

                  <TableCell className="sticky right-0 z-10 bg-[var(--surface)] text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost"
                        onClick={() => setGalleryProject(project)}
                        title="Gallery"
                        className="h-8 w-8 p-2 text-[var(--text-muted)] hover:text-[var(--brand)]"
                      >
                        <ImageIcon size={15} style={{ color: "var(--text-muted)" }} />
                      </Button>
                      <Button variant="outline"
                        onClick={() => handleOpenEdit(project)}
                        title="Edit"
                        className="h-8 w-8 p-2"
                      >
                        <Edit2 size={15} strokeWidth={2.25} style={{ color: "var(--text-primary)" }}/>
                      </Button>
                      <Button variant="danger"
                        onClick={() => setDeleteId(project.id)}
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
              <ImageUpload
                label="Add Image to Gallery"
                value={newImageUrl}
                onChange={(val) => setNewImageUrl(val || "")}
                maxFiles={1}
                description="Upload image or paste image URL to append to the project gallery"
              />
              <Input type="text" placeholder="Alt text / caption (optional)" value={newImageAlt} onChange={(e) => setNewImageAlt(e.target.value)} />
              <Button
                type="submit"
                variant="primary"
                disabled={addingImage || !newImageUrl}
                className="h-9 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
              >
                {addingImage && <Loader2 size={13} className="animate-spin" />}
                Add to Gallery
              </Button>
            </form>

            <div className="space-y-2">
              <Label>Current Gallery ({galleryProject.gallery?.length ?? 0} images)</Label>
              {galleryProject.gallery && galleryProject.gallery.length > 0 ? (
                <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto rounded-xl p-1">
                  {galleryProject.gallery.map((img) => (
                    <div key={img.id} className="group relative rounded-xl overflow-hidden border border-[var(--border)] aspect-video">
                      <img src={img.imageUrl} alt={img.altText || "Project"} className="w-full h-full object-cover" />
                      <Button variant="danger"
                        type="button"
                        onClick={async () => { await removeImage(galleryProject.id, img.id); }}
                        className="absolute top-1 right-1 h-7 w-7 p-1 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={13} />
                      </Button>
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
              <Button variant="outline"
                onClick={() => setGalleryProject(null)}
                className="h-9 px-5"
              >
                Close
              </Button>
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
            <Button variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={deleting}
              className="h-9 px-4"
            >
              Cancel
            </Button>
            <Button variant="danger"
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="h-9 px-5"
            >
              {deleting && <Loader2 size={14} className="animate-spin" />}
              Delete Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
