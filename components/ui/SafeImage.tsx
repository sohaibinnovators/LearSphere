"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

export const FALLBACK_COURSE_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=800&fit=crop";

type SafeImageProps = Omit<ImageProps, "src" | "onError"> & {
  src: string;
  fallbackSrc?: string;
};

/** Next/Image wrapper that swaps to a known-good Unsplash fallback on load failure. */
export function SafeImage({
  src,
  fallbackSrc = FALLBACK_COURSE_IMAGE,
  alt,
  ...props
}: SafeImageProps) {
  const [failedFor, setFailedFor] = useState<string | null>(null);
  const currentSrc =
    failedFor === src || !src ? fallbackSrc : src;

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (src && failedFor !== src) setFailedFor(src);
      }}
    />
  );
}
