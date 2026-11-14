#!/bin/sh
set -e

# Pastikan direktori storage, database, dan cache tersedia
mkdir -p storage/framework/cache/data \
         storage/framework/sessions \
         storage/framework/views \
         storage/logs \
         bootstrap/cache \
         database

# Buat database SQLite jika belum ada
if [ ! -f database/database.sqlite ]; then
    touch database/database.sqlite
fi

# Set izin folder agar aplikasi dapat menulis database dan sesi
chmod -R 777 storage bootstrap/cache database

# Hubungkan symbolic link storage untuk upload foto produk
php artisan storage:link --force || true

# Jalankan migrasi dan seeder
php artisan migrate --force --seed || true

# Cache konfigurasi untuk performa optimal
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

# Tentukan port dari environment variable Render (default 8080)
PORT="${PORT:-8080}"
echo "Snack Dua Putra siap dan berjalan pada port $PORT..."

exec php artisan serve --host=0.0.0.0 --port="$PORT"
