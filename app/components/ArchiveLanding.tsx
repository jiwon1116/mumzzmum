import Link from "next/link";
import type { Brand, Inspiration, ExhibitionPiece } from "@/shared/types";

type Figure = { key: string; href: string; label: string; src: string | null };

/** Minimal standing-figure silhouette shown until real cut-out images exist. */
function FigureSilhouette() {
  return (
    <svg viewBox="0 0 40 120" fill="currentColor" aria-hidden>
      <circle cx="20" cy="11" r="8" />
      <path d="M12 22 h16 l4 34 -6 2 -3 -20 v22 l4 40 -7 0 -4 -38 -4 38 -7 0 4 -40 v-22 l-3 20 -6 -2 4 -34 z" />
    </svg>
  );
}

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

  // Weave the three archives into a single row of standing figures.
  const figures: Figure[] = [];
  const max = Math.max(brands.length, exhibition.length, inspiration.length);
  for (let i = 0; i < max && figures.length < 11; i++) {
    const b = brands[i];
    if (b)
      figures.push({
        key: `b-${b.id}`,
        href: `/collection/${b.slug}`,
        label: b.name,
        src: b.image_url,
      });
    const e = exhibition[i];
    if (e && figures.length < 11)
      figures.push({
        key: `e-${e.id}`,
        href: `/exhibition/${e.id}`,
        label: e.title,
        src: e.image_urls?.[0] ?? null,
      });
    const n = inspiration[i];
    if (n && figures.length < 11)
      figures.push({
        key: `i-${n.id}`,
        href: `/inspiration/${n.id}`,
        label: n.title ?? "Inspiration",
        src: n.image_url,
      });
  }

  return (
    <div className="bw">
      {/* Floating hairline boxes */}
      <div className="bw-top">
        <div className="bw-box bw-box--left">
          <Link href="/" className="bw-brand">
            MUMZZMUM
          </Link>
          <div className="bw-box__row">
            <span className="bw-box__group">
              <Link href="/collection" className="bw-lab">
                Collection <b>{String(brands.length).padStart(2, "0")}</b>
              </Link>
              <Link href="/inspiration" className="bw-lab">
                Notes <b>{String(inspiration.length).padStart(2, "0")}</b>
              </Link>
            </span>
            <Link href="/login" className="bw-lab">
              Admin
            </Link>
          </div>
        </div>

        <div className="bw-box bw-box--right">
          <span className="bw-tag">
            Archive <b>01 / 01</b>
          </span>
          <span className="bw-iconbox" aria-hidden>
            <FigureSilhouette />
          </span>
        </div>
      </div>

      {/* Hero wordmark (section word, not "MUMZZMUM" again) */}
      <section className="bw-hero">
        <p className="bw-hero__meta">A Personal Fashion Archive — {year}</p>
        <h1 className="bw-hero__word">Archive</h1>
        <div className="bw-hero__count">
          <span>
            Brands <b>{String(brands.length).padStart(2, "0")}</b>
          </span>
          <span>
            Notes <b>{String(inspiration.length).padStart(2, "0")}</b>
          </span>
          <span>
            Pieces <b>{String(exhibition.length).padStart(2, "0")}</b>
          </span>
        </div>
      </section>

      {/* Standing figures — evenly spaced on bare canvas, no card chrome */}
      <section className="bw-figures">
        {figures.map((f) => (
          <Link key={f.key} href={f.href} className="bw-fig" title={f.label}>
            {f.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="bw-fig__img" src={f.src} alt={f.label} loading="lazy" />
            ) : (
              <span className="bw-fig__ph">
                <FigureSilhouette />
              </span>
            )}
            <span className="bw-fig__cap">{f.label}</span>
          </Link>
        ))}
      </section>

      {/* Bottom meta strip */}
      <div className="bw-strip">
        <span className="bw-strip__count">
          <b>{total}</b> Items · Discover the archive
        </span>
        <span className="bw-strip__more">
          <Link href="/collection">Collection</Link>
          <Link href="/inspiration">Inspiration</Link>
          <Link href="/exhibition">Exhibition</Link>
        </span>
      </div>
    </div>
  );
}
