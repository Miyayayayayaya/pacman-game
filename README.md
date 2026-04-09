# Pacman Game (Vite + Express + Prisma)

## Setup

1. Install dependencies

```bash
npm install
cd server && npm install
```

2. Create env files

- Copy `.env.example` to `.env` (optional: root CLI用)
- Copy `server/.env.example` to `server/.env` (required)

3. Set `DATABASE_URL` to Supabase PostgreSQL

```env
DATABASE_URL="postgresql://postgres:<PASSWORD>@db.<PROJECT_REF>.supabase.co:5432/postgres"
```

4. Apply schema

```bash
cd server
npx prisma db push
```

5. Start backend + frontend

```bash
# backend
cd server
npm run dev

# frontend (new terminal)
cd ..
npm run dev
```

## Notes for Prisma 7

- `schema.prisma` の `datasource` には `url` を書かない
- 接続先は `prisma.config.ts` の `datasource.url` で指定
- 実行時接続は `@prisma/adapter-pg` + `pg` を使用
