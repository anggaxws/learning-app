# Study Buddy

Study Buddy helps learners stay consistent with:

- `Daily Goals`
- `Focus Sessions`
- `Streak Tracking`

Core stack:

- `Next.js 16` + `App Router`
- `Tailwind CSS 4`
- `Supabase Auth + Postgres`
- `Next.js Server Actions`

## Features

- Dashboard with weekly focus insights
- Dedicated focus workspace with timer modes
- Daily goals with completion tracking
- Automatic deep work logging when a timer finishes
- Streak and recent milestone summaries
- Google sign-in with Supabase Auth
- Demo mode when Supabase is not configured yet

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

Copy `.env.example` to `.env.local`.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

If these values are missing, the app runs in demo mode.

## Supabase setup

1. Create a Supabase project.
2. Run [supabase/schema.sql](/d:/Coding/learning-app/supabase/schema.sql) in the Supabase `SQL Editor`.
3. In `Authentication > Providers`, enable `Google`.
4. Add your Google OAuth client ID and client secret in Supabase.
5. In `Authentication > URL Configuration`, add `http://localhost:3000/auth/callback` as a redirect URL.
6. Copy the project URL and anon key from `Project Settings > API` into `.env.local`.

After a successful sign-in, the app automatically creates or updates the user profile row.

## Important files

- [src/app/page.tsx](/d:/Coding/learning-app/src/app/page.tsx): dashboard overview
- [src/app/focus/page.tsx](/d:/Coding/learning-app/src/app/focus/page.tsx): focus workspace
- [src/app/actions.ts](/d:/Coding/learning-app/src/app/actions.ts): server actions
- [src/app/auth/callback/route.ts](/d:/Coding/learning-app/src/app/auth/callback/route.ts): OAuth callback
- [src/lib/study-buddy/dashboard.ts](/d:/Coding/learning-app/src/lib/study-buddy/dashboard.ts): dashboard aggregation
- [src/lib/supabase/server.ts](/d:/Coding/learning-app/src/lib/supabase/server.ts): Supabase server client
- [src/middleware.ts](/d:/Coding/learning-app/src/middleware.ts): auth session refresh

## Notes

- This app now uses authenticated user sessions instead of a fixed user ID.
- Row Level Security is enabled so each user only accesses their own data.
