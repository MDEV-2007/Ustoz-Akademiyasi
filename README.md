# Ustoz Akademiyasi — Full-Stack Monorepo

Toshkentdagi 8 ta filialga ega «Ustoz Akademiyasi» arab tili o‘quv markazining to‘liq arxitekturasi:

```
Ustoz Akademiyasi/
├── frontend/             # Next.js 16 (App Router, TailwindCSS, Arab tili interaktiv platformasi, Admin panel)
│   ├── app/              # 16 ta marshrut va ko'p tilli (uz, ru, en) sahifalar
│   ├── components/       # Modul layout, UI va sahifa komponentlari
│   ├── features/         # Ro'yxatdan o'tish va telefon validatsiya xizmatlari
│   ├── lib/              # API mijoz, audio sintezator va ma'lumotlar konstantalari
│   └── package.json
│
├── backend/              # NestJS REST API (PostgreSQL + Prisma/TypeORM + Redis)
│   ├── src/              # Kurslar, filiallar, arizalar (CRM) va admin auth
│   └── package.json
│
├── bot/                  # Telegram Bot xizmati (Ariza qabul qilish, bildirishnomalar)
│   ├── src/              # Telegraf / Telegram Bot API
│   └── package.json
│
├── docker-compose.yml    # PostgreSQL, Redis, Backend, Bot va Frontend to'liq docker muhiti
└── package.json          # Monorepo boshqaruv buyruqlari
```

---

## Ishga tushirish (Getting Started)

### 1. Barcha xizmatlarni mahalliy ishga tushirish (Local Dev)

Loyiha ildizidan turib quyidagi buyruqlarni ishlatishingiz mumkin:

```bash
# Frontendni ishga tushirish (http://localhost:3000)
npm run dev
# yoki
npm run dev:frontend

# Backend API ni ishga tushirish (http://localhost:4000)
npm run dev:backend

# Telegram Botni ishga tushirish
npm run dev:bot
```

### 2. Loyihani qurish (Production Build)

```bash
# Frontendni ishlab chiqarishga tayyorlash (Static export / SSR)
npm run build
# yoki
npm run build:frontend

# Backendni qurish
npm run build:backend
```

### 3. Docker orqali barchasini birdaniga ishga tushirish

```bash
docker-compose up -d --build
```
Bu buyruq PostgreSQL (5432), Redis (6379), Backend (4000), Telegram Bot (3001) va Frontend (3000) ni avtomatik ravishda konteynerlarda ishga tushiradi.
