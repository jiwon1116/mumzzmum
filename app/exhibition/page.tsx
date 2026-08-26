import ExhibitionBrowser from "../components/ExhibitionBrowser";
import { AdminBar } from "../components/admin/AdminOnly";
import ExhibitionForm from "../components/admin/ExhibitionForm";
import { getExhibition } from "@/shared/data";

export const metadata = { title: "Exhibition — MUMZZMUM" };

export default async function ExhibitionPage() {
  const pieces = await getExhibition();

  return (
    <div className="container page">
      <header className="page__head">
        <p className="eyebrow">03 — Studio</p>
        <h1 className="page__title">Exhibition</h1>
        <p className="page__desc">
          내가 그린 도식과 디자인한 옷을 전시하는 공간. 아이디어에서 완성
          착장까지.
        </p>
      </header>

      <AdminBar>
        <ExhibitionForm />
      </AdminBar>

      <ExhibitionBrowser pieces={pieces} />
    </div>
  );
}
