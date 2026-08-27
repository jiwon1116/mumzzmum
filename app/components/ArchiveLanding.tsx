import Link from "next/link";
import type { Brand, Inspiration, ExhibitionPiece } from "@/shared/types";
import FloatingGallery, { type FloatItem } from "./FloatingGallery";

export default function ArchiveLanding({
  brands,
  inspiration,
  exhibition,
}: {
  brands: Brand[];
  inspiration: Inspiration[];
  exhibition: ExhibitionPiece[];
}) {
  const year = new Date().getFullYear();
  const total = brands.length + inspiration.length + exhibition.length;

  // The floating wall is built from Inspiration photos the admin has uploaded.
  const floatItems: FloatItem[] = inspiration
    .filter((n) => Boolean(n.image_url))
    .slice(0, 14)
    .map((n) => ({
      id: n.id,
      title: n.title ?? "Inspiration",
      src: n.image_url as string,
    }));

  return (
    <div className="sf">
      {/* Borderless header — wordmark left, sparse links right */}
      <header className="sf-head">
        <Link href="/" className="sf-mono">
          MUMZZMUM
        </Link>
        <nav className="sf-head__nav">
          <Link href="/collection">
            Collection <b>{String(brands.length).padStart(2, "0")}</b>
          </Link>
          <Link href="/inspiration">
            Inspiration <b>{String(inspiration.length).padStart(2, "0")}</b>
          </Link>
          <Link href="/exhibition">
            Exhibition <b>{String(exhibition.length).padStart(2, "0")}</b>
          </Link>
          <Link href="/login">Admin</Link>
        </nav>
      </header>

      {/* Hero — the 230px word with Inspiration photos floating over it.
          Drag to pull a photo around; click one to open its page. */}
      {floatItems.length > 0 ? (
        <FloatingGallery items={floatItems} />
      ) : (
        <section className="sf-hero">
          <p className="sf-hero__meta">
            A personal fashion archive — {year}. 인스퍼레이션에 사진을 추가하면 이
            곳에 떠다닙니다.
          </p>
          <h1 className="sf-hero__word">Archive</h1>
        </section>
      )}

      {/* Sparse colophon strip */}
      <div className="sf-strip">
        <span className="sf-strip__count">
          <b>{total}</b> items · drag a photo, click to open
        </span>
        <span className="sf-strip__more">
          <Link href="/collection">Collection</Link>
          <Link href="/inspiration">Inspiration</Link>
          <Link href="/exhibition">Exhibition</Link>
        </span>
      </div>
    </div>
  );
}
