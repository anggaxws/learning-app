# Study Buddy

Web app untuk membantu user tetap konsisten belajar lewat:

- `Daily Goals`
- `Focus Sessions`
- `Streak Tracking`

Stack utama:

- `Next.js 16` + `App Router`
- `Tailwind CSS 4`
- `Supabase Postgres`
- Backend berbasis `Next.js Server Actions`

## Kenapa backend ini dipilih

Karena app ini fokus pada CRUD ringan dan dashboard personal, `Server Actions` adalah opsi yang efisien:

- front end dan backend tetap satu repo
- cocok untuk insert/update sederhana
- deployment lebih mudah karena tidak perlu API server terpisah
- tetap bisa berkembang ke auth dan RLS Supabase nanti

## Fitur yang sudah ada

- Dashboard belajar dengan visual summary
- Form tambah `Daily Goal`
- Toggle goal selesai / belum selesai
- Form catat `Focus Session`
- Ringkasan `streak` dan progres 7 hari terakhir
- `Demo mode` otomatis jika env Supabase belum diisi

## Menjalankan project

```bash
npm install
npm run dev
```

Lalu buka `http://localhost:3000`.

## Environment variables

Salin `.env.example` menjadi `.env.local`.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STUDY_BUDDY_USER_ID=
```

Catatan:

- `SUPABASE_SERVICE_ROLE_KEY` dipakai di server untuk insert/update tanpa auth flow.
- `NEXT_PUBLIC_STUDY_BUDDY_USER_ID` adalah id profile yang ingin dipakai app ini.
- Jika env belum lengkap, app tetap jalan dengan demo data.

## Schema Supabase

Jalankan SQL di [supabase/schema.sql](/d:/Coding/learning-app/supabase/schema.sql).

Sesudah itu:

1. Buat satu row di tabel `profiles`.
2. Ambil `id` profile tersebut.
3. Isi `NEXT_PUBLIC_STUDY_BUDDY_USER_ID` dengan UUID tadi.

## Struktur penting

- [src/app/page.tsx](/d:/Coding/learning-app/src/app/page.tsx): dashboard utama
- [src/app/actions.ts](/d:/Coding/learning-app/src/app/actions.ts): backend write actions
- [src/lib/study-buddy/dashboard.ts](/d:/Coding/learning-app/src/lib/study-buddy/dashboard.ts): aggregasi data dashboard
- [src/lib/supabase/server.ts](/d:/Coding/learning-app/src/lib/supabase/server.ts): server client Supabase

## Next step yang bagus

- tambah autentikasi Supabase Auth
- aktifkan Row Level Security per user
- buat timer focus session real-time
- tambah analytics mingguan dan monthly review
