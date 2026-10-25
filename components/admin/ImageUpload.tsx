"use client";

import { useState, useRef } from "react";
import {
  Upload,
  X,
  ArrowLeft,
  ArrowRight,
  Image as ImageIcon,
  Star,
  Plus,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Undo2,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  isCloudinaryUrl,
  isBackgroundRemovedUrl,
  getOriginalFromCloudinaryUrl,
} from "@/lib/background-removal";

export interface UploadedImage {
  imageUrl: string;
  altText?: string;
  sortOrder?: number;
  originalUrl?: string;
  isRemovingBg?: boolean;
  bgError?: string;
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
  const [autoRemoveBg, setAutoRemoveBg] = useState(true);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cloudinary Free tier allows images up to 10 MB (10,485,760 bytes)
  const CLOUDINARY_MAX_IMAGE_BYTES = 10 * 1024 * 1024;

  // Single image background removal handler
  async function handleToggleBackground(index: number, action: "remove" | "restore") {
    if (!user) {
      setStatusMessage({ type: "error", text: "You must be signed in as an administrator." });
      return;
    }

    const targetImg = images[index];
    if (!targetImg) return;

    // Set loading state for this specific image
    const updatedWithLoading = [...images];
    updatedWithLoading[index] = { ...targetImg, isRemovingBg: true, bgError: undefined };
    onChange(updatedWithLoading);

    try {
      const token = await user.getIdToken();
      const targetUrl = action === "restore"
        ? targetImg.imageUrl
        : (targetImg.originalUrl || targetImg.imageUrl);

      const res = await fetch("/api/admin/remove-background", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          imageUrl: targetUrl,
          action,
          verify: true,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || `Failed to process background removal (${res.status})`);
      }

      const nextImages = [...images];
      if (action === "remove") {
        nextImages[index] = {
          ...targetImg,
          imageUrl: data.imageUrl,
          originalUrl: targetImg.originalUrl || targetImg.imageUrl,
          isRemovingBg: false,
          bgError: undefined,
        };
        setStatusMessage({ type: "success", text: "Background removed successfully (Transparent PNG)." });
      } else {
        const restoredUrl = data.imageUrl || targetImg.originalUrl || getOriginalFromCloudinaryUrl(targetImg.imageUrl);
        nextImages[index] = {
          ...targetImg,
          imageUrl: restoredUrl,
          isRemovingBg: false,
          bgError: undefined,
        };
        setStatusMessage({ type: "success", text: "Original background restored." });
      }
      onChange(nextImages);
    } catch (err: any) {
      console.error("[ImageUpload Toggle Background Error]:", err);
      const nextImages = [...images];
      nextImages[index] = {
        ...targetImg,
        isRemovingBg: false,
        bgError: err.message || "Failed to remove background",
      };
      onChange(nextImages);
      setStatusMessage({ type: "error", text: err.message || "Background removal failed. You can retry." });
    } finally {
      setTimeout(() => setStatusMessage(null), 4000);
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0 || isUploading) return;

