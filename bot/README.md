# 🌟 Ustoz Akademiyasi — Rasmiy Telegram Bot

Ustoz Akademiyasi arab tili ta’lim markazi uchun to‘liq ishlab chiqarish (production) darajasidagi rasmiy Telegram boti.

Bot mavjud NestJS backend REST API bilan integratsiya qilingan bo‘lib, mavjud PostgreSQL ma’lumotlar bazasi, kurslar, filiallar, arizalar (lead) va ma’muriy tizim bilan yagona ekotizimda ishlaydi.

---

## 🚀 Asosiy Imkoniyatlar

1. **🎓 Kurslarni ko‘rish va kashf qilish:**
   - Backenddagi barcha faol va chop etilgan kurslarni sahifalash (pagination) bilan ko‘rish.
   - Har bir kursning darajasi, kimlar uchunligi, davomiyligi, oylik to‘lovi, natijalari va mavjud filiallarini batafsil bilish.
   - Kurs sahifasidan to‘g‘ridan-to‘g‘ri sinov darsiga yozilish.

2. **📍 Filiallar va manzillar:**
   - Toshkent shahridagi 8 ta rasmiy filial manzillari, mo‘ljallari, ish vaqti va telefon raqamlari.
   - Tasdiqlangan GPS koordinatalari orqali **Telegram lokatsiyasi**ni yuborish va **Google Maps**da ochish.
   - Tanlangan filial uchun sinov darsiga yozilish.

3. **📝 Bepul sinov darsiga ko‘p bosqichli yozilish (Multi-step Trial Registration):**
   - 1-qadam: Kursni tanlash (yoki chuqur havola orqali avtomatik tanlanishi).
   - 2-qadam: Kurs mavjud bo‘lgan filialni tanlash.
   - 3-qadam: O‘quvchining to‘liq ism-familiyasi.
   - 4-qadam: Telefon raqami (`request_contact` tugmasi orqali yoki qo‘lda kiritish).
   - 5-qadam: Qulay dars vaqti (Ertalabki, Kunduzgi, Kechki, Operator bilan kelishuv).
   - 6-qadam: Ma’lumotlar xulosasini tekshirish va tasdiqlash.
   - 7-qadam: NestJS API ga xavfsiz jo‘natish (idempotent kalit, takroriy arizalardan himoya).
   - 8-qadam: Tasdiq kodi (`referenceId` masalan `UA-148067`) va keyingi qadamlar ko‘rsatilishi.
   - Jarayon davomida orqaga qaytish, tahrirlash yoki bekor qilish (`/cancel`) imkoniyati.

4. **📚 Arab tilini o‘rganish bo‘limi:**
   - 28 ta arab harfi, nomlari va tovush xususiyatlari.
   - Maxrajlar va talaffuz a’zolari (halq, lisan, shafatayn, xayshum, javf).
   - Kundalik arabcha iboralar va tarjimalari.
   - Backenddan olinadigan o‘quv maqolalari va lug‘atlar.

5. **❓ Savol-javob (FAQ):**
   - Kategoriyalar bo‘yicha guruhlangan tez-tez beriladigan savollar.
   - Kurs tanlash, bolalar, to‘lovlar, sinov darsi tartibi bo‘yicha aniq ma’lumotlar.

6. **📞 Aloqa va ma’muriyat:**
   - Call-markaz (+998 78 888-08-08), rasmiy veb-sayt, ijtimoiy tarmoqlar.

7. **🛡 Ma’muriy boshqaruv (faqat avtorizatsiyalangan adminlar uchun):**
   - `/admin` va `/leads` buyruqlari.
   - Kelib tushgan arizalarni bot ichida ko‘rish va statusini yangilash (`CONTACTED`, `SCHEDULED`, `CONVERTED`, `CANCELLED`).
   - Xavfsizlik: Foydalanuvchi Telegram ID si `ADMIN_TELEGRAM_IDS` orqali qat’iy tekshiriladi.

8. **🔗 Chuqur havolalar (Deep Linking):**
   - Kurs havolasi: `t.me/ustoz_akademiyasi_bot?start=course_professional-fonetika`
   - Filial havolasi: `t.me/ustoz_akademiyasi_bot?start=branch_archakocha`
   - Marketing kampaniyasi: `t.me/ustoz_akademiyasi_bot?start=src_instagram_bio`

---

## 🏗 Arxitektura va Texnologiyalar

