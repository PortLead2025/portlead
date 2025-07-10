"use client";

import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";
import { ComponentPropsWithoutRef, useEffect, useState } from "react";

type ImagePickerProps = ComponentPropsWithoutRef<"label"> & {
  file: File | null | undefined;
  setFile: (file: File) => void;
  maxFileSize?: number;
  fallbackImage?: string | StaticImageData;
  imageClassName?: string;
  placeholderText?: string;
};

export default function ImagePicker({
  className,
  file,
  setFile,
  maxFileSize = 50,
  fallbackImage,
  imageClassName,
  placeholderText = "Click to select",
}: ImagePickerProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const previewURL = file ? URL.createObjectURL(file) : "";

  useEffect(() => {
    return () => {
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [previewURL]);

  return (
    <label
      className={cn(
        "block aspect-square border-2 transition border-black border-dashed rounded cursor-pointer hover:border-blue-500 overflow-hidden relative",
        (file || fallbackImage) && "border-transparent",
        className
      )}
    >
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setFile?.(file);
            setErrorMessage(
              file.size > maxFileSize * 1024 * 1024
                ? `Must be smaller or equal to ${maxFileSize}MB!`
                : null
            );
          }
        }}
      />

      {previewURL || fallbackImage ? (
        <Image
          src={previewURL ? previewURL : fallbackImage || ""}
          alt="Preview"
          className={cn("object-cover w-full h-full", imageClassName)}
          fill
        />
      ) : (
        <span className="flex items-center p-1 text-center justify-center h-full text-gray-500">
          {placeholderText}
        </span>
      )}

      {errorMessage && (
        <p
          className={cn(
            "absolute bottom-0 w-full text-center p-2 bg-white text-sm text-red-400"
          )}
        >
          {errorMessage}
        </p>
      )}
    </label>
  );
}
