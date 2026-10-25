"use client";

import { useState, useRef } from "react";
import {
  UploadCloud,
  RefreshCw,
  Undo2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  isCloudinaryUrl,
  isBackgroundRemovedUrl,
} from "@/lib/background-removal";

interface SingleImageUploadSlotProps {
  currentImageUrl: string;
  defaultImageUrl?: string;
  label: string;
  sublabel?: string;
  aspectRatio?: "16/9" | "3/4" | "4/3" | "1/1";
  onImageChange: (newUrl: string) => void;
  onResetToDefault?: () => void;
  isModified?: boolean;
  badge?: string;
  enableBackgroundRemoval?: boolean;
}

export function SingleImageUploadSlot({
  currentImageUrl,
  defaultImageUrl,
  label,
  sublabel,
  aspectRatio = "16/9",
  onImageChange,
  onResetToDefault,
  isModified = false,
  badge,
  enableBackgroundRemoval = true,
}: SingleImageUploadSlotProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [cachedOriginalUrl, setCachedOriginalUrl] = useState<string | null>(null);

  const aspectClass = {
    "16/9": "aspect-[16/9]",
    "3/4": "aspect-[3/4]",
    "4/3": "aspect-[4/3]",
    "1/1": "aspect-square",
  }[aspectRatio] || "aspect-[16/9]";

  const hasBgRemoved = isBackgroundRemovedUrl(currentImageUrl);
  const isCloudinary = isCloudinaryUrl(currentImageUrl);

  // Background removal API helper
  const processBackgroundRemoval = async (imageUrl: string, action: "remove" | "restore" = "remove") => {
    if (!user) {
      setErrorMessage("You must be logged in as an administrator.");
      return;
    }

    setIsRemovingBg(true);
    setErrorMessage(null);
    setSuccessNotice(null);

    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/remove-background", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          imageUrl,
          action,
          verify: true,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || `Background removal failed (HTTP ${res.status})`);
      }

      if (data.imageUrl) {
        if (action === "remove") {
          setCachedOriginalUrl(imageUrl);
          setSuccessNotice("Background removed successfully (Transparent PNG).");
        } else {
          setSuccessNotice("Original background restored.");
        }
        onImageChange(data.imageUrl);
      }
    } catch (err: any) {
      console.error("[SingleImageUploadSlot BG Removal Error]:", err);
      setErrorMessage(err.message || "Failed to process background removal. You can retry.");
    } finally {
      setIsRemovingBg(false);
      setTimeout(() => setSuccessNotice(null), 4000);
    }
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0 || isUploading) return;
    const file = files[0];
    setErrorMessage(null);
    setSuccessNotice(null);

    // Validate type
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (JPG, PNG, WebP, AVIF).");
      return;
    }

    // Cloudinary Free plan limit (10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMessage(
        `File is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Max limit is 10MB per image on Cloudinary Free Plan.`
      );
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const token = await user?.getIdToken();
      if (!token) {
        throw new Error("You must be logged in as an administrator to upload images.");
      }

      setUploadProgress(20);

      // 1. Get signed upload parameters
      const signRes = await fetch("/api/admin/upload/sign", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!signRes.ok) {
        const errData = await signRes.json().catch(() => null);
        throw new Error(errData?.error || `Upload authorization failed (HTTP ${signRes.status})`);
      }

      const signData = await signRes.json();
      setUploadProgress(35);

      // 2. Direct upload to Cloudinary
      const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const uploadUrl = `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`;
        xhr.open("POST", uploadUrl, true);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.min(95, Math.round(35 + (e.loaded / e.total) * 60));
            setUploadProgress(pct);
          }
        };

        xhr.onload = () => {
          try {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) {
              resolve({ secure_url: data.secure_url });
            } else {
              reject(new Error(data?.error?.message || `Cloudinary upload failed (${xhr.status})`));
            }
          } catch {
            reject(new Error(`Failed to parse Cloudinary response (HTTP ${xhr.status})`));
          }
        };

        xhr.onerror = () => {
          reject(new Error("Network error during direct Cloudinary upload."));
        };

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", signData.apiKey);
        formData.append("timestamp", String(signData.timestamp));
        formData.append("signature", signData.signature);
        formData.append("folder", signData.folder);

        xhr.send(formData);
      });

      setUploadProgress(100);
      setCachedOriginalUrl(uploadResult.secure_url);

      // 3. Automatic background removal for silhouette product slots
      if (enableBackgroundRemoval) {
        setIsUploading(false);
        setIsRemovingBg(true);
        try {
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
            onImageChange(bgData.imageUrl);
            setSuccessNotice("Uploaded and background automatically removed (Transparent PNG).");
          } else {
            // Fallback to original image if background removal fails, allowing admin retry
            onImageChange(uploadResult.secure_url);
            setErrorMessage(bgData?.error || "Image uploaded, but automatic background removal encountered an issue. Click 'Remove Background' to retry.");
          }
        } catch (bgErr: any) {
          onImageChange(uploadResult.secure_url);
          setErrorMessage(bgErr?.message || "Uploaded, but background removal timed out. Click 'Remove Background' to retry.");
        } finally {
          setIsRemovingBg(false);
        }
      } else {
        onImageChange(uploadResult.secure_url);
        setSuccessNotice("Image uploaded successfully.");
      }
    } catch (err: any) {
      console.error("[SingleImageUploadSlot Error]", err);
      setErrorMessage(err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setTimeout(() => setSuccessNotice(null), 4000);
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 transition-all">
      {/* Top Meta */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">{label}</h4>
            {badge && (
              <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-mono font-medium text-blue-400 border border-blue-500/20">
                {badge}
              </span>
            )}
            {hasBgRemoved && (
              <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-mono font-medium text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5" />
                <span>Transparent PNG</span>
              </span>
            )}
            {isModified && (
              <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-mono font-medium text-amber-400 border border-amber-500/20">
                Modified
              </span>
            )}
          </div>
          {sublabel && <p className="text-[10px] text-zinc-500 mt-0.5">{sublabel}</p>}
        </div>

        {onResetToDefault && isModified && (
          <button
            type="button"
            onClick={onResetToDefault}
            className="inline-flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white transition"
            title="Reset to default image"
          >
            <Undo2 className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Preview & Drop Area */}
      <div
        onClick={() => {
          if (!isUploading && !isRemovingBg) fileInputRef.current?.click();
        }}
        className={`group relative w-full ${aspectClass} overflow-hidden rounded-lg border bg-zinc-950 transition-colors cursor-pointer ${
          isDragOver
            ? "border-blue-500 bg-blue-950/20 ring-2 ring-blue-500/30"
            : "border-zinc-800/80 hover:border-blue-500/60"
        }`}
        title="Click to select a new image or drag and drop here"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFileSelect(e.dataTransfer.files);
        }}
      >
        {currentImageUrl ? (
          <img
            src={currentImageUrl}
            alt={label}
            className="h-full w-full object-contain object-center transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-zinc-500 text-xs p-4 text-center">
            <UploadCloud className="h-8 w-8 text-zinc-600" />
            <span>Click or drag image here to upload</span>
          </div>
        )}

        {/* Hover / Focus Overlay with clear instructions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-3">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg pointer-events-none">
            <UploadCloud className="h-4 w-4" />
            <span>Click to Replace Image</span>
          </span>
          <span className="text-[10px] text-zinc-300 pointer-events-none">
            or drag and drop a new file here
          </span>

          {currentImageUrl && (
            <a
              href={currentImageUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-1 inline-flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white underline transition"
            >
              <Eye className="h-3 w-3" />
              <span>View Full Size</span>
            </a>
          )}
        </div>

        {/* Uploading Progress Overlay */}
        {isUploading && (
          <div
            className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-4 z-20 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <RefreshCw className="h-6 w-6 text-blue-400 animate-spin mb-2" />
            <p className="text-xs font-medium text-zinc-200">Uploading directly to Cloudinary...</p>
            <div className="mt-2 w-full max-w-[140px] bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span className="text-[10px] text-zinc-400 mt-1 font-mono">{uploadProgress}%</span>
          </div>
        )}

        {/* Background Removal Processing Overlay */}
        {isRemovingBg && (
          <div
            className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-4 z-25 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <Loader2 className="h-7 w-7 text-emerald-400 animate-spin mb-2" />
            <p className="text-xs font-semibold text-white">Removing Background (AI)...</p>
            <p className="text-[10px] text-zinc-400 mt-1 text-center max-w-[200px]">
              Extracting garment outline and generating transparent alpha PNG...
            </p>
          </div>
        )}
      </div>

      {/* Prominent Action Bar */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800/60">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />

        <div className="flex items-center gap-2 flex-wrap">
          {/* Replace Image Button */}
          <button
            type="button"
            disabled={isUploading || isRemovingBg}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition disabled:opacity-50 cursor-pointer"
          >
            <UploadCloud className="h-3.5 w-3.5" />
            <span>{isUploading ? "Uploading..." : "Replace Image"}</span>
          </button>

          {/* AI Background Removal Toggle / Action */}
          {currentImageUrl && isCloudinary && (
            <>
              {hasBgRemoved ? (
                <button
                  type="button"
                  disabled={isUploading || isRemovingBg}
                  onClick={() => processBackgroundRemoval(currentImageUrl, "restore")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 active:bg-zinc-800 px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white transition cursor-pointer"
                  title="Revert back to original uploaded image with its background"
                >
                  <Undo2 className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Restore Original</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isUploading || isRemovingBg}
                  onClick={() => processBackgroundRemoval(currentImageUrl, "remove")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 active:bg-emerald-500/30 px-2.5 py-1.5 text-xs font-semibold text-emerald-300 transition cursor-pointer"
                  title="Remove solid background using Cloudinary AI"
                >
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Remove BG (AI)</span>
                </button>
              )}
            </>
          )}

          {/* Reset to Default */}
          {onResetToDefault && isModified && (
            <button
              type="button"
              disabled={isUploading || isRemovingBg}
              onClick={onResetToDefault}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 active:bg-zinc-800 px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white transition cursor-pointer"
              title="Reset to default image"
            >
              <Undo2 className="h-3.5 w-3.5" />
              <span>Reset to Default</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {currentImageUrl && (
            <a
              href={currentImageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 transition"
              title="Preview image in new tab"
            >
              <Eye className="h-3 w-3" />
              <span>Preview</span>
            </a>
          )}
          <span className="text-[10px] text-zinc-500 font-mono">Cloudinary CDN</span>
        </div>
      </div>

      {/* Success Notice */}
      {successNotice && (
        <div className="mt-2 flex items-center gap-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 text-[11px] text-emerald-300">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Error Message with Retry */}
      {errorMessage && (
        <div className="mt-2 flex items-center justify-between gap-2 rounded-md bg-red-500/10 border border-red-500/20 px-2.5 py-1.5 text-[11px] text-red-300">
          <div className="flex items-center gap-1.5 min-w-0">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-400" />
            <span className="truncate">{errorMessage}</span>
          </div>
          {currentImageUrl && isCloudinary && (
            <button
              type="button"
              onClick={() => processBackgroundRemoval(cachedOriginalUrl || currentImageUrl, "remove")}
              className="shrink-0 rounded bg-red-600/30 px-2 py-0.5 text-[10px] font-semibold text-red-200 hover:bg-red-600/50 transition cursor-pointer"
            >
              Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
}
