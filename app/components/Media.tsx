import Image from "next/image";

type MediaProps = {
  src?: string | null;
  alt: string;
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * Renders an optimized, lazy-loaded image when a src is available, otherwise
 * an elegant typographic placeholder so the grid stays intact before real
 * images are added. The parent .media element provides the aspect ratio.
 */
export default function Media({
  src,
  alt,
  label,
  className,
  sizes = "(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 33vw",
  priority = false,
}: MediaProps) {
  return (
    <div className={`media${className ? " " + className : ""}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="media__img"
        />
      ) : (
        <div className="media__ph" aria-label={alt}>
          {label ?? alt}
        </div>
      )}
    </div>
  );
}
