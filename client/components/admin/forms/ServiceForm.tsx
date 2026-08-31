"use client";

import { useState } from "react";
import Input from "../../ui/store/Input";
import Label from "../../ui/store/Label";
import Textarea from "../../ui/store/TextArea";
import Switch from "../../ui/store/Switch";
import FieldError from "../../ui/store/FieldError";
import { ServiceItem } from "../../../hooks/useServices";
import { Loader2 } from "lucide-react";
import Button from "@/components/ui/store/Button";
import { ImageUpload } from "../ImageUpload";
import {
  serviceFormSchema,
  validateForm,
  type FieldErrors,
} from "@/lib/validation";
import { CloseButton } from "../FormCloseButton";

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
  const [coverImage, setCoverImage] = useState(service?.coverImage || "");
  const [sortOrder, setSortOrder] = useState(service?.sortOrder?.toString() || "0");
  const [isActive, setIsActive] = useState(service ? service.isActive : true);

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
    setFieldErrors({});

    // Validate against the backend-mirrored Zod schema before submitting.
    const result = validateForm(serviceFormSchema, {
      name,
      slug,
      description,
      icon,
      coverImage,
      sortOrder,
      isActive,
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
        description: result.data.description || undefined,
        icon: result.data.icon || undefined,
        coverImage: result.data.coverImage || undefined,
        sortOrder:
          result.data.sortOrder === "" ? 0 : parseInt(result.data.sortOrder, 10),
        isActive: result.data.isActive,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 max-h-[80vh] overflow-y-auto scrollbar-hide">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          {service ? "Edit Service" : "Create New Service"}
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
          <Label htmlFor="service-name">Service Name<span className="text-red-500 ml-scale-sm-0.75">*</span></Label>
          <Input
            id="service-name"
            value={name}
            aria-invalid={!!fieldErrors.name}
            onChange={(e) => {
              handleNameChange(e.target.value);
              clearFieldError("name");
            }}
            placeholder="e.g. Architectural Design"
          />
          <FieldError message={fieldErrors.name} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="service-slug">Slug<span className="text-red-500 ml-scale-sm-0.75">*</span></Label>
          <Input
            id="service-slug"
            value={slug}
            aria-invalid={!!fieldErrors.slug}
            onChange={(e) => {
              setSlug(e.target.value);
              clearFieldError("slug");
            }}
            placeholder="e.g. architectural-design"
          />
          <FieldError message={fieldErrors.slug} />
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <ImageUpload
            label="Service Icon Image"
            value={icon}
            onChange={(value) => {
              setIcon(value || "");
              clearFieldError("icon");
            }}
            maxFiles={1}
            description="Upload the icon graphic used for this service"
          />
          <FieldError message={fieldErrors.icon} />
        </div>

        <div className="space-y-1.5">
          <ImageUpload
            label="Service Cover Image"
            value={coverImage}
            onChange={(value) => {
              setCoverImage(value || "");
              clearFieldError("coverImage");
            }}
            maxFiles={1}
            description="Upload the hero/cover image for this service"
          />
          <FieldError message={fieldErrors.coverImage} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="service-sort-order">Sort Order</Label>
          <Input
            id="service-sort-order"
            type="number"
            value={sortOrder}
            aria-invalid={!!fieldErrors.sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              clearFieldError("sortOrder");
            }}
            placeholder="0"
          />
          <FieldError message={fieldErrors.sortOrder} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="service-description">Description</Label>
        <Textarea
          id="service-description"
          value={description}
          aria-invalid={!!fieldErrors.description}
          onChange={(e) => {
            setDescription(e.target.value);
            clearFieldError("description");
          }}
          placeholder="Brief description of this service offering..."
        />
        <FieldError message={fieldErrors.description} />
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
