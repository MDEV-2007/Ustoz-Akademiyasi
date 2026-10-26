# 🚀 Ustoz Akademiyasi — Contabo Server Deployment Guide
**Boshqa loyihalar (`ilimildizi`, `uncoschool`) bilan to‘qnashuvsiz (Zero-Conflict) o‘rnatish qo‘llanmasi.**

---

## 🎯 Domenlar va Portlar xaritasi

| Xizmat | Domen | Docker Ichki Porti | Host (Lokal) Porti | Holati |
|---|---|---|---|---|
| **Frontend (Next.js)** | `https://ustozakademiyasi-front.duckdns.org` | `3000` | `127.0.0.1:3005` | Nginx orqali proksi |
| **Backend (NestJS API)**| `https://ustozakademiyasi-back.duckdns.org` | `4000` | `127.0.0.1:4005` | Nginx orqali proksi |
| **Telegram Bot** | *@UstozAkademiyasiBot* | Polling rejimida | Alohida port talab qilmaydi | Fondagi xizmat |
| **PostgreSQL DB** | `ustoz_postgres` | `5432` | `127.0.0.1:5435` | Host 5432 ga tegmaydi |
| **Redis** | `ustoz_redis` | `6379` | *Faqat Docker tarmog‘ida* | Host 6379 ga tegmaydi |

> [!IMPORTANT]
> **Xavfsizlik kafolati:** 
> Serveringizdagi mavjud `ilimildizi` va `uncoschool` loyihalarining `3000`, `4000`, `5432` va `6379` portlariga mutlaqo tegmaslik uchun barcha xizmatlar ajratilgan portlarga (`3005`, `4005`, `5435`) va alohida `ustoz_network` Docker tarmog‘iga ulandi.

---

## 📋 QADAMMA-QADAM O‘RNATISH

### 1-Qadam: DuckDNS IP sozlamalarini tekshiring
DuckDNS shaxsiy kabinetingizda quyidagi 2 ta subdomenga Contabo serveringizning tashqi IP manzilini kiriting:
1. `ustozakademiyasi-front.duckdns.org`  -> `SIZNING_CONTABO_IP`
2. `ustozakademiyasi-back.duckdns.org`   -> `SIZNING_CONTABO_IP`

---

### 2-Qadam: Loyihani serverga yuklash
Contabo serveringizga SSH orqali kiring va loyihani yuklang (masalan, `/var/www/ustoz-akademiyasi` papkasiga):

```bash
# Serverdagi papkaga o'ting
mkdir -p /var/www/ustoz-akademiyasi
cd /var/www/ustoz-akademiyasi

# Git orqali klonlang yoki fayllarni yuklang
git clone <LOYIHA_GIT_HAVOLASI> .
```

---

### 3-Qadam: Avtomatlashtirilgan sozlash va ishga tushirish
Loyiha papkasida tayyorlab berilgan `deploy.sh` skriptiga ijro huquqini berib, ishga tushiring:

```bash
chmod +x deploy.sh
./deploy.sh
```

**Ushbu skript quyidagilarni avtomatik bajaradi:**
1. `docker-compose.prod.yml` orqali Postgres, Redis, Backend, Bot va Frontend konteynerlarini quradi va ishga tushiradi.
2. Ma'lumotlar bazasiga avtomatik migratsiya qiladi va dastlabki ma'lumotlarni (`seed.ts` — filiallar, ustozlar, kurslar, bosh admin) yuklaydi.
3. `/etc/nginx/sites-available/` papkasiga 2 ta yangi faylni ko‘chiradi va faollashtiradi (boshqa loyihalarning Nginx sozlamalariga ziyon yetkazmaydi).
4. `sudo nginx -t` bilan sintaksisni tekshirib, Nginx ni xavfsiz yangilaydi (`reload`).

---

### 4-Qadam: Bepul SSL sertifikati (HTTPS) olish
Nginx ishga tushgach, Certbot orqali ikkala domen uchun bepul Let's Encrypt SSL sertifikatini oling:

```bash
sudo certbot --nginx -d ustozakademiyasi-front.duckdns.org -d ustozakademiyasi-back.duckdns.org
```

> Certbot avtomatik ravishda HTTPS ni sozlaydi va har 90 kunda avtomatik yangilanishini ta'minlaydi.

---

## 🛠️ FOYDALI BUYRUQLAR (Boshqaruv)

- **Barcha konteynerlar holatini ko‘rish:**
  ```bash
  docker compose -f docker-compose.prod.yml ps
  ```
- **Backend loglarini kuzatish:**
  ```bash
  docker logs -f ustoz_api
  ```
- **Telegram Bot loglarini kuzatish:**
  ```bash
  docker logs -f ustoz_telegram_bot
  ```
- **Frontend loglarini kuzatish:**
  ```bash
  docker logs -f ustoz_frontend
  ```
- **Qayta ishga tushirish:**
  ```bash
  docker compose -f docker-compose.prod.yml restart
  ```
- **To‘xtatish:**
  ```bash
  docker compose -f docker-compose.prod.yml down
  ```

---

## 🔑 BOSH ADMINISTRATOR KABINETI
O‘rnatish tugagach, backend bazasida avtomatik ravishda bosh administrator yaratiladi:
- **Admin panel:** `https://ustozakademiyasi-front.duckdns.org/uz/admin`
- **Login:** `admin@ustozakademiyasi.uz`
- **Parol:** `SecureAdminPassword2026!#`
- **Backend Swagger API Docs:** `https://ustozakademiyasi-back.duckdns.org/api/docs`
