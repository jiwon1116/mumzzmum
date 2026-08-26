import CollectionBrowser from "../components/CollectionBrowser";
import { AdminBar } from "../components/admin/AdminOnly";
import BrandForm from "../components/admin/BrandForm";
import { getBrands } from "@/shared/data";

export const metadata = { title: "Collection — MUMZZMUM" };

export default async function CollectionPage() {
  const brands = await getBrands();

  return (
    <div className="container page">
      <header className="page__head">
        <p className="eyebrow">01 — Archive</p>
        <h1 className="page__title">Collection</h1>
        <p className="page__desc">
          브랜드를 하나씩 뜯어보는 아카이브. 무엇이 잘 되는지, 무엇을 가져오고
          무엇을 다르게 할지 기록합니다.
        </p>
      </header>

      <AdminBar>
        <BrandForm />
      </AdminBar>

      <CollectionBrowser brands={brands} />
    </div>
  );
}
