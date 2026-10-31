#!/usr/bin/env bash
# ==============================================================================
# Arab Tili — Automated SSL Setup Script
# ==============================================================================

set -e

echo "🚀 [1/5] Yangi Nginx konfiguratsiyalarini o'rnatish..."
sudo cp nginx/arabdemo-front.duckdns.org.conf /etc/nginx/sites-available/
sudo cp nginx/arabdemo-backend.duckdns.org.conf /etc/nginx/sites-available/

sudo ln -sf /etc/nginx/sites-available/arabdemo-front.duckdns.org.conf /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/arabdemo-backend.duckdns.org.conf /etc/nginx/sites-enabled/

# Remove any old conflicting configs
sudo rm -f /etc/nginx/sites-enabled/ustozakademiyasi*.conf

echo "📁 [2/5] ACME challenge papkasini tayyorlash..."
sudo mkdir -p /var/www/html/.well-known/acme-challenge
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html

echo "🔍 [3/5] Nginx ni tekshirish va qayta yuklash..."
sudo nginx -t
sudo systemctl reload nginx

echo "🧪 [4/5] Mahalliy tekshiruv faylini sinash..."
echo "ok" | sudo tee /var/www/html/.well-known/acme-challenge/test_ping.txt > /dev/null

echo "🔒 [5/5] Certbot orqali SSL olish va Nginx ga ulash..."
sudo certbot certonly --webroot -w /var/www/html -d arabdemo-front.duckdns.org -d arabdemo-backend.duckdns.org --non-interactive --agree-tos --register-unsafely-without-email || sudo certbot certonly --webroot -w /var/www/html -d arabdemo-front.duckdns.org -d arabdemo-backend.duckdns.org

sudo certbot install --nginx -d arabdemo-front.duckdns.org -d arabdemo-backend.duckdns.org || true

sudo systemctl reload nginx

echo "=========================================================================="
echo "✅ SSL MUVAFFAQIYATLI O'RNATILDI!"
echo "   Frontend: https://arabdemo-front.duckdns.org"
echo "   Backend:  https://arabdemo-backend.duckdns.org/api/v1/health/live"
echo "=========================================================================="
