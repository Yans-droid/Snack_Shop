# Snack Dua Putra — Web E-Commerce & Point of Sale (POS) UMKM

Aplikasi web modern berbasis **Laravel 12** yang dirancang khusus untuk operasional bisnis UMKM makanan ringan/keripik khas Nusantara. Sistem ini mengintegrasikan **Toko Online (Storefront)** untuk pembeli dengan **Portal Pengelola Toko & Kasir Fisik (Point of Sale)** dalam satu platform terpadu.

---

## 📌 Daftar Isi
- [Tentang Proyek](#-tentang-proyek)
- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Struktur Direktori & Database](#-struktur-direktori--database)
- [Prasyarat Sistem](#-prasyarat-sistem)
- [Panduan Instalasi & Menjalankan](#-panduan-instalasi--menjalankan)
- [Panduan Deploy ke Render.com](#-panduan-deploy-ke-rendercom)
- [Akun Pengelola Default](#-akun-pengelola-default)
- [Integrasi Payment Gateway (Midtrans)](#-integrasi-payment-gateway-midtrans)
- [Pengujian (Testing)](#-pengujian-testing)
- [Lisensi](#-lisensi)

---

## 📖 Tentang Proyek

**Snack Dua Putra** (sebelumnya dikembangkan dengan basis *KriukKita*) menghadirkan solusi digitalisasi terpadu bagi pelaku usaha mikro, kecil, dan menengah (UMKM) produsen keripik. Aplikasi ini memecahkan masalah pencatatan manual penjualan toko fisik sekaligus memperluas jangkauan pemasaran melalui toko online responsif yang mendukung pembayaran otomatis (QRIS, Virtual Account) dan struk digital.

### Nilai Utama:
- **Single Source of Truth**: Stok gudang untuk penjualan kasir toko dan pesanan online selalu sinkron secara *real-time*.
- **Pessimistic Locking**: Menggunakan transaksi database dengan penguncian baris (`lockForUpdate`) untuk mencegah *race condition* atau *overselling* saat stok menipis.
- **Autoritatif Server-Side**: Seluruh kalkulasi harga, potongan kombo, promo kupon, dan ongkos kirim dihitung langsung di backend (anti-manipulasi harga dari client).
- **Dual Visual Produk**: Mendukung unggah foto produk asli maupun kemasan vektor SVG dinamis dengan palet warna yang bisa dikustomisasi dari admin panel.

---

## ✨ Fitur Utama

### 🛒 1. Toko Online Pembeli (Storefront Publik)
* **Katalog Interaktif**: Filter rasa (Gurih, Pedas, Manis), detail kerenyahan (1–5) dan level pedas (0–5), serta komposisi bahan.
* **Multi-Pilihan Ukuran**: Pilihan gramatur per produk (100g, 250g, 500g) dengan kalkulasi rasio harga otomatis.
* **Paket Kombo 3 Rasa**: Pembeli bebas meracik paket kombo 3 varian ukuran 100g dengan potongan otomatis Rp6.000.
* **Keranjang Belanja Real-Time**: Estimasi ongkos kirim otomatis (Reguler & Express), gratis ongkir otomatis untuk pesanan minimal Rp50.000.
* **Sistem Voucher Promo**: Validasi kode kupon (potongan tetap atau persentase dengan plafon maksimal dan minimal belanja).
* **Checkout & Midtrans Snap**: Pembayaran mudah via QRIS (GoPay, ShopeePay, Dana, dll.) dan Transfer Bank (Virtual Account).
* **Lacak Pesanan Mandiri**: Pembeli dapat memantau status pesanan (`Menunggu Pembayaran`, `Sedang Dikemas`, `Dikirim`, `Selesai`) dengan kode unik transaksi.
* **Struk Digital Publik**: Struk pesanan yang dapat diakses pembeli melalui link unik dan dicetak langsung.

### 💼 2. Panel Penjual & Kasir (Admin POS)
* **Dashboard Ringkasan Bisnis**: Statistik omzet harian, transaksi sukses, perkiraan laba kotor harian (omzet dikurangi HPP produk), peringatan stok menipis (*low stock alert*), dan riwayat pesanan terbaru.
* **Kasir Toko Fisik (Point of Sale)**:
  * Antarmuka cepat berbasis ketukan kartu produk dan pilihan gramatur.
  * Input nominal uang tunai yang diterima pembeli.
  * Kalkulasi otomatis uang kembalian.
  * Cetak struk kasir seketika.
  * Pengurangan stok otomatis tanpa melalui gateway pembayaran pihak ketiga.
* **Manajemen Produk & Stok**:
  * Tambah, ubah, dan nonaktifkan produk (soft delete agar riwayat transaksi tidak rusak).
  * Pengaturan harga jual, harga modal beli/HPP (untuk kalkulasi laba), stok, dan ambang batas peringatan stok tipis.
  * Pengunggahan foto produk asli (JPG, PNG, WebP) atau pengaturan warna kemasan SVG (background, pouch, label).
* **Manajemen Pesanan Online**:
  * Daftar pesanan masuk dari toko online.
  * Sinkronisasi otomatis status pembayaran lunas melalui Webhook Midtrans.
  * Perubahan status proses (`Sedang Dikemas` ➔ `Dikirim` ➔ `Selesai`).
* **Manajemen Kode Promo**:
  * Pembuatan kupon diskon (nominal Rp atau persentase %).
  * Aturan syarat minimal belanja, batas maksimal diskon, tanggal mulai dan tanggal kedaluwarsa.
* **Laporan Penjualan & Laba Harian**:
  * Filter laporan per tanggal.
  * Rincian omzet, HPP, dan perkiraan laba bersih harian (tanpa menghitung ongkir sebagai laba).
  * Tombol cetak laporan siap cetak/PDF (`window.print()`).
* **Riwayat Penjualan Lengkap**: Filter riwayat berdasarkan rentang tanggal dan kanal transaksi (Kasir Tunai vs Online).
* **Pengaturan Toko (Mini CMS)**: Kustomisasi teks pita (*ribbon*) pengumuman atas, judul & cerita "Tentang Kami", serta konfigurasi tarif ongkir.

---

## 🛠 Teknologi yang Digunakan

| Komponen | Teknologi | Deskripsi |
|---|---|---|
| **Backend Framework** | Laravel 12.x | Routing, Controller, Eloquent / Query Builder, Migrations, Seeders |
| **Bahasa Pemrograman** | PHP 8.2+ (Teruji di PHP 8.4) | Menjalankan logika bisnis dan transactional backend |
| **Database** | SQLite (Default) | Penyimpanan lokal tanpa konfigurasi server DB rumit (dapat dialihkan ke MySQL / PostgreSQL) |
| **Frontend Styling** | Tailwind CSS v4 & Custom CSS | Desain responsif, modern, dan ringan |
| **Asset Bundler** | Vite 7.x | Kompilasi cepat CSS & JS |
| **Payment Gateway** | Midtrans Snap PHP SDK | Gateway pembayaran QRIS & Transfer Bank |
| **Autentikasi** | Laravel Session Auth | Guard sesi khusus admin dengan proteksi middleware `EnsureAdmin` |

---

## 📂 Struktur Direktori Utama

```
Snack-Dua-Putra/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AdminController.php    # Logika panel penjual, POS, produk, laporan, promo
│   │   │   ├── StoreController.php    # Logika toko online, katalog, checkout, promo validasi
│   │   │   ├── PaymentController.php  # Integrasi Midtrans token & webhook listener
│   │   │   └── ReceiptController.php  # Tampilan struk digital
│   │   └── Middleware/
│   │       └── EnsureAdmin.php        # Proteksi rute admin
│   ├── Models/                        # User, Product, Order, OrderItem, Promotion
│   └── Services/
│       └── KriukCommerce.php          # Service kalkulasi harga, diskon, kombo, transaksi stok
├── config/
│   ├── kriuk.php                      # Konfigurasi kredensial admin & Midtrans
│   └── ...
├── database/
│   ├── migrations/                    # Skema tabel users, products, orders, promotions, dll.
│   └── seeders/                       # Data awal produk, pengaturan toko, promo, admin
├── public/
│   ├── assets/                        # Script JS toko & kasir, styles, gambar logo
│   └── storage/                       # Symlink ke storage/app/public untuk foto produk
├── resources/
│   ├── css/ & js/                     # Source aset Vite
│   └── views/
│       ├── admin/                     # Tampilan dashboard, kasir, produk, laporan, login
│       ├── store.blade.php            # Halaman utama katalog toko online
│       ├── product.blade.php          # Halaman detail produk
│       ├── checkout.blade.php         # Halaman checkout & pembayaran
│       ├── order.blade.php            # Halaman pelacakan pesanan
│       └── receipt.blade.php          # Halaman cetak struk transaksi
└── routes/
    └── web.php                        # Seluruh rute publik dan admin
```

---

## 📋 Prasyarat Sistem

Sebelum menjalankan aplikasi, pastikan perangkat Anda telah terpasang:
- **PHP** versi 8.2 atau lebih baru (dengan ekstensi `pdo_sqlite`, `curl`, `mbstring`, `fileinfo`).
- **Composer** (Package manager PHP).
- **Node.js** (versi 18+) & **npm**.
- **Git** (opsional, untuk clone repository).

---

## 🚀 Panduan Instalasi & Menjalankan

Ikuti langkah-langkah mudah berikut untuk menjalankan proyek dari awal:

### 1. Masuk ke Direktori Proyek
```bash
cd Snack-Dua-Putra
```

### 2. Salin Konfigurasi Environment
```bash
cp .env.example .env
```

### 3. Pasang Dependensi PHP (Composer)
```bash
composer install
```

### 4. Buat Application Key
```bash
php artisan key:generate
```

### 5. Siapkan Database & Isi Data Awal (Seeding)
Secara default, aplikasi menggunakan database **SQLite**. Buat berkas database dan jalankan migrasi beserta data awal:
```bash
touch database/database.sqlite
php artisan migrate --seed
```

### 6. Hubungkan Folder Penyimpanan Publik (Upload Foto)
```bash
php artisan storage:link
```

### 7. Pasang Dependensi Node & Bangun Aset Frontend
```bash
npm install
npm run build
```
*(Catatan: Jika Anda sedang mengubah styling atau JS secara langsung dan ingin live reload, jalankan `npm run dev`)*.

### 8. Jalankan Server Pengembangan
```bash
php artisan serve
```
Aplikasi kini dapat diakses melalui peramban web di:
👉 **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

---

## ☁️ Panduan Deploy ke Render.com

Proyek ini telah dilengkapi dengan berkas konfigurasi `Dockerfile`, `docker-entrypoint.sh`, dan `render.yaml` untuk kemudahan deploy gratis ke **[Render.com](https://render.com/)**:

### Cara Deploy Otomatis (Blueprint):
1. Masuk / Daftar akun di **[Render.com](https://render.com/)** (bisa login menggunakan akun GitHub).
2. Di dashboard Render, klik tombol **New +** lalu pilih **Blueprint**.
3. Hubungkan repositori GitHub Anda: `Yans-droid/Snack_Shop`.
4. Render akan otomatis membaca file `render.yaml` dan menyiapkan konfigurasi Docker, PHP 8.4, SQLite, serta aset Vite.
5. Klik **Apply**. Render akan membangun aplikasi dan memberikan URL publik gratis (contoh: `https://snack-dua-putra.onrender.com`).

### Cara Deploy Manual (Web Service):
1. Klik **New +** ➔ **Web Service** ➔ pilih repositori `Yans-droid/Snack_Shop`.
2. Pilih Runtime: **Docker**.
3. Region: **Singapore** (untuk akses cepat di Indonesia).
4. Instance Type: **Free**.
5. Di bagian **Environment Variables**, tambahkan:
   - `APP_KEY`: *(isi dengan kunci enkripsi Laravel atau klik generate)*
   - `APP_ENV`: `production`
   - `APP_DEBUG`: `false`
   - `DB_CONNECTION`: `sqlite`
   - `SESSION_DRIVER`: `cookie`
6. Klik **Deploy Web Service**. Selesai!

---

## 🔐 Akun Pengelola Default

Setelah menjalankan seeder database, akun penjual/admin default sudah langsung tersedia:

| Keterangan | Nilai |
|---|---|
| **URL Login Admin** | [http://127.0.0.1:8000/admin/login](http://127.0.0.1:8000/admin/login) |
| **Email** | `admin@kriukkita.com` |
| **Kata Sandi** | `AdminKelompok1` |

> [!TIP]
> Anda dapat mengganti email dan kata sandi di `.env` melalui variabel `ADMIN_EMAIL` dan `ADMIN_PASSWORD`, lalu jalankan `php artisan db:seed`.

---

## 💳 Integrasi Payment Gateway (Midtrans)

Aplikasi telah dilengkapi integrasi pembayaran online otomatis menggunakan **Midtrans Snap**:
1. Dapatkan Server Key & Client Key dari akun [Midtrans Dashboard](https://dashboard.midtrans.com/) (tersedia mode Sandbox untuk uji coba gratis).
2. Tambahkan pada berkas `.env`:
   ```env
   MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxxxxxx
   MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxxxxxx
   MIDTRANS_IS_PRODUCTION=false
   ```
3. Konfigurasikan URL Webhook Notification di dashboard Midtrans:
   `https://domain-anda.com/midtrans/notification`
   *(Untuk uji coba lokal, gunakan ngrok atau Cloudflare Tunnel).*

*Catatan: Pembelian langsung di kasir toko fisik (POS) menggunakan kanal Tunai sehingga tidak memerlukan koneksi Midtrans.*

---

## 🧪 Pengujian (Testing)

Untuk menjalankan rangkaian uji otomatis (*unit & feature tests*):
```bash
php artisan test
```

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan demonstrasi, pembelajaran Bisnis Elektronik, dan pengembangan digitalisasi UMKM lokal di bawah lisensi [MIT License](LICENSE).