- **Dasturlash tili:** TypeScript
- **Freymvork:** grammY (`grammy`, `@grammyjs/conversations`, `@grammyjs/hydrate`, `@grammyjs/runner`)
- **Backend integratsiyasi:** NestJS REST API (`http://localhost:4000/api/v1`)
- **Validatsiya:** Zod (konfiguratsiya) + O‘zbekiston telefon raqamlari standart regexi
- **Sessiyalar:** Qayta ishga tushishga chidamli (Redis yoki mahalliy xavfsiz fayl storage)
- **Konteynerlashtirish:** Docker & Docker Compose

---

## ⚙️ Muhit O‘zgaruvchilari (Environment Variables)

Fayl: `bot/.env` (`bot/.env.example` dan nusxa oling)

```env
# Telegram Bot Token (@BotFather dan olinadi)
BOT_TOKEN=123456789:AAF_your_telegram_bot_token

# Ishlash rejimi: 'polling' (lokal/oddiy) yoki 'webhook' (production)
BOT_MODE=polling

# Webhook sozlamalari (agar BOT_MODE=webhook bo‘lsa)
BOT_WEBHOOK_URL=https://bot.ustozakademiyasi.uz/webhook
BOT_WEBHOOK_SECRET=super_secret_webhook_token_xyz_2026
BOT_WEBHOOK_PORT=3001

# NestJS Backend API manzili
BACKEND_API_URL=http://localhost:4000/api/v1

# Admin va M2M uchun xavfsiz xizmat tokeni
BOT_API_TOKEN=ustoz_bot_secure_service_token_2026

# Administrator Telegram ID lari (vergul bilan ajratilgan)
ADMIN_TELEGRAM_IDS=12345678,98765432

# Rasmiy veb-sayt
PUBLIC_WEBSITE_URL=https://ustozakademiyasi.uz

# Loglar darajasi
LOG_LEVEL=info
```

---

## 🤖 BotFather orqali Botni Sozlash

1. Telegramda [@BotFather](https://t.me/BotFather) ga kiring.
2. `/newbot` buyrug‘ini yuboring.
3. Bot nomini kiriting: `Ustoz Akademiyasi | Arab tili`
4. Bot username ni kiriting: masalan `ustoz_akademiyasi_bot`
5. Berilgan `BOT_TOKEN` ni nusxalang va `.env` faylidagi `BOT_TOKEN` ga qo‘ying.
6. Buyruqlar menyusini sozlash uchun `/setcommands` yuboring va quyidagilarni kiriting:
```
start - Botni ishga tushirish va asosiy menyu
help - Yordam va bo‘limlar tavsifi
cancel - Joriy ro‘yxatdan o‘tishni bekor qilish
admin - Ma’muriyat boshqaruvi (faqat adminlar)
leads - Arizalar ro‘yxati (faqat adminlar)
```
7. Administrator ID sini bilish uchun [@userinfobot](https://t.me/userinfobot) ga `/start` yuboring va `Id` raqamingizni `ADMIN_TELEGRAM_IDS` ga kiriting.

---

## 💻 Mahalliy Ishga Tushirish (Local Development)

```bash
cd bot

# Qaramliklarni o‘rnatish
npm install

# Testlarni ishga tushirish
npm test

# Ishlab chiqish rejimida ishga tushirish
npm run start:dev
```

---

## 🐳 Docker orqali Ishga Tushirish

Loyihaning ildiz papkasidan:

```bash
# Barcha xizmatlarni (PostgreSQL, Redis, NestJS API, Telegram Bot) ishga tushirish:
docker-compose up -d --build
```

Yoki alohida botning o‘zini ishga tushirish:

```bash
cd bot
docker build -t ustoz-telegram-bot .
docker run -d --env-file .env --name ustoz_bot ustoz-telegram-bot
```

---

## 🧪 Testlash

Loyiha to‘liq Jest testlari bilan qoplangan:

```bash
npm test
```

Mavjud test to‘plamlari:
- `phone-validator.spec.ts` — O‘zbekiston telefon raqamlari qoidalari va maxfiylik niqoblash.
- `deep-link.spec.ts` — Chuqur havolalar xavfsizligi va tahlili.
- `authorization.spec.ts` — Admin huquqlari va ruxsatsiz urinishlarni to‘xtatish.
- `api-client.spec.ts` — NestJS API bilan integratsiya, so‘rovlarni o‘rash/yechish, xatolar va 409 duplicate tekshiruvi.
- `courses-and-branches.spec.ts` — Kurslar, filiallar xabarlari va klaviaturalar.
- `registration-flow.spec.ts` — Sinov darsiga yozilish qadamlari, tahrirlash va bekor qilish.