    setIsUploading(true);
    setUploadProgress(5);
    setStatusMessage(null);

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        validFiles.push(file);
      }
    }

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
      // 1. Client-side file size validation against Cloudinary account limit
      for (const file of filesToUpload) {
        if (file.size > CLOUDINARY_MAX_IMAGE_BYTES) {
          const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
          throw new Error(
            `"${file.name}" is ${sizeMB} MB, exceeding Cloudinary's 10 MB limit for this account. Please compress the file before uploading.`
          );
        }
      }

      // 2. Obtain current Firebase administrator token
      if (!user) {
        throw new Error("You must be signed in as an administrator to upload images.");
      }

      const token = await user.getIdToken(true);
      setUploadProgress(15);

      // 3. Request signed direct upload parameters from backend
      const signResponse = await fetch("/api/admin/upload/sign", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!signResponse.ok) {
        const errorData = await signResponse.json().catch(() => null);
        throw new Error(errorData?.error || `Failed to authorize upload with server (HTTP ${signResponse.status})`);
      }

      const signData: {
        signature: string;
        timestamp: number;
        folder: string;
        cloudName: string;
        apiKey: string;
      } = await signResponse.json();

      setUploadProgress(25);

      // 4. Upload files directly to Cloudinary via HTTPS
      const uploadedCloudImages: UploadedImage[] = [];
      const totalFiles = filesToUpload.length;

      for (let i = 0; i < totalFiles; i++) {
        const file = filesToUpload[i];
        const baseName = file.name.split(".")[0];

        const uploadResult = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          const uploadUrl = `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`;
          xhr.open("POST", uploadUrl, true);

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const fileFraction = e.loaded / e.total;
              const overallPercent = Math.min(85, Math.round(25 + ((i + fileFraction) / totalFiles) * 60));
              setUploadProgress(overallPercent);
            }
          };

          xhr.onload = () => {
            try {
              const data = JSON.parse(xhr.responseText);
              if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) {
                resolve({ secure_url: data.secure_url, public_id: data.public_id });
              } else {
                const errorMsg = data?.error?.message || `Cloudinary upload failed (HTTP ${xhr.status})`;
                reject(new Error(errorMsg));
              }
            } catch {
              reject(new Error(`Failed to parse Cloudinary response (HTTP ${xhr.status})`));
            }
          };

          xhr.onerror = () => {
            reject(new Error("Network connection error while uploading directly to Cloudinary."));
          };

          const uploadFormData = new FormData();
          uploadFormData.append("file", file);
          uploadFormData.append("api_key", signData.apiKey);
          uploadFormData.append("timestamp", String(signData.timestamp));
          uploadFormData.append("signature", signData.signature);
          uploadFormData.append("folder", signData.folder);

          xhr.send(uploadFormData);
        });

        let finalImageUrl = uploadResult.secure_url;
        let bgError: string | undefined = undefined;

        // 5. Automatic AI background removal if enabled
        if (autoRemoveBg) {
          try {
            setUploadProgress(Math.min(95, 85 + Math.round(((i + 1) / totalFiles) * 10)));
            const bgRes = await fetch("/api/admin/remove-background", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                imageUrl: uploadResult.secure_url,
                action: "remove",
                verify: true,
              }),
            });

            const bgData = await bgRes.json().catch(() => ({}));
            if (bgRes.ok && bgData?.imageUrl) {
              finalImageUrl = bgData.imageUrl;
            } else {
              bgError = bgData?.error || "Automatic background removal failed. Click Retry to run again.";
            }
          } catch (bgErr: any) {
            bgError = bgErr?.message || "Background removal timed out.";
          }
        }

        uploadedCloudImages.push({
          imageUrl: finalImageUrl,
          originalUrl: uploadResult.secure_url,
          altText: baseName || `Product Image ${images.length + i + 1}`,
          sortOrder: images.length + i,
          bgError,
        });
      }

      const newImages: UploadedImage[] = [...images, ...uploadedCloudImages];
      onChange(newImages);
      setUploadProgress(100);
      setStatusMessage({
        type: "success",
        text: `Successfully uploaded ${uploadedCloudImages.length} image${uploadedCloudImages.length > 1 ? "s" : ""} ${
          autoRemoveBg ? "with automatic background removal" : "to Cloudinary"
        }.`,
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

    const trimmed = urlInput.trim();
    const newImages = [
      ...images,
      {
        imageUrl: trimmed,
        originalUrl: trimmed,
        altText: `Product image ${images.length + 1}`,
        sortOrder: images.length,
      },
    ];

    onChange(newImages);
    setUrlInput("");
    setStatusMessage({ type: "success", text: "Image URL added." });
    setTimeout(() => setStatusMessage(null), 3000);
  }

  function handleRemove(index: number) {
    const updated = images.filter((_, i) => i !== index).map((img, i) => ({ ...img, sortOrder: i }));
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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-xs uppercase tracking-wider font-semibold text-zinc-300">
          Product Images ({images.length}/{maxImages})
        </label>

        {/* Automatic Background Removal Toggle */}
        <label className="flex items-center gap-2 cursor-pointer text-[11px] text-zinc-400 hover:text-zinc-200 select-none">
          <input
            type="checkbox"
            checked={autoRemoveBg}
            onChange={(e) => setAutoRemoveBg(e.target.checked)}
            className="rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500/20 h-3.5 w-3.5 cursor-pointer"
          />
          <span className="flex items-center gap-1 font-medium text-emerald-400">
            <Sparkles className="h-3 w-3" />
            <span>Auto Background Removal (AI)</span>
          </span>
        </label>
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
            autoRemoveBg ? "Uploading & removing background (AI)..." : "Uploading directly to Cloudinary..."
          ) : (
            <>
              Drag & drop images here, or <span className="text-blue-400 underline">browse files</span>
            </>
          )}
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          {autoRemoveBg ? "Images will be automatically processed into transparent PNGs" : "PNG, JPG, WebP up to 10MB per image"}
        </p>

        {isUploading && (
          <div className="mt-4 w-full max-w-xs">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] text-zinc-400">
              {uploadProgress < 85 ? `Uploading (${uploadProgress}%)...` : "Processing AI background removal..."}
            </p>
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
            placeholder="Or paste an external image URL"
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

      {/* Image Grid with Previews, Transparency Badges, AI Actions */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img, index) => {
            const hasTransparentBg = isBackgroundRemovedUrl(img.imageUrl);
            const isCloudinary = isCloudinaryUrl(img.imageUrl);

            return (
              <div
                key={`${img.imageUrl}-${index}`}
                className="group relative aspect-square overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950"
              >
                {/* Checkerboard hint for transparent preview */}
                <div
                  className="h-full w-full bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:8px_8px] flex items-center justify-center p-2"
                >
                  <img
                    src={img.imageUrl}
                    alt={img.altText || `Product Image ${index + 1}`}
                    className="h-full w-full object-contain"
                  />
                </div>

                {/* Primary badge */}
                {index === 0 && (
                  <span className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded bg-blue-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-md">
                    <Star className="h-2.5 w-2.5 fill-current" /> Primary
                  </span>
                )}

                {/* Transparency Badge */}
                {hasTransparentBg && (
                  <span className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded bg-emerald-950/80 border border-emerald-500/40 px-1.5 py-0.5 text-[9px] font-mono font-medium text-emerald-300 backdrop-blur-sm shadow-md">
                    <Sparkles className="h-2.5 w-2.5 text-emerald-400" />
                    <span>Transparent</span>
                  </span>
                )}

                {/* Background Error Badge */}
                {img.bgError && !img.isRemovingBg && (
                  <div className="absolute right-2 bottom-2 z-10 flex items-center gap-1 rounded bg-red-950/90 border border-red-500/40 px-1.5 py-0.5 text-[9px] text-red-300">
                    <AlertCircle className="h-2.5 w-2.5" />
                    <span>BG Error</span>
                  </div>
                )}

                {/* Loading state during background removal */}
                {img.isRemovingBg && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/85 p-2 text-center">
                    <Loader2 className="h-5 w-5 text-emerald-400 animate-spin mb-1" />
                    <span className="text-[10px] text-white font-medium">Removing BG...</span>
                  </div>
                )}

                {/* Action overlays on hover */}
                <div className="absolute inset-0 z-10 flex flex-col justify-between bg-black/75 p-2 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
                  <div className="flex justify-between items-center gap-1">
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
                      onClick={() => setConfirmDeleteIndex(index)}
                      className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-600/80 text-white hover:bg-red-600 transition cursor-pointer"
                      title="Remove this image"
                      aria-label={`Remove gallery image ${index + 1}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>

                  {/* AI Background Removal Toggle / Retry inside hover overlay */}
                  <div className="flex flex-col gap-1 items-center">
                    {isCloudinary && (
                      <>
                        {hasTransparentBg ? (
                          <button
                            type="button"
                            onClick={() => handleToggleBackground(index, "restore")}
                            className="inline-flex items-center gap-1 rounded bg-zinc-800/90 hover:bg-zinc-700 px-2 py-1 text-[10px] text-zinc-300 transition"
                            title="Revert back to original image with background"
                          >
                            <Undo2 className="h-3 w-3" />
                            <span>Restore BG</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleBackground(index, "remove")}
                            className="inline-flex items-center gap-1 rounded bg-emerald-600/90 hover:bg-emerald-500 px-2 py-1 text-[10px] font-semibold text-white transition shadow-sm"
                            title="Remove background using Cloudinary AI"
                          >
                            <Sparkles className="h-3 w-3" />
                            <span>Remove BG (AI)</span>
                          </button>
                        )}
                      </>
                    )}

                    {img.bgError && (
                      <button
                        type="button"
                        onClick={() => handleToggleBackground(index, "remove")}
                        className="inline-flex items-center gap-1 rounded bg-red-600 px-2 py-0.5 text-[9px] font-bold text-white hover:bg-red-500"
                      >
                        <RefreshCw className="h-2.5 w-2.5" />
                        <span>Retry Removal</span>
                      </button>
                    )}
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
            );
          })}
        </div>
      )}

      {/* Confirmation Dialog: "Remove this image?" */}
      {confirmDeleteIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setConfirmDeleteIndex(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl space-y-4 text-zinc-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/15 text-red-400 border border-red-500/30 shrink-0">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Remove this image?
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Gallery Image #{confirmDeleteIndex + 1}
                </p>
              </div>
            </div>

            {images[confirmDeleteIndex] && (
              <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-2.5">
                <div className="h-12 w-12 rounded overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800 flex items-center justify-center">
                  <img
                    src={images[confirmDeleteIndex].imageUrl}
                    alt={`Gallery Image ${confirmDeleteIndex + 1}`}
                    className="h-full w-full object-contain"
                  />
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed min-w-0 flex-1">
                  Remove this image from the gallery? Other images and product data will remain intact.
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-zinc-800/80">
              <button
                type="button"
                onClick={() => setConfirmDeleteIndex(null)}
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const idx = confirmDeleteIndex;
                  setConfirmDeleteIndex(null);
                  handleRemove(idx);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-500 active:bg-red-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove Image</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
