import type { Metadata } from "next";
import ArchiveLanding from "./components/ArchiveLanding";
import { getBrands, getInspiration, getExhibition } from "@/shared/data";

export const metadata: Metadata = {
  title: "MUMZZMUM — A Personal Fashion Archive",
  description:
    "An archive of brands, objects, images and ideas that shape my perspective on fashion.",
};

export default async function Home() {
  const [brands, inspiration, exhibition] = await Promise.all([
    getBrands(),
    getInspiration(),
    getExhibition(),
  ]);

  return (
    <ArchiveLanding
      brands={brands}
      inspiration={inspiration}
      exhibition={exhibition}
    />
  );
}
