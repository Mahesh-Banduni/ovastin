"use client";

import { useState, useEffect } from "react";
import Input from "../../ui/store/Input";
import Label from "../../ui/store/Label";
import Textarea from "../../ui/store/TextArea";
import { ImageUpload } from "../ImageUpload";
import { Project } from "../../../hooks/useProjects";
import { useDevelopers } from "../../../hooks/useDevelopers";
import { useAmenities } from "../../../hooks/useAmenities";
import { Loader2 } from "lucide-react";
import Button from "@/components/ui/store/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/store/Select";

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
  const [error, setError] = useState<string | null>(null);

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
    setLoading(true);

    try {
      const payload: any = {
        name,
        slug: slug.trim(),
        status,
        propertyType,
        currency,
        description: description || undefined,
        coverImage: coverImage || undefined,
        address: address || undefined,
        city: city || undefined,
        state: state || undefined,
        postalCode: postalCode || undefined,
        developerId: developerId || undefined,
        priceMin: priceMin ? parseFloat(priceMin) : undefined,
        priceMax: priceMax ? parseFloat(priceMax) : undefined,
        possessionDate: possessionDate ? new Date(possessionDate).toISOString() : undefined,
        amenityIds: selectedAmenityIds,
      };

      await onSubmit(payload);
    } catch (err: any) {
      setError(err?.message || "Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto scrollbar-hide">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          {project ? "Edit Project" : "Create New Project"}
        </h2>
      </div>

      {error && (
        <div className="rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label required>Project Name</Label>
          <Input
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Skyline Residences"
          />
        </div>

        <div className="space-y-1.5">
          <Label required>Slug</Label>
          <Input
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. skyline-residences"
          />
        </div>

        <div className="space-y-1.5">
          <Label required>Property Type</Label>
          <Select value={propertyType} onValueChange={(value: string) => setPropertyType(value as any)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map((type, index) => <SelectItem key={index} value={type.value}>{type.title}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label required>Status</Label>
          <Select value={status} onValueChange={(value: string) => setStatus(value as any)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PROJECT_STATUSES.map((st, index) => <SelectItem key={index} value={st.value}>{st.title}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Developer / Builder</Label>
          <Select value={developerId || "none"} onValueChange={(value: string) => setDeveloperId(value === "none" ? "" : value)}>
            <SelectTrigger><SelectValue placeholder="-- None Selected --" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">-- None Selected --</SelectItem>
              {developers.map((dev) => <SelectItem key={dev.id} value={dev.id}>{dev.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Possession Date</Label>
          <Input
            type="date"
            value={possessionDate}
            onChange={(e) => setPossessionDate(e.target.value)}
          />
        </div>
      </div>

      {/* Pricing & Location */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label>Currency</Label>
          <Input
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            placeholder="INR, USD"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Min Price</Label>
          <Input
            type="number"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            placeholder="e.g. 5000000"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Max Price</Label>
          <Input
            type="number"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            placeholder="e.g. 15000000"
          />
        </div>

        <div className="space-y-1.5">
          <Label>City</Label>
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Mumbai"
          />
        </div>

        <div className="space-y-1.5">
          <Label>State</Label>
          <Input
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="e.g. Maharashtra"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Postal Code</Label>
          <Input
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="e.g. 400001"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Address</Label>
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="e.g. Plot 42, Palm Beach Road"
        />
      </div>

      <div className="space-y-1.5">
        <ImageUpload
          label="Project Cover Image"
          value={coverImage}
          onChange={(val) => setCoverImage(val || "")}
          maxFiles={1}
          description="Upload primary cover photograph for this property development"
        />
      </div>

      <div className="space-y-1.5">
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detailed project description, architectural highlights, amenities..."
        />
      </div>

      {/* Amenities Multi-Select */}
      {allAmenities.length > 0 && (
        <div className="space-y-2">
          <Label>Amenities</Label>
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
