"use client";

import { useState, useEffect } from "react";
import Input from "../../ui/store/Input";
import Label from "../../ui/store/Label";
import Textarea from "../../ui/store/TextArea";
import { ImageUpload } from "../ImageUpload";
import FieldError from "../../ui/store/FieldError";
import { Project } from "../../../hooks/useProjects";
import { useDevelopers } from "../../../hooks/useDevelopers";
import { useAmenities } from "../../../hooks/useAmenities";
import { Loader2 } from "lucide-react";
import Button from "@/components/ui/store/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/store/Select";
import {
  projectFormSchema,
  validateForm,
  type FieldErrors,
} from "@/lib/validation";
import { CloseButton } from "../FormCloseButton";

interface ProjectFormProps {
  project?: Project | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const PROPERTY_TYPES = [
  { title: "Apartment", value: "APARTMENT" },
  { title: "Villa", value: "VILLA" },
  { title: "Plot", value: "PLOT" },
  { title: "Township", value: "TOWNSHIP" },
  { title: "Commercial", value: "COMMERCIAL" },
  { title: "Office", value: "OFFICE" },
  { title: "Retail", value: "RETAIL" },
  { title: "Industrial", value: "INDUSTRIAL" },
  { title: "Other", value: "OTHER" },
];

const PROJECT_STATUSES = [
  { title: "Draft", value: "DRAFT" },
  { title: "Upcoming", value: "UPCOMING" },
  { title: "Active", value: "ACTIVE" },
  { title: "Sold Out", value: "SOLD_OUT" },
  { title: "Completed", value: "COMPLETED" },
  { title: "Archived", value: "ARCHIVED" },
];

export default function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const { developers } = useDevelopers(1, 100);
  const { allAmenities } = useAmenities();

  const [name, setName] = useState(project?.name || "");
  const [slug, setSlug] = useState(project?.slug || "");
  const [status, setStatus] = useState(project?.status || "DRAFT");
  const [propertyType, setPropertyType] = useState(project?.propertyType || "APARTMENT");
  const [developerId, setDeveloperId] = useState(project?.developerId || "");
  const [possessionDate, setPossessionDate] = useState(
    project?.possessionDate ? project.possessionDate.split("T")[0] : ""
  );
  const [currency, setCurrency] = useState(project?.currency || "INR");
  const [priceMin, setPriceMin] = useState(project?.priceMin?.toString() || "");
  const [priceMax, setPriceMax] = useState(project?.priceMax?.toString() || "");
  const [city, setCity] = useState(project?.city || "");
  const [state, setState] = useState(project?.state || "");
  const [address, setAddress] = useState(project?.address || "");
  const [postalCode, setPostalCode] = useState(project?.postalCode || "");
  const [coverImage, setCoverImage] = useState(project?.coverImage || "");
  const [description, setDescription] = useState(project?.description || "");
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<string[]>(
    project?.amenities?.map((a) => a.amenityId) || []
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!project) {
      setName("");
      setSlug("");
      setStatus("DRAFT");
      setPropertyType("APARTMENT");
      setDeveloperId("");
      setPossessionDate("");
      setCurrency("INR");
      setPriceMin("");
      setPriceMax("");
      setCity("");
      setState("");
      setAddress("");
      setPostalCode("");
      setCoverImage("");
      setDescription("");
      setSelectedAmenityIds([]);
      return;
    }
  
    setName(project.name || "");
    setSlug(project.slug || "");
    setStatus(project.status || "DRAFT");
    setPropertyType(project.propertyType || "APARTMENT");
    setDeveloperId(project.developerId?.toString() || "");
  
    setPossessionDate(
      project.possessionDate
        ? project.possessionDate.split("T")[0]
        : ""
    );
  
    setCurrency(project.currency || "INR");
    setPriceMin(project.priceMin?.toString() || "");
    setPriceMax(project.priceMax?.toString() || "");
    setCity(project.city || "");
    setState(project.state || "");
    setAddress(project.address || "");
    setPostalCode(project.postalCode || "");
    setCoverImage(project.coverImage || "");
    setDescription(project.description || "");
  
