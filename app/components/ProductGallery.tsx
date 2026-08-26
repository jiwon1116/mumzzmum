"use client";

import { useState } from "react";
import Media from "./Media";

export default function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const hasImages = images.length > 0;

  return (
    <div className="gallery">
      <Media
        src={hasImages ? images[active] : null}
        alt={alt}
        label={alt}
        className="gallery__main"
        sizes="(max-width: 860px) 100vw, 50vw"
        priority
      />
      {images.length > 1 && (
        <div className="gallery__thumbs">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              className={`gallery__thumb${active === i ? " is-active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`${alt} — image ${i + 1}`}
            >
              <Media src={src} alt="" sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
