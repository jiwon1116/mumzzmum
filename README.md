# MUMZZMUM — A Personal Fashion Archive

브랜드를 만들기 전에 좋아하는 것을 모으는 개인 패션 아카이브.
Quiet-luxury / editorial 무드의 Next.js + Supabase 사이트.

## 메뉴 구성

- **Collection** (`/collection`) — 브랜드를 하나씩 분석해 저장. `Brand 1 : N Product` 구조로, 브랜드 상세 안에 연결된 제품 그리드 → 제품 상세.
- **Inspiration** (`/inspiration`) — 영감 이미지 + "왜 저장했는지" 노트 (masonry). → 상세.
- **Exhibition** (`/exhibition`) — 내가 디자인한 옷·도식을 전시 (3-column grid). → 상세.

## 실행

```bash
npm run dev      # http://localhost:3000
```

Supabase 없이도 **시드 데이터**로 바로 뜹니다.

## Supabase 연결 (4단계)

1. **환경변수** — `.env.local` 에 아래 두 값을 넣습니다. (`.env.local.example` 참고)
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co   # ⚠️ /rest/v1 붙이지 말 것
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...      # 공개 안전 (RLS 보호)
   ```
2. **스키마** — 대시보드 → SQL Editor 에 `supabase/schema.sql` 전체 붙여넣고 Run.
   (테이블 4개 + `profiles` + `is_admin()` + RLS + `media` 스토리지 버킷 생성)
3. **관리자 계정** — Authentication → Users → Add user (이메일 + 비밀번호).
4. **관리자 승격** — SQL Editor 에서:
   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'YOUR-ADMIN-EMAIL');
   ```

→ `npm run dev` 재시작. 이제 우하단 푸터의 `·` 로 `/login` 에 접속해 로그인하면
관리자 컨트롤(+ Add / Edit / Delete)이 나타납니다.

## 권한 모델 (3중 방어)

읽기는 **누구나**, 쓰기(생성·수정·삭제)는 **관리자만**.

1. **Frontend** — 비관리자에게는 편집 UI가 렌더되지 않음 (`AdminOnly` / `AdminBar`)
2. **Server** — 모든 Server Action(`server/actions.ts`)이 `is_admin()` 검증
3. **Database** — Postgres **RLS** 가 최종 방어선. API를 직접 호출해도 관리자가 아니면 거부

> `sb_secret_...` (secret key)는 이 앱에 **필요 없습니다.** 넣지도, 커밋하지도 마세요.

## 이미지

관리자 폼의 업로더가 Supabase **Storage(`media` 버킷)** 로 직접 업로드하고 public URL을
저장합니다. 업로드/삭제 권한도 RLS 로 관리자만 가능. 이미지가 없으면 타이포 플레이스홀더가
자리를 잡습니다. (`next/image` 최적화 + lazy loading)

## 폴더 구조 (프론트 / 백엔드 / 공용 분리)

```
app/                     FRONTEND — 라우트 · 컴포넌트
  layout.tsx  page.tsx
  collection/  inspiration/  exhibition/  login/
  components/            Nav · Footer · Media · 갤러리 · 브라우저
    admin/               AdminOnly · Modal · ImageUploader · 각 엔티티 Form · DeleteButton
server/                  BACKEND — 서버 전용 (브라우저로 안 감)
  actions.ts             CRUD Server Actions (admin 검증)
  auth.ts                서버 admin 헬퍼
  supabase/server.ts     쿠키 바인딩 서버 클라이언트
shared/                  SHARED — 양쪽에서 사용
  types.ts  config.ts  data.ts  seed.ts
  supabase/client.ts     브라우저 클라이언트
proxy.ts                 세션 갱신 (Next 16: middleware → proxy)
supabase/schema.sql      DB 스키마 + RLS + 스토리지 정책
```

## 배포 (나중에)

Vercel 에 올리고 환경변수 2개(`NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)만 넣으면 배포됩니다.
