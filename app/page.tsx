import Link from "next/link";
import Media from "./components/Media";
import { getBrands, getInspiration, getExhibition } from "@/shared/data";

export default async function Home() {
  const [brands, inspiration, exhibition] = await Promise.all([
    getBrands(),
    getInspiration(),
    getExhibition(),
  ]);

  return (
    <>
      <section className="hero">
        <p className="eyebrow">A Personal Fashion Archive</p>
        <h1 className="hero__mark">MUMZZMUM</h1>
        <p className="hero__tagline">
          An archive of brands, objects, images and ideas that shape my
          perspective on fashion — the groundwork for a brand of my own.
        </p>

        <div className="hero__enter">
          <Link href="/collection">Collection</Link>
          <Link href="/inspiration">Inspiration</Link>
          <Link href="/exhibition">Exhibition</Link>
        </div>

        <div className="hero__rule" />
      </section>

      <div className="container">
        {/* Collection preview */}
        <section className="home-section">
          <div className="home-section__head">
            <h2 className="home-section__title">Collection</h2>
            <Link href="/collection" className="home-section__more">
              View all — {brands.length}
            </Link>
          </div>
          <div className="grid-collection">
            {brands.slice(0, 4).map((brand) => (
              <Link
                key={brand.id}
                href={`/collection/${brand.slug}`}
                className="brand-card"
              >
                <Media
                  src={brand.image_url}
                  alt={brand.name}
                  label={brand.name}
                  className="brand-card__media"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div className="brand-card__name">{brand.name}</div>
                <div className="brand-card__meta">
                  {brand.mood && <span>{brand.mood.split("·")[0].trim()}</span>}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Inspiration preview */}
        <section className="home-section">
          <div className="home-section__head">
            <h2 className="home-section__title">Inspiration</h2>
            <Link href="/inspiration" className="home-section__more">
              View all — {inspiration.length}
            </Link>
          </div>
          <div className="grid-insta">
            {inspiration.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                href={`/inspiration/${item.id}`}
                className="insta-cell"
              >
                <Media
                  src={item.image_url}
                  alt={item.title ?? item.note}
                  label="Inspiration"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
                <div className="insta-cell__overlay">
                  <span className="insta-cell__title">
                    {item.title ?? "Untitled"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Exhibition preview */}
        <section className="home-section">
          <div className="home-section__head">
            <h2 className="home-section__title">Exhibition</h2>
            <Link href="/exhibition" className="home-section__more">
              View all — {exhibition.length}
            </Link>
          </div>
          <div className="grid-insta">
            {exhibition.slice(0, 3).map((piece) => (
              <Link
                key={piece.id}
                href={`/exhibition/${piece.id}`}
                className="insta-cell"
              >
                <Media
                  src={piece.image_urls?.[0]}
                  alt={piece.title}
                  label={piece.title}
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
                <div className="insta-cell__overlay">
                  <span className="insta-cell__title">{piece.title}</span>
                  <span className="insta-cell__kind">{piece.category}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
