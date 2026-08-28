-- Remove AMOMENTO SHOP, add AMOMENTO PLUS.
-- Copy the WHOLE file (Cmd+A) from your editor into Supabase SQL Editor → Run.

delete from public.brands where slug = 'shop-amomento';

insert into public.brands
  (slug, name, country, founded, target, mood, description, what_i_like)
values
($b$amomento-plus$b$, $b$AMOMENTO PLUS$b$, $b$South Korea$b$, $b$2024$b$, $b$20대 · 30대$b$, $b$Minimal · Casual · Luxury$b$,
 $b$AMOMENTO의 기존 미학을 보다 일상적이고 실용적인 방향으로 확장한 라인. 절제된 디자인과 편안한 실루엣을 기반으로 데일리웨어의 활용도를 높이면서도 AMOMENTO 특유의 정제된 분위기를 유지한다. 기본적인 아이템을 중심으로 소재와 컬러, 디테일의 균형을 통해 자연스럽게 오래 입을 수 있는 옷을 제안한다.$b$,
 $b$AMOMENTO보다 조금 더 편하게 접근할 수 있으면서도 브랜드 특유의 미니멀한 색이 유지되는 점이 좋다. 특별히 힘을 준 것처럼 보이지 않는데 핏이나 소재에서 은근히 차이가 느껴지고, 실제 옷장에 넣었을 때 활용도가 높은 브랜드라는 점이 매력적이다.$b$)
on conflict (slug) do nothing;
