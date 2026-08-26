"use client";

import { useRef, useState, type ChangeEvent } from "react";
import {
  ImagePlus,
  X,
  Upload,
  Fullscreen,
  Link as LinkIcon,
  AlertCircle,
  Eye,
  Trash2,
} from "lucide-react";
import Button from "@/components/ui/store/Button";
import Modal from "@/components/ui/store/Modal";

export interface ImageItem {
  id?: string;
  file_url?: string;
  storage_key?: string;
  file?: File;
  preview?: string;
  isNew?: boolean;
  isExisting?: boolean;
  is_primary?: boolean;
  image_order?: number;
}

export type ImageUploadValue = string | string[] | ImageItem[];

interface ImageUploadProps {
  value?: ImageUploadValue;
  onChange: (value: any) => void;
  maxFiles?: number;
  label?: string;
  description?: string;
  /** When true, all upload/remove interactions are disabled. */
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  maxFiles = 1,
  label,
  description,
  disabled = false,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const dragIndex = useRef<number | null>(null);

  // Normalize value to array of strings (URLs or base64 data)
  const normalizedImages: string[] = (() => {
    if (!value) return [];
    if (typeof value === "string") return value.trim() ? [value.trim()] : [];
    if (Array.isArray(value)) {
      return value
        .map((item) => {
          if (typeof item === "string") return item;
          if (item && typeof item === "object") {
            return item.preview || item.file_url || "";
          }
          return "";
        })
        .filter(Boolean);
    }
    return [];
  })();

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/avif",
    "image/webp",
    "image/svg+xml",
  ];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files: FileList | File[]) => {
    setErrorMessage(null);
    if (disabled) return;
    const fileArray = Array.from(files);

    const validFiles = fileArray.filter((file) => {
      const isValid = allowedTypes.includes(file.type);
      if (!isValid) {
        setErrorMessage(`Unsupported file format: ${file.name}`);
        return false;
      }
      const isValidSize = file.size <= MAX_FILE_SIZE;
      if (!isValidSize) {
        setErrorMessage(`${file.name} exceeds 10MB image limit`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    try {
      if (maxFiles === 1) {
        const base64 = await fileToBase64(validFiles[0]);
        if (typeof value === "string" || !value) {
          onChange(base64);
        } else if (Array.isArray(value) && typeof value[0] === "object") {
          const item: ImageItem = {
            file: validFiles[0],
            preview: base64,
            file_url: base64,
            isNew: true,
            is_primary: true,
            image_order: 0,
          };
          onChange([item]);
        } else {
          onChange([base64]);
        }
        return;
      }

      const newBase64s = await Promise.all(validFiles.map((f) => fileToBase64(f)));

      if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object") {
        const existingItems = (value as ImageItem[]) || [];
        const newItems: ImageItem[] = validFiles.map((file, idx) => ({
          file,
          preview: newBase64s[idx],
          file_url: newBase64s[idx],
          isNew: true,
          isExisting: false,
          is_primary: existingItems.length === 0 && idx === 0,
          image_order: existingItems.length + idx,
        }));
        onChange([...existingItems, ...newItems].slice(0, maxFiles));
      } else {
        const combined = [...normalizedImages, ...newBase64s].slice(0, maxFiles);
        onChange(combined);
      }
    } catch {
      setErrorMessage("Failed to read image file. Please try again.");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (index: number) => {
    setErrorMessage(null);
    if (disabled) return;
    if (maxFiles === 1 && (typeof value === "string" || !Array.isArray(value))) {
      onChange("");
      return;
    }

    if (Array.isArray(value) && typeof value[0] === "object") {
      const updated = (value as ImageItem[]).filter((_, i) => i !== index);
      onChange(updated);
    } else {
      const updated = normalizedImages.filter((_, i) => i !== index);
      if (maxFiles === 1 && typeof value === "string") {
        onChange("");
      } else {
        onChange(updated);
      }
    }
  };

  const handleAddManualUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    if (!manualUrl.trim()) return;

    const url = manualUrl.trim();
    if (maxFiles === 1) {
      if (typeof value === "string" || !value) {
        onChange(url);
      } else if (Array.isArray(value) && typeof value[0] === "object") {
        onChange([{ file_url: url, preview: url, isNew: true, is_primary: true }]);
      } else {
        onChange([url]);
      }
    } else {
      if (Array.isArray(value) && typeof value[0] === "object") {
        const existingItems = (value as ImageItem[]) || [];
        onChange([...existingItems, { file_url: url, preview: url, isNew: true }]);
      } else {
        onChange([...normalizedImages, url].slice(0, maxFiles));
      }
    }

    setManualUrl("");
    setShowUrlInput(false);
  };

  // Reorder for multiple images
  const handleDragStart = (index: number) => {
    dragIndex.current = index;
  };

  const handleDragEnter = (index: number) => {
    if (dragIndex.current === null || dragIndex.current === index) return;

    if (Array.isArray(value) && typeof value[0] === "object") {
      const newItems = [...(value as ImageItem[])];
      const dragged = newItems[dragIndex.current];
      newItems.splice(dragIndex.current, 1);
      newItems.splice(index, 0, dragged);
      dragIndex.current = index;
      onChange(newItems);
    } else {
      const newImages = [...normalizedImages];
      const dragged = newImages[dragIndex.current];
      newImages.splice(dragIndex.current, 1);
      newImages.splice(index, 0, dragged);
      dragIndex.current = index;
      onChange(newImages);
    }
  };

  return (
    <div className="space-y-3">
      {/* Label and Subtitle */}
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[var(--text-primary)]">{label}</label>
          <button
            type="button"
            onClick={() => {
              if (!disabled) setShowUrlInput(!showUrlInput);
            }}
            className={`text-[11px] text-[var(--brand)] hover:underline inline-flex items-center gap-1 ${
              disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <LinkIcon size={12} />
            {showUrlInput ? "Hide URL input" : "Paste Image URL"}
          </button>
        </div>
      )}

      {/* Manual URL Input Bar (toggleable) */}
      {showUrlInput && (
        <form onSubmit={handleAddManualUrl} className="flex gap-2">
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            className="flex-1 h-9 px-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand)]"
          />
          <Button type="submit" variant="primary" className="h-9 px-3 text-xs">
            Set URL
          </Button>
        </form>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 text-xs text-[var(--destructive)]">
          <AlertCircle size={14} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ── Empty State (Upload Zone) ─────────────────────────── */}
      {normalizedImages.length === 0 && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => {
            if (!disabled) inputRef.current?.click();
          }}
          className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200 ${
            disabled
              ? "border-[var(--border)] bg-[var(--surface)] opacity-60 cursor-not-allowed"
              : `cursor-pointer ${isDragging
                ? "border-[var(--brand)] bg-[var(--brand)]/5 scale-[0.99]"
                : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] hover:border-[var(--brand)]/50"
              }`
          }`}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 text-[var(--brand)]"
            style={{ background: "var(--brand)/10" }}
          >
            <Upload size={22} />
          </div>

          <p className="text-xs font-semibold text-[var(--text-primary)]">
            {maxFiles === 1 ? "Click to upload or drag and drop image" : "Click to upload or drag and drop images"}
          </p>

          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            PNG, JPG, WEBP, SVG, AVIF up to 10MB {maxFiles > 1 ? `(Max ${maxFiles} images)` : ""}
          </p>

          <div className="mt-3 px-3 py-1 rounded-lg text-[11px] font-medium bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text-secondary)]">
            Browse Files
          </div>

          <input
            ref={inputRef}
            type="file"
            multiple={maxFiles > 1}
            accept=".jpg,.jpeg,.png,.avif,.webp,.svg"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>
      )}

      {/* ── Images Grid / Preview ────────────────────────────── */}
      {normalizedImages.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {normalizedImages.map((src, index) => (
            <div
              key={index}
              draggable={maxFiles > 1}
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              className="group relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-xs transition-all hover:shadow-md"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Uploaded image ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Action buttons overlay */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 z-10">
                <button
                  type="button"
                  title="Preview"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewModalUrl(src);
                  }}
                  className="p-1.5 rounded-lg bg-white/90 text-zinc-900 hover:bg-white transition-colors cursor-pointer"
                >
                  <Fullscreen size={14} />
                </button>
                <button
                  type="button"
                  title="Remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {index === 0 && maxFiles > 1 && (
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[var(--brand)] text-white shadow-xs">
                  Cover
                </span>
              )}
            </div>
          ))}

          {/* Add More Box (if maxFiles > length) */}
          {normalizedImages.length < maxFiles && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                if (!disabled) setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => {
                if (!disabled) inputRef.current?.click();
              }}
              className={`flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-dashed transition-all ${
                disabled
                  ? "border-[var(--border)] bg-[var(--surface)] opacity-60 cursor-not-allowed"
                  : `cursor-pointer ${
                      isDragging
                        ? "border-[var(--brand)] bg-[var(--brand)]/10"
                        : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] hover:border-[var(--brand)]"
                    }`
              }`}
            >
              <ImagePlus size={20} className="text-[var(--text-muted)]" />
              <span className="text-[10px] text-[var(--text-muted)] font-medium mt-1">Add More</span>

              <input
                ref={inputRef}
                type="file"
                multiple={maxFiles > 1}
                accept=".jpg,.jpeg,.png,.avif,.webp,.svg"
                className="hidden"
                onChange={handleInputChange}
              />
            </div>
          )}
        </div>
      )}

      {description && <p className="text-[11px] text-[var(--text-muted)]">{description}</p>}

      {/* ── Fullscreen Preview Modal ──────────────────────────── */}
      <Modal open={!!previewModalUrl} onClose={() => setPreviewModalUrl(null)}>
        {previewModalUrl && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Image Preview</h3>
              <button
                onClick={() => setPreviewModalUrl(null)}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="relative max-h-[70vh] flex items-center justify-center overflow-hidden rounded-xl bg-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewModalUrl}
                alt="Fullscreen preview"
                className="max-h-[65vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ImageUpload;
