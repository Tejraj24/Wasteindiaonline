"use client";

import { useState, useRef } from "react";
import { Upload, X, ArrowLeft, ArrowRight, Image as ImageIcon, Star, Plus, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export interface UploadedImage {
  imageUrl: string;
  altText?: string;
  sortOrder?: number;
}

interface ImageUploadProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

export function ImageUpload({ images, onChange, maxImages = 8 }: ImageUploadProps) {
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(15);
    setStatusMessage(null);

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        validFiles.push(file);
      }
    }

    console.log("[ImageUpload Frontend 1. Files selected]", {
      totalSelected: files.length,
      validImageCount: validFiles.length,
      fileNames: validFiles.map((f) => f.name),
    });

    if (validFiles.length === 0) {
      setIsUploading(false);
      setStatusMessage({ type: "error", text: "Please select valid image files (PNG, JPG, WebP, AVIF)." });
      return;
    }

    const availableSlots = maxImages - images.length;
    if (availableSlots <= 0) {
      setIsUploading(false);
      setStatusMessage({ type: "error", text: `Maximum image limit (${maxImages}) reached.` });
      return;
    }

    const filesToUpload = validFiles.slice(0, availableSlots);

    try {
      const formData = new FormData();
      for (const file of filesToUpload) {
        formData.append("files", file);
      }

      setUploadProgress(35);

      if (!user) {
        console.warn("[ImageUpload Frontend 2. Auth missing] No active user logged in.");
        throw new Error("You must be signed in as an administrator to upload images.");
      }

      const token = await user.getIdToken(true);
      console.log("[ImageUpload Frontend 2. ID Token acquired]", {
        userEmail: user.email,
        tokenLength: token?.length,
        tokenPreview: token ? `${token.substring(0, 15)}...` : "NONE",
      });

      console.log("[ImageUpload Frontend 3. Dispatching POST /api/admin/upload]");
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      setUploadProgress(75);
      console.log("[ImageUpload Frontend 4. Response received]", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("[ImageUpload Frontend Error Response]", errorData);
        throw new Error(errorData?.error || `Upload failed with status code ${response.status}`);
      }

      const result = await response.json();
      console.log("[ImageUpload Frontend 5. JSON parsed]", result);

      const uploadedCloudImages = result.images || [];
      if (uploadedCloudImages.length === 0) {
        throw new Error("No image URLs were returned from upload handler.");
      }

      const newImages: UploadedImage[] = [
        ...images,
        ...uploadedCloudImages.map((img: { imageUrl?: string; secureUrl?: string; altText?: string }, idx: number) => ({
          imageUrl: img.imageUrl || img.secureUrl || "",
          altText: img.altText || `Product Image ${images.length + idx + 1}`,
          sortOrder: images.length + idx,
        })),
      ];

      console.log("[ImageUpload Frontend 6. Updating state with new images]", {
        previousCount: images.length,
        newCount: newImages.length,
        newImages,
      });

      onChange(newImages);
      setUploadProgress(100);
      setStatusMessage({
        type: "success",
        text: `Successfully uploaded ${uploadedCloudImages.length} image${uploadedCloudImages.length > 1 ? "s" : ""} to Cloudinary CDN.`,
      });

      setTimeout(() => {
        setStatusMessage(null);
      }, 4000);
    } catch (err: unknown) {
      console.error("[ImageUpload Frontend Exception]", err);
      const msg = err instanceof Error ? err.message : "Image upload failed. Please try again.";
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleAddUrl() {
    if (!urlInput.trim()) return;
    if (images.length >= maxImages) return;

    const newImages = [
      ...images,
      {
        imageUrl: urlInput.trim(),
        altText: `Product image ${images.length + 1}`,
        sortOrder: images.length,
      },
    ];

    console.log("[ImageUpload Frontend Add URL]", urlInput.trim());
    onChange(newImages);
    setUrlInput("");
    setStatusMessage({ type: "success", text: "Image URL added." });
    setTimeout(() => setStatusMessage(null), 3000);
  }

  function handleRemove(index: number) {
    const updated = images.filter((_, i) => i !== index).map((img, i) => ({ ...img, sortOrder: i }));
    console.log("[ImageUpload Frontend Remove Image]", { removedIndex: index, remainingCount: updated.length });
    onChange(updated);
  }

  function handleMove(index: number, direction: "left" | "right") {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const reindexed = updated.map((img, i) => ({ ...img, sortOrder: i }));
    onChange(reindexed);
  }

  function handleSetPrimary(index: number) {
    if (index === 0) return;
    const updated = [...images];
    const [selected] = updated.splice(index, 1);
    updated.unshift(selected);
    const reindexed = updated.map((img, i) => ({ ...img, sortOrder: i }));
    onChange(reindexed);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase tracking-wider font-semibold text-zinc-300">
          Product Images ({images.length}/{maxImages})
        </label>
        <span className="text-[11px] text-zinc-500">Cloudinary CDN Storage Active</span>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          void handleFiles(e.dataTransfer.files);
        }}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all ${
          isDragging
            ? "border-blue-500 bg-blue-500/10 text-blue-400"
            : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-900/40 text-zinc-400"
        } ${isUploading ? "pointer-events-none opacity-80" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => void handleFiles(e.target.files)}
        />
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-zinc-300">
          {isUploading ? <Loader2 className="h-5 w-5 animate-spin text-blue-500" /> : <Upload className="h-5 w-5" />}
        </div>
        <p className="mt-3 text-sm font-medium text-zinc-200">
          {isUploading ? (
            "Uploading to Cloudinary CDN..."
          ) : (
            <>
              Drag & drop images here, or <span className="text-blue-400 underline">browse files</span>
            </>
          )}
        </p>
        <p className="mt-1 text-xs text-zinc-500">PNG, JPG, WebP, AVIF up to 10MB per image</p>

        {isUploading && (
          <div className="mt-4 w-full max-w-xs">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] text-zinc-400">Processing Cloudinary upload ({uploadProgress}%)...</p>
          </div>
        )}
      </div>

      {/* Status Alerts */}
      {statusMessage && (
        <div
          className={`flex items-center gap-2 rounded-lg p-3 text-xs font-medium ${
            statusMessage.type === "success"
              ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : "border border-red-500/20 bg-red-500/10 text-red-400"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Direct Image URL input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <ImageIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Or paste an external image URL (Unsplash, Cloudinary, etc.)"
            className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 pl-9 pr-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={handleAddUrl}
          disabled={!urlInput.trim() || images.length >= maxImages}
          className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-800 px-4 text-xs font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-40"
        >
          <Plus className="h-3.5 w-3.5" />
          Add URL
        </button>
      </div>

      {/* Image Grid with Previews, Reordering, Remove */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img, index) => (
            <div
              key={`${img.imageUrl}-${index}`}
              className="group relative aspect-square overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900"
            >
              <img
                src={img.imageUrl}
                alt={img.altText || `Product Image ${index + 1}`}
                className="h-full w-full object-cover"
              />

              {/* Primary badge */}
              {index === 0 && (
                <span className="absolute left-2 top-2 flex items-center gap-1 rounded bg-blue-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-md">
                  <Star className="h-2.5 w-2.5 fill-current" /> Primary
                </span>
              )}

              {/* Action overlays on hover */}
              <div className="absolute inset-0 flex flex-col justify-between bg-black/60 p-2 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
                <div className="flex justify-between items-center">
                  {index !== 0 ? (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(index)}
                      className="rounded bg-zinc-800/90 px-2 py-1 text-[9px] uppercase font-semibold text-zinc-200 hover:bg-blue-600 hover:text-white"
                      title="Set as primary"
                    >
                      Set Primary
                    </button>
                  ) : <div />}
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600/80 text-white hover:bg-red-600"
                    title="Delete image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMove(index, "left")}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-white transition hover:bg-zinc-700 disabled:opacity-30"
                    title="Move left"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === images.length - 1}
                    onClick={() => handleMove(index, "right")}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-white transition hover:bg-zinc-700 disabled:opacity-30"
                    title="Move right"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
