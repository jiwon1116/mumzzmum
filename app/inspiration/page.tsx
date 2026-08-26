import InspirationBrowser from "../components/InspirationBrowser";
import { AdminBar } from "../components/admin/AdminOnly";
import InspirationForm from "../components/admin/InspirationForm";
import { getInspiration } from "@/shared/data";

export const metadata = { title: "Inspiration — MUMZZMUM" };

export default async function InspirationPage() {
  const items = await getInspiration();

  return (
    <div className="container page">
      <header className="page__head">
        <p className="eyebrow">02 — Mood</p>
        <h1 className="page__title">Inspiration</h1>
        <p className="page__desc">
          그냥 저장하지 않는다. 왜 좋은지 한 줄로 남긴다. 쌓이면 내가 어떤
          것을 좋아하는지 패턴이 보인다.
        </p>
      </header>

      <AdminBar>
        <InspirationForm />
      </AdminBar>

      <InspirationBrowser items={items} />
    </div>
  );
}
