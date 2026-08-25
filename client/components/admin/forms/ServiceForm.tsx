"use client";

import { useState } from "react";
import Input from "../../ui/store/Input";
import Label from "../../ui/store/Label";
import Textarea from "../../ui/store/TextArea";
import Switch from "../../ui/store/Switch";
import { ServiceItem } from "../../../hooks/useServices";
import { Loader2 } from "lucide-react";
import Button from "@/components/ui/store/Button";

interface ServiceFormProps {
  service?: ServiceItem | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export default function ServiceForm({ service, onSubmit, onCancel }: ServiceFormProps) {
  const [name, setName] = useState(service?.name || "");
  const [slug, setSlug] = useState(service?.slug || "");
  const [description, setDescription] = useState(service?.description || "");
  const [icon, setIcon] = useState(service?.icon || "");
  const [sortOrder, setSortOrder] = useState(service?.sortOrder?.toString() || "0");
  const [isActive, setIsActive] = useState(service ? service.isActive : true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!service) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit({
        name,
        slug: slug.trim(),
        description: description || undefined,
        icon: icon || undefined,
        sortOrder: parseInt(sortOrder) || 0,
        isActive,
      });
    } catch (err: any) {
      setError(err?.message || "Failed to save service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-h-[80vh] overflow-y-auto scrollbar-hide">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          {service ? "Edit Service" : "Create New Service"}
        </h2>
      </div>

      {error && (
        <div className="rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label required>Service Name</Label>
          <Input
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Architectural Design"
          />
        </div>

        <div className="space-y-1.5">
          <Label required>Slug</Label>
          <Input
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. architectural-design"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Icon Name / Identifier</Label>
          <Input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="e.g. Building, Home, Shield"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Sort Order</Label>
          <Input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of this service offering..."
        />
      </div>

      <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <div>
          <div className="text-sm font-medium text-[var(--text-primary)]">Service Active</div>
          <div className="text-xs text-[var(--text-muted)]">Show this service on public pages</div>
        </div>
        <Switch checked={isActive} onChange={setIsActive} />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
        <Button
          variant="outline"
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="h-11 px-5 rounded-xl border border-[var(--border)] text-sm font-medium hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          disabled={loading}
          className="h-11 px-6 rounded-xl bg-[var(--brand)] text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {service ? "Save Changes" : "Create Service"}
        </Button>
      </div>
    </form>
  );
}
