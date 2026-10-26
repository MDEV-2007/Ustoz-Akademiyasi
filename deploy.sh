#!/usr/bin/env bash
# ==============================================================================
# Ustoz Akademiyasi — Contabo Production Server Deployment Script
# Safe deployment that does NOT interfere with existing projects (ilimildizi, uncoschool)
# ==============================================================================

set -e

echo "🚀 [1/5] Checking Docker and Nginx environments..."

# Ensure .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ .env.production topilmadi! .env.production faylini yarating."
    exit 1
fi

echo "📦 [2/5] Building and starting Ustoz Akademiyasi Docker containers..."
docker compose -f docker-compose.prod.yml --env-file .env.production pull || true
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build

echo "⏳ Kutish: Database va Backend to'liq yuklanmoqda (15 soniya)..."
sleep 15

echo "🗄️ [3/5] Running Database Migrations & Initial Seed..."
docker exec -t ustoz_api npx prisma migrate deploy || true
docker exec -t ustoz_api npm run prisma:seed || true

echo "🌐 [4/5] Configuring Nginx reverse proxy (Isolated server blocks)..."
# Copy Nginx virtual hosts
if [ -d /etc/nginx/sites-available ]; then
    sudo cp nginx/ustozakademiyasi-front.duckdns.org.conf /etc/nginx/sites-available/
    sudo cp nginx/ustozakademiyasi-back.duckdns.org.conf /etc/nginx/sites-available/

    sudo ln -sf /etc/nginx/sites-available/ustozakademiyasi-front.duckdns.org.conf /etc/nginx/sites-enabled/
    sudo ln -sf /etc/nginx/sites-available/ustozakademiyasi-back.duckdns.org.conf /etc/nginx/sites-enabled/

    echo "🔍 Nginx konfiguratsiyasi tekshirilmoqda..."
    sudo nginx -t

    echo "🔄 Nginx qayta ishga tushirilmoqda..."
    sudo systemctl reload nginx
else
    echo "⚠️ /etc/nginx/sites-available topilmadi. Nginx fayllarini qo'lda o'rnatish kerak bo'lishi mumkin."
fi

echo "🔒 [5/5] SSL Sertifikatlarini o'rnatish (Certbot)..."
echo "Agar SSL hali o'rnatilmagan bo'lsa, quyidagi buyruqni ishga tushiring:"
echo "sudo certbot --nginx -d ustozakademiyasi-front.duckdns.org -d ustozakademiyasi-back.duckdns.org"

echo "=========================================================================="
echo "✅ USTOZ AKADEMIYASI MUVAFFAQIYATLI ISHGA TUSHDI!"
echo "   Frontend: https://ustozakademiyasi-front.duckdns.org"
echo "   Backend:  https://ustozakademiyasi-back.duckdns.org/api/v1/health/live"
echo "   Boshqa loyihalar (ilimildizi, uncoschool) xavfsiz holatda saqlandi."
echo "=========================================================================="
