# Ustoz Akademiyasi — Production-Ready NestJS API

Ushbu backend Ustoz Akademiyasi arab tili ta’lim markazi uchun loyihalashtirilgan to‘liq ishlab chiqarish darajasidagi (production-ready) RESTful API tizimidir.

---

## 🛠 Texnologiyalar Steki

- **Platforma**: Node.js v20+ / v22+
- **Freymvork**: NestJS 11 + TypeScript (Strict Mode)
- **Ma’lumotlar bazasi**: PostgreSQL 16+
- **ORM**: Prisma ORM 6
- **Autentifikatsiya**: JWT (Access + Rotating Refresh Token), Argon2id
- **Ruxsatlar (RBAC)**: `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `CONTENT_EDITOR`
- **Validatsiya**: `class-validator`, `class-transformer`
- **Hujjatlashtirish**: Swagger / OpenAPI 3.0 (`/api/docs`, `swagger-spec.json`)
- **Xavfsizlik**: Helmet, CORS allowlist, Rate Limiting, Request ID tracing, Sanitized errors
- **Navbat va Xabarnomalar**: BullMQ + Redis, Telegram Bot Integration
- **Testlar**: Jest, Ts-Jest, Supertest

---

## 🏛 Modulli Arxitektura

Ilova alohida funksional modullarga ajratilgan va har bir modul o‘zining `Controller`, `Service`, `DTO` va `Unit Test` lariga ega:

| Modul | Yo‘nalish | Vazifasi va Xususiyatlari |
| :--- | :--- | :--- |
| `AuthModule` | `/api/v1/auth` | Login, token rotatsiyasi, tizimdan chiqish, parolni yangilash (Argon2id) |
| `UsersModule` | `/api/v1/admin/users` | Administratorlar va menejerlarni boshqarish, rollarni belgilash |
| `CoursesModule` | `/api/v1/public/courses`, `/admin/courses` | Kurslar katalogi, filtrlar, o‘quv dasturi, filiallarga biriktirish |
| `CategoriesModule` | `/api/v1/public/course-categories`, `/admin/categories` | Kurs toifalari (Bolalar, Boshlang'ich, Muloqot, CEFR) |
| `BranchesModule` | `/api/v1/public/branches`, `/admin/branches` | 8 ta Toshkent filiali, xaritalar, ish vaqti, mavjud kurslar |
| `TeachersModule` | `/api/v1/public/teachers`, `/admin/teachers` | Ustozlar, kafedralar, ilmiy darajalar, tajriba |
| `SchedulesModule` | `/api/v1/public/schedules`, `/admin/schedules` | Dars jadvallari, kunlar, soatlar (`Asia/Tashkent`) |
| `LeadsModule` | `/api/v1/public/trial-registrations`, `/admin/leads` | Sinov darsi arizalari, takroriy himoya, statuslar tarixi, CSV eksport |
| `ArticlesModule` | `/api/v1/public/articles`, `/admin/articles` | Blog, maqolalar, nashr holatlari, SEO meta |
| `FaqModule` | `/api/v1/public/faqs`, `/admin/faqs` | Tez-tez beriladigan savollar va javoblar |
| `TestimonialsModule` | `/api/v1/public/testimonials`, `/admin/testimonials` | O‘quvchilar fikrlari (faqat rozilik berilganlar) |
| `AchievementsModule` | `/api/v1/public/achievements`, `/admin/achievements` | Yutuqlar va statistika ko‘rsatkichlari |
| `MediaModule` | `/api/v1/admin/media` | Rasmlar va media yuklash, MIME va hajmni tekshirish |
| `SettingsModule` | `/api/v1/public/site-settings`, `/admin/settings` | Akademiya aloqa ma’lumotlari va ijtimoiy tarmoqlar |
| `AnalyticsModule` | `/api/v1/admin/analytics` | Real bazaviy metrikalar, 30 kunlik trend, konversiya darajasi |
| `AuditLogsModule` | `/api/v1/admin/audit-logs` | Barcha ma’muriy o‘zgarishlar tarixi va xavfsizlik auditi |
| `TelegramModule` | `TelegramService` | Sinov darsi arizalarini guruhga tezkor yuborish |
| `HealthModule` | `/api/v1/health` | Liveness (`/live`) va Readiness (`/ready` — DB tekshiruvi bilan) |

---

## 🚀 O‘rnatish va Ishga Tushirish

### 1. Talablar
- Node.js >= 20.x
- PostgreSQL >= 16.x
- Redis >= 7.x (ixtiyoriy, Telegram fon navbati uchun)

### 2. Sozlash (.env)
`backend` papkasida `.env` faylini yarating:
```bash
cp .env.example .env
```
Kerakli qiymatlarni kiriting (ma’lumotlar bazasi havolasi, JWT maxfiy kalitlari).

### 3. Paketlarni o‘rnatish
```bash
cd backend
npm install
```

### 4. Ma’lumotlar bazasi migratsiyasi va Seed
```bash
# Migratsiyalarni qo'llash
npx prisma migrate dev --name init

# Asl va tasdiqlangan ma'lumotlar bilan to'ldirish (Super Admin, 8 ta filial, 4 ta kurs va h.k.)
npx ts-node prisma/seed.ts
```

### 5. Dasturni ishga tushirish
```bash
# Dasturlash rejimi (hot-reload)
npm run start:dev

# Ishlab chiqarish (Production) build va start
npm run build
npm run start:prod
```

API: `http://localhost:4000/api/v1`  
Swagger hujjatlari: `http://localhost:4000/api/docs`

---

## 🧪 Avtomatlashtirilgan Testlar

Tizim uchun birlik (unit) va integratsion testlar yozilgan:
```bash
npm test
```

Testlar quyidagilarni o‘z ichiga oladi:
- Telefon raqamlarini O‘zbekiston formatiga normallashtirish (`+998 XX XXX-XX-XX`)
- Parollarni Argon2id bilan shifrlash va tekshirish
- Login, noto‘g‘ri ma’lumotlarda 401 qaytarish
- Refresh token rotatsiyasi va sessiyalarni bekor qilish
- Sinov darsi arizalarini saqlash va 24 soatlik takroriy arizalardan himoya
- Liveness va Readiness tekshiruvlari

---

## 🐳 Docker orqali ishga tushirish

Barcha tizimni (PostgreSQL, Redis va NestJS API) bir martada ishga tushirish:
```bash
docker compose up -d --build
```
Migratsiyalarni xavfsiz qo‘llash:
```bash
docker compose exec backend npx prisma migrate deploy
```

---

## 🔒 Xavfsizlik Tamoyillari

1. **Parollar**: Faqat eng kuchli Argon2id algoritmi orqali xeshlanadi.
2. **Tokenlar**: Refresh tokenlar bazada xesh shaklida saqlanadi va har safar yangisiga almashtiriladi (token rotation).
3. **RBAC**: Ruxsatlar faqat frontendda emas, NestJS ning `RolesGuard` orqali server darajasida himoyalangan.
4. **Validatsiya**: DTO lardan tashqari ortiqcha maydonlar avtomatik filtrlanadi (`whitelist: true, forbidNonWhitelisted: true`).
5. **Xatolar**: Ichki SQL xatoliklari, server yo‘llari yoki maxfiy ma’lumotlar foydalanuvchiga hech qachon ko‘rsatilmaydi.
