"use client";

import { useState } from "react";
import Input from "../../ui/store/Input";
import Label from "../../ui/store/Label";
import Textarea from "../../ui/store/TextArea";
import { DeveloperItem } from "../../../hooks/useDevelopers";
import { Loader2 } from "lucide-react";

interface DeveloperFormProps {
  developer?: DeveloperItem | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export default function DeveloperForm({ developer, onSubmit, onCancel }: DeveloperFormProps) {
  const [name, setName] = useState(developer?.name || "");
  const [slug, setSlug] = useState(developer?.slug || "");
  const [logo, setLogo] = useState(developer?.logo || "");
  const [website, setWebsite] = useState(developer?.website || "");
  const [description, setDescription] = useState(developer?.description || "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!developer) {
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
        logo: logo || undefined,
        website: website || undefined,
        description: description || undefined,
      });
    } catch (err: any) {
      setError(err?.message || "Failed to save developer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          {developer ? "Edit Developer" : "Create New Developer"}
        </h2>
      </div>

      {error && (
        <div className="rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label required>Developer Name</Label>
          <Input
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Prestige Group"
          />
        </div>

        <div className="space-y-1.5">
          <Label required>Slug</Label>
          <Input
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. prestige-group"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Logo URL</Label>
          <Input
            type="url"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="space-y-1.5">
          <Label>Website</Label>
          <Input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://prestigeconstructions.com"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Information about the builder or construction firm..."
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
          {developer ? "Save Changes" : "Create Developer"}
        </button>
      </div>
    </form>
  );
}
