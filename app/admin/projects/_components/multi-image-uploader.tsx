"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import Image from "next/image";
import { uploadSingleImageServerAction } from "@/app/admin/projects/actions";

type MultiImageUploaderProps = {
  defaultValue?: string[];
  name?: string;
};

export function MultiImageUploader({ defaultValue = [], name = "additionalImages" }: MultiImageUploaderProps) {
  const [imageUrls, setImageUrls] = useState<string[]>(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [manualMode, setManualMode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await processFiles(files);
    }
  };

  const processFiles = async (files: File[]) => {
    setError(null);
    setUploading(true);

    const newUrls: string[] = [];
    let hasError = false;

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadSingleImageServerAction(formData);

      if (res.success && res.url) {
        newUrls.push(res.url);
      } else {
        setError(res.error || `Upload van ${file.name} mislukt`);
        hasError = true;
      }
    }

    setUploading(false);

    if (newUrls.length > 0) {
      setImageUrls((prev) => [...prev, ...newUrls]);
    }

    if (!hasError) {
      setError(null);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImageUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length > 0) {
      await processFiles(files);
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden textarea formatted with one URL per line */}
      <textarea
        name={name}
        value={imageUrls.join("\n")}
        onChange={() => {}}
        className="hidden"
      />

      {/* Grid of uploaded thumbnail previews */}
      {imageUrls.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {imageUrls.map((url, idx) => (
            <div key={url + idx} className="group relative aspect-[16/10] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              <Image
                src={url}
                alt={`Extra afbeelding ${idx + 1}`}
                width={200}
                height={125}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700"
                title="Verwijderen"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {/* Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
          isDragOver
            ? "border-slate-900 bg-slate-100"
            : "border-slate-300 bg-slate-50/60 hover:border-slate-400 hover:bg-slate-100/50"
        }`}
      >
        {uploading ? (
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <svg className="h-5 w-5 animate-spin text-slate-900" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Afbeeldingen uploaden...</span>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900">+ Extra afbeeldingen toevoegen</p>
            <p className="text-xs text-slate-500">Selecteer meerdere bestanden vanaf je laptop (JPG, PNG, WebP)</p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleFileChange}
        className="hidden"
      />

      {error ? <p className="text-xs font-semibold text-red-600">{error}</p> : null}

      {/* Manual URL input fallback toggle */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setManualMode(!manualMode)}
          className="text-xs font-medium text-slate-500 underline hover:text-slate-900"
        >
          {manualMode ? "Verberg handmatige URL-invoer" : "Of bewerk URL's handmatig"}
        </button>

        {manualMode ? (
          <textarea
            value={imageUrls.join("\n")}
            onChange={(e) =>
              setImageUrls(
                e.target.value
                  .split("\n")
                  .map((v) => v.trim())
                  .filter(Boolean)
              )
            }
            rows={4}
            placeholder="Eén URL per regel"
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
          />
        ) : null}
      </div>
    </div>
  );
}