    setSelectedAmenityIds(
      project.amenities?.map((a) => String(a.amenityId)) || []
    );
  }, [project]);

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  /** Clears a single field's inline error once the user edits it again. */
  const clearFieldError = (field: string) =>
    setFieldErrors((prev) =>
      prev[field] ? { ...prev, [field]: undefined } : prev
    );

  // Auto-generate slug from name if empty or newly typed
  const handleNameChange = (val: string) => {
    setName(val);
    if (!project) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
      );
    }
  };

  const handleAmenityToggle = (amenityId: string) => {
    setSelectedAmenityIds((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Validate against the backend-mirrored Zod schema before submitting.
    const result = validateForm(projectFormSchema, {
      name,
      slug,
      status,
      propertyType,
      currency,
      developerId,
      possessionDate,
      priceMin,
      priceMax,
      address,
      city,
      state,
      postalCode,
      coverImage,
      description,
      amenityIds: selectedAmenityIds,
    });
    if (!result.success) {
      setFieldErrors(result.errors);
      return;
    }

    const data = result.data;
    setLoading(true);

    try {
      const payload: any = {
        name: data.name,
        slug: data.slug,
        status: data.status,
        propertyType: data.propertyType,
        currency: data.currency || undefined,
        description: data.description || undefined,
        coverImage: data.coverImage || undefined,
        address: data.address || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        postalCode: data.postalCode || undefined,
        developerId: data.developerId || undefined,
        priceMin: data.priceMin === "" ? undefined : parseFloat(data.priceMin),
        priceMax: data.priceMax === "" ? undefined : parseFloat(data.priceMax),
        possessionDate: data.possessionDate
          ? new Date(data.possessionDate).toISOString()
          : undefined,
        amenityIds: data.amenityIds,
      };

      await onSubmit(payload);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6 max-h-[80vh] overflow-y-auto scrollbar-hide">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          {project ? "Edit Project" : "Create New Project"}
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

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="project-name">Project Name<span className="text-red-500 ml-scale-sm-0.75">*</span></Label>
          <Input
            id="project-name"
            value={name}
            aria-invalid={!!fieldErrors.name}
            onChange={(e) => {
              handleNameChange(e.target.value);
              clearFieldError("name");
            }}
            placeholder="e.g. Skyline Residences"
            disabled={loading}
          />
          <FieldError message={fieldErrors.name} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug<span className="text-red-500 ml-scale-sm-0.75">*</span></Label>
          <Input
            id="slug"
            value={slug}
            aria-invalid={!!fieldErrors.slug}
            onChange={(e) => {
              setSlug(e.target.value);
              clearFieldError("slug");
            }}
            placeholder="e.g. skyline-residences"
            disabled={loading}
          />
          <FieldError message={fieldErrors.slug} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="property-type">Property Type</Label>
          <Select value={propertyType} onValueChange={(value: string) => setPropertyType(value as any)} disabled={loading}>
            <SelectTrigger id="property-type"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map((type, index) => <SelectItem key={index} value={type.value}>{type.title}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(value: string) => setStatus(value as any)} disabled={loading}>
            <SelectTrigger id="status"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PROJECT_STATUSES.map((st, index) => <SelectItem key={index} value={st.value}>{st.title}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="developer-/-builder">Developer / Builder</Label>
          <Select value={developerId || "none"} disabled={loading} onValueChange={(value: string) => {
            setDeveloperId(value === "none" ? "" : value);
            clearFieldError("developerId");
          }}>
            <SelectTrigger id="developer-/-builder"><SelectValue placeholder="-- None Selected --" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">-- None Selected --</SelectItem>
              {developers.map((dev) => <SelectItem key={dev.id} value={dev.id}>{dev.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <FieldError message={fieldErrors.developerId} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="possession-date">Possession Date</Label>
          <Input
            id="possession-date"
            type="date"
            value={possessionDate}
            aria-invalid={!!fieldErrors.possessionDate}
            onChange={(e) => {
              setPossessionDate(e.target.value);
              clearFieldError("possessionDate");
            }}
            disabled={loading}
          />
          <FieldError message={fieldErrors.possessionDate} />
        </div>
      </div>

      {/* Pricing & Location */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="currency">Currency</Label>
          <Input
            id="currency"
            value={currency}
            aria-invalid={!!fieldErrors.currency}
            onChange={(e) => {
              setCurrency(e.target.value);
              clearFieldError("currency");
            }}
            placeholder="INR, USD"
            disabled={loading}
          />
          <FieldError message={fieldErrors.currency} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="min-price">Min Price</Label>
          <Input
            id="min-price"
            type="number"
            value={priceMin}
            aria-invalid={!!fieldErrors.priceMin}
            onChange={(e) => {
              setPriceMin(e.target.value);
              clearFieldError("priceMin");
            }}
            placeholder="e.g. 5000000"
            disabled={loading}
          />
          <FieldError message={fieldErrors.priceMin} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="max-price">Max Price</Label>
          <Input
            id="max-price"
            type="number"
            value={priceMax}
            aria-invalid={!!fieldErrors.priceMax}
            onChange={(e) => {
              setPriceMax(e.target.value);
              clearFieldError("priceMax");
            }}
            placeholder="e.g. 15000000"
            disabled={loading}
          />
          <FieldError message={fieldErrors.priceMax} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={city}
            aria-invalid={!!fieldErrors.city}
            onChange={(e) => {
              setCity(e.target.value);
              clearFieldError("city");
            }}
            placeholder="e.g. Mumbai"
            disabled={loading}
          />
          <FieldError message={fieldErrors.city} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={state}
            aria-invalid={!!fieldErrors.state}
            onChange={(e) => {
              setState(e.target.value);
              clearFieldError("state");
            }}
            placeholder="e.g. Maharashtra"
            disabled={loading}
          />
          <FieldError message={fieldErrors.state} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="postal-code">Postal Code</Label>
          <Input
            id="postal-code"
            value={postalCode}
            aria-invalid={!!fieldErrors.postalCode}
            onChange={(e) => {
              setPostalCode(e.target.value);
              clearFieldError("postalCode");
            }}
            placeholder="e.g. 400001"
            disabled={loading}
          />
          <FieldError message={fieldErrors.postalCode} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={address}
          aria-invalid={!!fieldErrors.address}
          onChange={(e) => {
            setAddress(e.target.value);
            clearFieldError("address");
          }}
          placeholder="e.g. Plot 42, Palm Beach Road"
          disabled={loading}
        />
        <FieldError message={fieldErrors.address} />
      </div>

      <div className="space-y-1.5">
        <ImageUpload
          label="Project Cover Image"
          value={coverImage}
          onChange={(val) => {
            setCoverImage(val || "");
            clearFieldError("coverImage");
          }}
          maxFiles={1}
          disabled={loading}
          description="Upload primary cover photograph for this property development"
        />
        <FieldError message={fieldErrors.coverImage} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          disabled={loading}
          value={description}
          aria-invalid={!!fieldErrors.description}
          onChange={(e) => {
            setDescription(e.target.value);
            clearFieldError("description");
          }}
          placeholder="Detailed project description, architectural highlights, amenities..."
        />
        <FieldError message={fieldErrors.description} />
      </div>

      {/* Amenities Multi-Select */}
      {allAmenities.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="amenities">Amenities</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-40 overflow-y-auto p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            {allAmenities.map((amenity) => {
              const isSelected = selectedAmenityIds.includes(amenity.id);
              return (
                <label
                  key={amenity.id}
                  className={`
                    flex items-center gap-2 p-2 rounded-lg text-xs font-medium cursor-pointer transition-colors border
                    ${isSelected
                      ? "border-[var(--brand)] bg-[var(--brand)]/10 text-[var(--text-primary)]"
                      : "border-[var(--border)] bg-[var(--background)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    disabled={loading}
                    checked={isSelected}
                    onChange={() => handleAmenityToggle(amenity.id)}
                    className="accent-[var(--brand)] rounded"
                  />
                  <span className="truncate">{amenity.name}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Form Buttons */}
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
          {project ? "Save Changes" : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
