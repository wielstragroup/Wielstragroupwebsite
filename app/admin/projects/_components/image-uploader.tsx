"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import Image from "next/image";
import { uploadSingleImageServerAction } from "@/app/admin/projects/actions";

type ImageUploaderProps = {
  defaultValue?: string;
  name?: string;
};

export function ImageUploader({ defaultValue = "", name = "image" }: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState<string>(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [manualMode, setManualMode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadSingleImageServerAction(formData);

    setUploading(false);

    if (res.success && res.url) {
      setImageUrl(res.url);
    } else {
      setError(res.error || "Upload mislukt");
    }
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
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleRemove = () => {
    setImageUrl("");
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={imageUrl} required />

      {/* Upload area or Preview */}
      {imageUrl ? (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-4">
            <div className="relative aspect-[16/10] w-32 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
              <Image
                src={imageUrl}
                alt="Hoofdafbeelding preview"
                width={200}
                height={125}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <p className="truncate text-xs font-medium text-slate-500">{imageUrl}</p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Afbeelding vervangen
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                >
                  Afbeelding verwijderen
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
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
              <span>Afbeelding uploaden...</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 shadow-xs">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Afbeelding uploaden</p>
                <p className="mt-1 text-xs text-slate-500">Sleep een bestand hierheen of klik om te kiezen (JPG, PNG, WebP, max 5MB)</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {error ? (
        <p className="text-xs font-semibold text-red-600">{error}</p>
      ) : null}

      {/* Manual URL input fallback toggle */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setManualMode(!manualMode)}
          className="text-xs font-medium text-slate-500 underline hover:text-slate-900"
        >
          {manualMode ? "Verberg handmatige URL-invoer" : "Of voer een handmatige URL in"}
        </button>

        {manualMode ? (
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://... of /placeholders/..."
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
          />
        ) : null}
      </div>
    </div>
  );
}
