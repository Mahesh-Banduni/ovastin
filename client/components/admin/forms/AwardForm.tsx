"use client";

import { useState } from "react";
import Input from "../../ui/store/Input";
import Label from "../../ui/store/Label";
import Textarea from "../../ui/store/TextArea";
import Switch from "../../ui/store/Switch";
import { AwardItem } from "../../../hooks/useAwards";
import { Loader2 } from "lucide-react";

interface AwardFormProps {
  award?: AwardItem | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export default function AwardForm({ award, onSubmit, onCancel }: AwardFormProps) {
  const [name, setName] = useState(award?.name || "");
  const [year, setYear] = useState(award?.year?.toString() || new Date().getFullYear().toString());
  const [imageUrl, setImageUrl] = useState(award?.imageUrl || "");
  const [description, setDescription] = useState(award?.description || "");
  const [sortOrder, setSortOrder] = useState(award?.sortOrder?.toString() || "0");
  const [isActive, setIsActive] = useState(award ? award.isActive : true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit({
        name,
        year: year ? parseInt(year) : undefined,
        imageUrl: imageUrl || undefined,
        description: description || undefined,
        sortOrder: parseInt(sortOrder) || 0,
        isActive,
      });
    } catch (err: any) {
      setError(err?.message || "Failed to save award");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          {award ? "Edit Award" : "Add New Award"}
        </h2>
      </div>

      {error && (
        <div className="rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label required>Award Name / Title</Label>
          <Input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Best Luxury Developer 2025"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Year</Label>
          <Input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="2025"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Image / Badge URL</Label>
          <Input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
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
        <Label>Description / Organization</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Awarded by Global Real Estate Forum for excellence in sustainable architecture."
        />
      </div>

      <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <div>
          <div className="text-sm font-medium text-[var(--text-primary)]">Award Active</div>
          <div className="text-xs text-[var(--text-muted)]">Show this recognition publicly</div>
        </div>
        <Switch checked={isActive} onChange={setIsActive} />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="h-11 px-5 rounded-xl border border-[var(--border)] text-sm font-medium hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="h-11 px-6 rounded-xl bg-[var(--brand)] text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {award ? "Save Changes" : "Create Award"}
        </button>
      </div>
    </form>
  );
}
