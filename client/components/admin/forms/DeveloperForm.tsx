"use client";

import { useState } from "react";
import Input from "../../ui/store/Input";
import Label from "../../ui/store/Label";
import Textarea from "../../ui/store/TextArea";
import { ImageUpload } from "../ImageUpload";
import FieldError from "../../ui/store/FieldError";
import { DeveloperItem } from "../../../hooks/useDevelopers";
import { Loader2 } from "lucide-react";
import Button from "@/components/ui/store/Button";
import {
  developerFormSchema,
  validateForm,
  type FieldErrors,
} from "@/lib/validation";
import { CloseButton } from "../FormCloseButton";

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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  /** Clears a single field's inline error once the user edits it again. */
  const clearFieldError = (field: string) =>
    setFieldErrors((prev) =>
      prev[field] ? { ...prev, [field]: undefined } : prev
    );

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
    setFieldErrors({});

    // Validate against the backend-mirrored Zod schema before submitting.
    const result = validateForm(developerFormSchema, {
      name,
      slug,
      logo,
      website,
      description,
    });
    if (!result.success) {
      setFieldErrors(result.errors);
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        name: result.data.name,
        slug: result.data.slug,
        logo: result.data.logo || undefined,
        website: result.data.website || undefined,
        description: result.data.description || undefined,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save developer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 max-h-[80vh] overflow-y-auto scrollbar-hide">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          {developer ? "Edit Developer" : "Create New Developer"}
        </h2>
      </div>
      
      <CloseButton
        onCancel={onCancel}
        title="Close"
        size={20}
      />

      {error && (
        <div className="rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="developer-name">Developer Name<span className="text-red-500 ml-scale-sm-0.75">*</span></Label>
          <Input
            id="developer-name"
            value={name}
            aria-invalid={!!fieldErrors.name}
            onChange={(e) => {
              handleNameChange(e.target.value);
              clearFieldError("name");
            }}
            placeholder="e.g. Prestige Group"
          />
          <FieldError message={fieldErrors.name} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="developer-slug">Slug<span className="text-red-500 ml-scale-sm-0.75">*</span></Label>
          <Input
            id="developer-slug"
            value={slug}
            aria-invalid={!!fieldErrors.slug}
            onChange={(e) => {
              setSlug(e.target.value);
              clearFieldError("slug");
            }}
            placeholder="e.g. prestige-group"
          />
          <FieldError message={fieldErrors.slug} />
        </div>
      </div>

      <div className="space-y-1.5">
        <ImageUpload
          label="Developer Logo"
          value={logo}
          onChange={(val) => {
            setLogo(val || "");
            clearFieldError("logo");
          }}
          maxFiles={1}
          description="Upload logo image (PNG, JPG, SVG, WEBP)"
        />
        <FieldError message={fieldErrors.logo} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="developer-website">Website</Label>
        <Input
          id="developer-website"
          type="url"
          value={website}
          aria-invalid={!!fieldErrors.website}
          onChange={(e) => {
            setWebsite(e.target.value);
            clearFieldError("website");
          }}
          placeholder="https://prestigeconstructions.com"
        />
        <FieldError message={fieldErrors.website} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="developer-description">Description</Label>
        <Textarea
          id="developer-description"
          value={description}
          aria-invalid={!!fieldErrors.description}
          onChange={(e) => {
            setDescription(e.target.value);
            clearFieldError("description");
          }}
          placeholder="Information about the builder or construction firm..."
        />
        <FieldError message={fieldErrors.description} />
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
          {developer ? "Save Changes" : "Create Developer"}
        </Button>
      </div>
    </form>
  );
}
