"use client";

import { useState } from "react";
import Input from "../../ui/store/Input";
import Label from "../../ui/store/Label";
import Textarea from "../../ui/store/TextArea";
import Switch from "../../ui/store/Switch";
import { ImageUpload } from "../ImageUpload";
import FieldError from "../../ui/store/FieldError";
import { AwardItem } from "../../../hooks/useAwards";
import { Loader2 } from "lucide-react";
import Button from "@/components/ui/store/Button";
import {
  awardFormSchema,
  validateForm,
  type FieldErrors,
} from "@/lib/validation";
import { CloseButton } from "../FormCloseButton";

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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  /** Clears a single field's inline error once the user edits it again. */
  const clearFieldError = (field: string) =>
    setFieldErrors((prev) =>
      prev[field] ? { ...prev, [field]: undefined } : prev
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Validate against the backend-mirrored Zod schema before submitting.
    const result = validateForm(awardFormSchema, {
      name,
      year,
      imageUrl,
      description,
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
        year: result.data.year === "" ? undefined : parseInt(result.data.year, 10),
        imageUrl: result.data.imageUrl || undefined,
        description: result.data.description || undefined,
        sortOrder:
          result.data.sortOrder === "" ? 0 : parseInt(result.data.sortOrder, 10),
        isActive: result.data.isActive,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save award");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 max-h-[80vh] overflow-y-auto scrollbar-hide">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          {award ? "Edit Award" : "Add New Award"}
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
          <Label htmlFor="award-name">Award Name / Title<span className="text-red-500 ml-scale-sm-0.75">*</span></Label>
          <Input
            id="award-name"
            value={name}
            aria-invalid={!!fieldErrors.name}
            onChange={(e) => {
              setName(e.target.value);
              clearFieldError("name");
            }}
            placeholder="e.g. Best Luxury Developer 2025"
          />
          <FieldError message={fieldErrors.name} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="award-year">Year</Label>
          <Input
            id="award-year"
            type="number"
            value={year}
            aria-invalid={!!fieldErrors.year}
            onChange={(e) => {
              setYear(e.target.value);
              clearFieldError("year");
            }}
            placeholder="2025"
          />
          <FieldError message={fieldErrors.year} />
        </div>
      </div>

      <div className="space-y-1.5">
        <ImageUpload
          label="Award / Badge Image"
          value={imageUrl}
          onChange={(val) => {
            setImageUrl(val || "");
            clearFieldError("imageUrl");
          }}
          maxFiles={1}
          description="Upload award trophy or certificate badge"
        />
        <FieldError message={fieldErrors.imageUrl} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="award-sort-order">Sort Order</Label>
        <Input
          id="award-sort-order"
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

      <div className="space-y-1.5">
        <Label htmlFor="award-description">Description / Organization</Label>
        <Textarea
          id="award-description"
          value={description}
          aria-invalid={!!fieldErrors.description}
          onChange={(e) => {
            setDescription(e.target.value);
            clearFieldError("description");
          }}
          placeholder="e.g. Awarded by Global Real Estate Forum for excellence in sustainable architecture."
        />
        <FieldError message={fieldErrors.description} />
      </div>

      <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <div>
          <div className="text-sm font-medium text-[var(--text-primary)]">Award Active</div>
          <div className="text-xs text-[var(--text-muted)]">Show this recognition publicly</div>
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
          {award ? "Save Changes" : "Create Award"}
        </Button>
      </div>
    </form>
  );
}
