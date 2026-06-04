"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { resolveImageSrc } from "@/lib/images";

type AppImageProps = Omit<ImageProps, "src" | "alt"> & {
  src: string | null | undefined;
  fallback: string;
  alt: string;
};

/** Never passes an empty string to next/image (avoids React 19 console errors). */
export default function AppImage({ src, fallback, alt, onError, ...rest }: AppImageProps) {
  const [current, setCurrent] = useState(() => resolveImageSrc(src, fallback));

  const safeSrc = resolveImageSrc(current, fallback);

  return (
    <Image
      {...rest}
      alt={alt}
      src={safeSrc}
      onError={(event) => {
        if (current !== fallback) setCurrent(fallback);
        onError?.(event);
      }}
    />
  );
}
