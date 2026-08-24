"use client";

import { useState } from "react";
import Input from "../../ui/store/Input";
import Label from "../../ui/store/Label";
import Textarea from "../../ui/store/TextArea";
import { AmenityItem } from "../../../hooks/useAmenities";
import { Loader2 } from "lucide-react";

interface AmenityFormProps {
  amenity?: AmenityItem | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export default function AmenityForm({ amenity, onSubmit, onCancel }: AmenityFormProps) {
  const [name, setName] = useState(amenity?.name || "");
  const [slug, setSlug] = useState(amenity?.slug || "");
  const [icon, setIcon] = useState(amenity?.icon || "");
  const [description, setDescription] = useState(amenity?.description || "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!amenity) {
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
        icon: icon || undefined,
        description: description || undefined,
      });
    } catch (err: any) {
      setError(err?.message || "Failed to save amenity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          {amenity ? "Edit Amenity" : "Create New Amenity"}
        </h2>
      </div>

      {error && (
        <div className="rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label required>Amenity Name</Label>
          <Input
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Infinity Swimming Pool"
          />
        </div>

        <div className="space-y-1.5">
          <Label required>Slug</Label>
          <Input
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. infinity-swimming-pool"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Icon / Identifier</Label>
        <Input
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          placeholder="e.g. Pool, Waves, Dumbbell, Shield, Parking"
        />
      </div>

      <div className="space-y-1.5">
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description of this amenity..."
        />
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
          {amenity ? "Save Changes" : "Create Amenity"}
        </button>
      </div>
    </form>
  );
}
