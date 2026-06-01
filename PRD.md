# Product Requirements Document (PRD)

## StudentCommerce — Marketplace Pelajar & Mahasiswa

**Version:** 1.0
**Status:** Final
**Author:** Tim Developer
**Last Updated:** Mei 2026

---

## 1. Executive Summary

**StudentCommerce** adalah platform marketplace digital yang dirancang khusus untuk pelajar dan mahasiswa. Platform ini memungkinkan pengguna untuk membeli dan menjual produk baik fisik maupun digital dalam lingkungan yang aman dan terpercaya. Dengan sistem manajemen pengguna berbasis peran (Buyer, Seller, Admin), platform ini mendukung pengalaman berbelanja yang lengkap mulai dari pencarian produk, transaksi, pembayaran, hingga review.

Proyek ini dibangun menggunakan **Next.js 16** (App Router) sebagai framework frontend dan **Tailwind CSS v4** untuk styling, dengan backend **NestJS** yang dihosting di Railway.

---

## 2. Product Vision & Goals

### Vision
Menjadi platform marketplace terpercaya nomor satu di kalangan pelajar dan mahasiswa Indonesia untuk jual-beli produk pendidikan dan kebutuhan sehari-hari.

### Goals
1. Menyediakan platform jual-beli yang aman dan mudah digunakan
2. Mendukung transaksi produk digital (e-book, template, software) dan fisik (buku, alat tulis, perlengkapan)
3. Memberdayakan pelajar/mahasiswa untuk memulai bisnis online
4. Menyediakan sistem reputasi melalui review dan rating
5. Mendukung komunikasi real-time antara pembeli dan penjual

---

## 3. Target Users & Personas

### 3.1 Target Users
| Segmen | Deskripsi |
|--------|-----------|
| Pelajar SMP/SMA | Usia 13-18, mencari perlengkapan sekolah |
| Mahasiswa | Usia 18-25, mencari buku, alat kuliah, template |
| Pelajar Wirausaha | Pelajar/mahasiswa yang ingin menjual produk |
| Admin Platform | Pengelola marketplace dari pihak kampus/sekolah |

### 3.2 User Personas

**Persona 1: Rina — Pembeli (Buyer)**
- Usia: 19 tahun, mahasiswa semester 2
- Kebutuhan: Membeli buku kuliah bekas, template CV, dan perlengkapan kuliah
- Pain Points: Kesulitan mencari penjual terpercaya, harga mahal di toko buku
- Tujuan: Mendapatkan produk berkualitas dengan harga terjangkau

**Persona 2: Andi — Penjual (Seller)**
- Usia: 21 tahun, mahasiswa semester 6
- Kebutuhan: Menjual catatan kuliah digital, e-book, dan produk handmade
- Pain Points: Sulit menemukan platform yang fokus pada pelajar
- Tujuan: Membangun usaha sambil kuliah

**Persona 3: Bu Dewi — Admin**
- Usia: 35 tahun, staf kampus
- Kebutuhan: Memantau aktivitas marketplace, memverifikasi seller dan produk
- Pain Points: Perlu dashboard yang ringkas untuk monitoring
- Tujuan: Menjaga kualitas dan keamanan platform

---

## 4. Role-Based Features

### 4.1 Buyer Features

| Kategori | Fitur | Deskripsi |
|----------|-------|-----------|
| **Autentikasi** | Register/Login | Mendaftar dan masuk dengan email-password atau Google OAuth |
| **Autentikasi** | Logout | Keluar dari sesi |
| **Pencarian** | Search Bar | Mencari produk berdasarkan kata kunci |
| **Pencarian** | Filter & Sort | Filter berdasarkan kategori, harga, rating, dan sorting |
| **Produk** | Detail Produk | Melihat informasi lengkap produk (gambar, harga, deskripsi, stok, tipe) |
| **Produk** | Kategori | Menjelajahi produk berdasarkan kategori |
| **Produk** | Rekomendasi | Melihat produk populer dan rekomendasi di halaman utama |
| **Keranjang** | Tambah ke Keranjang | Menambahkan produk ke keranjang belanja |
| **Keranjang** | Atur Kuantitas | Menambah/mengurangi jumlah produk |
| **Keranjang** | Hapus Item | Menghapus item dari keranjang |
| **Checkout** | Alamat Pengiriman | Memilih alamat pengiriman untuk produk fisik |
| **Checkout** | Pembayaran QRIS | Pembayaran menggunakan QRIS |
| **Checkout** | Konfirmasi Bayar | Tombol "Saya Sudah Bayar" untuk konfirmasi manual |
| **Pesanan** | Daftar Pesanan | Melihat histori pesanan |
| **Pesanan** | Detail Pesanan | Melihat detail pesanan dan status |
| **Pesanan** | Download Digital | Mengunduh produk digital setelah pembayaran |
| **Review** | Beri Rating | Memberikan rating dan komentar untuk produk |
| **Review** | Lihat Review | Melihat review dari pembeli lain |
| **Alamat** | CRUD Alamat | Menambah, mengedit, menghapus alamat pengiriman |
| **Alamat** | Alamat Utama | Menandai alamat default |
| **Notifikasi** | Notifikasi Real-time | Menerima notifikasi via WebSocket |
| **Notifikasi** | Notifikasi Browser | Menerima notifikasi browser saat tab tidak aktif |
| **Profil** | Edit Profil | Mengubah nama dan avatar |
| **Chat** | Real-time Chat | Chat dengan penjual secara real-time via WebSocket |
| **Seller** | Daftar Jadi Seller | Mendaftar menjadi penjual (isi shopName, deskripsi, kategori) |

### 4.2 Seller Features

| Kategori | Fitur | Deskripsi |
|----------|-------|-----------|
| **Dashboard** | Statistik Penjualan | Melihat total pendapatan hari/minggu/bulan/seluruh |
| **Dashboard** | Chart Penjualan | Line chart tren 7 hari, Bar chart 12 bulan |
| **Dashboard** | Auto-refresh | Dashboard refresh otomatis setiap 30 detik |
| **Produk** | Tambah Produk | Menambahkan produk baru (fisik/digital) |
| **Produk** | Edit Produk | Mengubah data produk |
| **Produk** | Hapus Produk | Menghapus produk |
| **Produk** | Tipe Produk | Memilih tipe produk: Fisik (dengan berat) atau Digital (upload file) |
| **Produk** | Upload File Digital | Mengupload file untuk produk digital |
| **Pesanan** | Daftar Pesanan | Melihat pesanan masuk |
| **Pesanan** | Konfirmasi Pesanan | Menerima/menolak pesanan |
| **Pesanan** | Update Status | Memperbarui status pesanan (diproses, dikirim, selesai) |
| **Navigasi** | Sidebar Seller | Navigasi khusus seller (dashboard, produk, pesanan) |

### 4.3 Admin Features

| Kategori | Fitur | Deskripsi |
|----------|-------|-----------|
| **Dashboard** | Statistik Platform | Melihat total user, produk, kategori |
| **User** | Manajemen User | Melihat daftar semua user |
| **User** | Verifikasi Seller | Memverifikasi akun seller |
| **Produk** | Moderasi Produk | Melihat dan menghapus produk |
| **Review** | Moderasi Review | Mengelola review (dalam pengembangan) |
| **Navigasi** | Sidebar Admin | Navigasi khusus admin |

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Halaman harus dimuat dalam < 3 detik pada koneksi 3G
- Infinite scroll atau pagination untuk daftar produk
- Lazy loading untuk gambar produk
- Skeleton loading untuk semua komponen yang memuat data

### 5.2 Security
- Autentikasi menggunakan JWT token yang disimpan di cookies
- Token dikirim di header Authorization Bearer
- Proteksi route via client-side layout guard (Seller, Admin)
- Validasi form di client-side menggunakan react-hook-form
- Tidak boleh ada log atau penyimpanan credential di client

### 5.3 Usability
- Desain responsif (mobile-first)
- Bottom navigation untuk mobile
- Bahasa Indonesia sebagai bahasa utama
- Semantic colors dan aksesibilitas (focus-visible outline, ARIA labels)
- Toast notification untuk feedback aksi user

### 5.4 Reliability
- Error boundaries untuk menangani crash komponen
- Empty states untuk data kosong
- Error states dengan tombol retry
- Backend error messaging ke user

### 5.5 Compatibility
- Chrome, Firefox, Safari, Edge (versi terbaru)
- Mobile (iOS Safari, Android Chrome)
- Tidak ada dependency pada browser extension

---

## 6. Technical Architecture

### 6.1 Tech Stack

```
┌────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 16)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐ │
│  │ App      │ │ Zustand  │ │ Tailwind │ │ Socket.IO     │ │
│  │ Router   │ │ (Store)  │ │ CSS v4   │ │ Client        │ │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────┘ │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐ │
│  │ react-   │ │ framer-  │ │ chart.js │ │ react-hook-   │ │
│  │ hook-form│ │ motion   │ │          │ │ form          │ │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────┘ │
└────────────────────┬───────────────────────────────────────┘
                     │ HTTP REST + WebSocket
                     ▼
┌────────────────────────────────────────────────────────────┐
│                    BACKEND (NestJS)                         │
│              https://uklsm4-production.up.railway.app       │
└────────────────────────────────────────────────────────────┘
```

### 6.2 Code Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Auth pages (login, register)
│   ├── (buyer)/                  # Buyer pages
│   ├── (seller)/                 # Seller pages
│   ├── (admin)/                  # Admin pages
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles + Tailwind theme
├── components/
│   ├── auth/                     # Authentication components
│   ├── card/                     # Card components (product, order, review)
│   ├── filter/                   # Filter components
│   ├── layout/                   # Layout components (footer, sidebar)
│   ├── navbar/                   # Navigation components
│   ├── search/                   # Search components
│   ├── section/                  # Section components (hero, category, grid)
│   └── ui/                       # Reusable UI primitives
├── lib/
│   ├── api/                      # API client modules
│   ├── hooks/                    # Custom React hooks
│   ├── store/                    # Zustand stores
│   └── utils/                    # Utility functions
└── types/                        # TypeScript type definitions
```

### 6.3 State Management Strategy

| State Type | Solution | Contoh |
|------------|----------|--------|
| Global Auth | Zustand persist | user, token, isAuthenticated |
| Global Cart | Zustand persist | cart items |
| Local UI | useState | loading, error, modal open |
| Server State | useState + useEffect | products, orders, reviews |
| Real-time | Socket.IO | notifikasi, chat messages |

### 6.4 Routing Strategy

| Route Group | Prefix | Guard | Layout |
|-------------|--------|-------|--------|
| (auth) | `/login`, `/register` | None | None |
| (buyer) | `/`, `/cart`, `/orders`, dll | None | Navbar + Footer |
| (seller) | `/seller/*` | role === SELLER | Sidebar Seller |
| (admin) | `/admin/*` | role === ADMIN | Sidebar Admin |

---

## 7. User Flows

### 7.1 Registration Flow

```
Start → Register Page → Isi Nama/Email/Password/Pilih Role
    → Submit → POST /auth/register → Sukses → Set Token & User → Redirect ke Home
    → Gagal → Tampilkan Error
```

### 7.2 Google OAuth Flow

```
Click "Masuk dengan Google" → Google Login Popup
    → Sukses → Dapat idToken → POST /auth/google
    → Backend verifikasi → Kembalikan JWT → Set Token & User → Redirect
    → Gagal → Tampilkan Error
```

### 7.3 Buying Flow (Produk Fisik)

```
Browse/Search → Lihat Detail Produk → Tambah ke Keranjang
    → Buka Cart → Atur Kuantitas → Checkout
    → Pilih Alamat (jika belum ada, tambah alamat)
    → Submit Order → Redirect ke Halaman Pembayaran QRIS
    → Scan QRIS → Klik "Saya Sudah Bayar"
    → Tunggu Verifikasi Seller
```

### 7.4 Buying Flow (Produk Digital)

```
Browse/Search → Lihat Detail Produk → Tambah ke Keranjang
    → Checkout (tanpa alamat)
    → Submit Order → Bayar QRIS
    → Setelah Bayar → Download File di Detail Pesanan
```

### 7.5 Seller Flow

```
Profile → Klik "Jadi Penjual" → Isi Shop Name, Deskripsi, Kategori
    → Submit → POST /users/become-seller → Role berubah SELLER
    → Dashboard → Tambah Produk → Upload Gambar & File Digital
    → Kelola Pesanan Masuk → Terima/Tolak → Update Status
```

### 7.6 Admin Flow

```
Login sebagai admin → Dashboard Admin → Lihat Statistik
    → Users → Verifikasi Seller
    → Products → Hapus Produk Melanggar
    → Sellers → Verifikasi Akun Penjual
```

---

## 8. API Endpoints Summary

### 8.1 Authentication (`/auth`)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/auth/login` | Login email-password |
| POST | `/auth/register` | Register user baru |
| POST | `/auth/google` | Login/Register Google OAuth |
| POST | `/auth/logout` | Logout |

### 8.2 Users (`/users`)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/users/me` | Profile user saat ini |
| GET | `/users` | Daftar semua user (admin) |
| GET | `/users/:id` | Detail user |
| PATCH | `/users` | Update profile sendiri |
| POST | `/users/become-seller` | Mendaftar jadi seller |
| PATCH | `/users/:id/verify` | Verifikasi user (admin) |

### 8.3 Products (`/products`)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/products` | Daftar produk (dengan filter, pagination) |
| GET | `/products/:id` | Detail produk |
| POST | `/products` | Tambah produk (seller) |
| PUT | `/products/:id` | Update produk (seller) |
| DELETE | `/products/:id` | Hapus produk (seller/admin) |

### 8.4 Categories (`/categories`)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/categories` | Daftar kategori |
| GET | `/categories/by-slug/:slug` | Detail kategori by slug |
| POST | `/categories` | Tambah kategori (admin) |
| DELETE | `/categories/:id` | Hapus kategori (admin) |

### 8.5 Cart (`/cart`)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/cart` | Keranjang user |
| POST | `/cart` | Tambah item ke keranjang |
| PATCH | `/cart` | Update kuantitas item |
| DELETE | `/cart/:productId` | Hapus item dari keranjang |
| DELETE | `/cart` | Kosongkan keranjang |

### 8.6 Orders (`/orders`)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/orders` | Daftar pesanan user |
| GET | `/orders/:id` | Detail pesanan |
| POST | `/orders` | Buat pesanan baru |
| PATCH | `/orders/:id/status` | Update status pesanan (seller) |
| PATCH | `/orders/:id/verify` | Verifikasi pembayaran (simulasi) |

### 8.7 Payments (`/payments`)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/payments/:orderId` | Detail pembayaran |
| PATCH | `/payments/:orderId/status` | Update status pembayaran |

### 8.8 Reviews (`/reviews`)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/reviews/product/:productId` | Review untuk suatu produk |
| GET | `/reviews/me` | Review yang dibuat user |
| POST | `/reviews` | Buat review baru |

### 8.9 Addresses (`/addresses`)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/addresses` | Daftar alamat user |
| GET | `/addresses/:id` | Detail alamat |
| POST | `/addresses` | Tambah alamat |
| PATCH | `/addresses/:id` | Update alamat |
| DELETE | `/addresses/:id` | Hapus alamat |

### 8.10 Notifications (`/notifications`)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/notifications` | Daftar notifikasi |
| GET | `/notifications/unread-count` | Jumlah notifikasi belum dibaca |
| POST | `/notifications/:id/read` | Tandai sudah dibaca |
| POST | `/notifications/read-all` | Tandai semua sudah dibaca |

### 8.11 Upload (`/upload`)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/upload/image` | Upload gambar (multipart) |
| POST | `/upload/file` | Upload file digital (multipart) |

---

## 9. Database Schema (Conceptual)

### 9.1 Users
| Field | Type | Keterangan |
|-------|------|------------|
| id | UUID | Primary key |
| name | String | Nama pengguna |
| email | String | Email login (unique) |
| password | String | Hash password |
| role | ENUM | BUYER / SELLER / ADMIN |
| avatarUrl | String? | URL avatar |
| isVerified | Boolean? | Status verifikasi seller |
| googleId | String? | ID Google OAuth |
| createdAt | DateTime | Waktu daftar |

### 9.2 Products
| Field | Type | Keterangan |
|-------|------|------------|
| id | UUID | Primary key |
| name | String | Nama produk |
| description | Text | Deskripsi |
| price | Decimal | Harga (Rupiah) |
| stock | Int | Stok |
| imageUrl | String? | URL gambar |
| categoryId | UUID | Foreign key ke kategori |
| sellerId | UUID | Foreign key ke user (penjual) |
| productType | ENUM | PHYSICAL / DIGITAL |
| fileUrl | String? | URL file (digital) |
| fileSize | Int? | Ukuran file (byte) |
| weight | Float? | Berat (gram, fisik) |
| rating | Float? | Rata-rata rating |
| reviewCount | Int? | Jumlah review |
| createdAt | DateTime | Waktu dibuat |

### 9.3 Categories
| Field | Type | Keterangan |
|-------|------|------------|
| id | UUID | Primary key |
| name | String | Nama kategori |
| slug | String | Slug URL (unique) |
| iconUrl | String? | URL ikon |

### 9.4 Orders, Payments, Reviews, Addresses
(Diimplementasikan sesuai field di tipe TypeScript — lihat `src/types/index.tsx`)

---

## 10. UI/UX Design Guidelines

### 10.1 Design Tokens

| Token | Value | Penggunaan |
|-------|-------|------------|
| `bg` | #FAF7F2 | Background utama (warm cream) |
| `surface` | #FFF9F0 | Card/surface color |
| `primary` | #C8956C | Tombol, link, aksen utama (coklat) |
| `primary-dark` | #A67550 | Hover state tombol |
| `accent` | #E8C49A | Aksen sekunder |
| `ink` | #2C1A0E | Teks utama (hampir hitam) |
| `muted` | #7A6652 | Teks sekunder (coklat abu) |
| `border` | #E8DDD0 | Garis pembatas |

### 10.2 Typography
- Font family: System stack (tailwind default)
- Weight: normal (400), semibold (600), bold (700), black (900)
- Ukuran heading: `text-xl` hingga `text-3xl`
- Ukuran body: `text-sm` hingga `text-base`

### 10.3 Spacing & Radius
- Border radius: `rounded-xl` (1rem), `rounded-2xl` (1.25rem), `rounded-3xl` (1.5rem)
- Container max width: `max-w-7xl`
- Grid: 2 kolom (mobile) → 3 kolom (tablet) → 4 kolom (desktop)

### 10.4 Responsive Breakpoints
| Breakpoint | Width | Target |
|------------|-------|--------|
| xs | 480px | Small phones |
| sm | 640px | Phones |
| md | 768px | Tablets |
| lg | 1024px | Small desktop |
| xl | 1280px | Desktop |

### 10.5 Component States
Setiap komponen interaktif harus memiliki state:
- **Default** — tampilan normal
- **Hover** — efek saat kursor di atas
- **Focus** — focus-visible outline untuk keyboard
- **Active/Pressed** — efek saat diklik
- **Loading** — skeleton/spinner saat memuat data
- **Disabled** — opacity reduced untuk aksi tidak tersedia
- **Error** — pesan error merah di bawah input
- **Empty** — ilustrasi + pesan "data tidak ditemukan"

---

## 11. Dependencies & Libraries

| Library | Versi | Fungsi |
|---------|-------|--------|
| next | 16.2.6 | Framework React |
| react | 19.2.4 | UI Library |
| typescript | 5 | Type safety |
| tailwindcss | 4 | Utility-first CSS |
| @react-oauth/google | ^0.13.5 | Google OAuth |
| zustand | ^5.0.14 | State management |
| react-hook-form | ^7.76.1 | Form handling |
| chart.js | ^4.5.1 | Charting |
| react-chartjs-2 | ^5.3.1 | React Chart.js wrapper |
| socket.io-client | ^4.8.3 | WebSocket client |
| framer-motion | ^12.40.0 | Animasi |
| lucide-react | ^1.17.0 | Icons |
| js-cookie | ^3.0.7 | Cookie management |
| swiper | ^12.2.0 | Carousel/slider |
| sonner | ^2.0.7 | Toast notifications |
| clsx | ^2.1.1 | Conditional classes |
| tailwind-merge | ^3.6.0 | Class merging |
| @headlessui/react | ^2.2.10 | Accessible UI primitives |

---

## 12. Real-Time Features (WebSocket)

### 12.1 Socket.IO Events

| Event | Direction | Deskripsi |
|-------|-----------|-----------|
| `new_notification` | Server → Client | Notifikasi baru (pesanan, chat) |
| `send_message` | Client → Server | Kirim pesan chat |
| `receive_message` | Server → Client | Terima pesan chat |
| `connected` | Server → Client | Koneksi berhasil |

### 12.2 Notification Types
- Pesanan baru untuk seller
- Status pesanan berubah untuk buyer
- Pesan chat baru
- Review baru

---

## 13. Future Roadmap

### Phase 2 (Next)
- [ ] Wishlist/Favorit produk
- [ ] Sistem rating penjual (bukan cuma produk)
- [ ] Topup saldo / dompet digital
- [ ] Notifikasi email + WhatsApp
- [ ] Halaman statistik lanjutan seller (produk terlaris, grafik per produk)

### Phase 3 (Future)
- [ ] Integrasi payment gateway sungguhan (Midtrans/Xendit)
- [ ] Sistem voucher diskon
- [ ] Flash sale / promo
- [ ] Mobile app (React Native)
- [ ] Dashboard admin: export laporan PDF/Excel
- [ ] Fitur dispute/resolusi sengketa
- [ ] Multiple bahasa (Indonesia + English)
- [ ] Sistem dropshipper
- [ ] Integrasi expedisi/ongkir (RajaOngkir)
- [ ] PWA (Progressive Web App)

---

## 14. Glossary

| Istilah | Definisi |
|---------|----------|
| Buyer | Pengguna yang membeli produk |
| Seller | Pengguna yang menjual produk |
| Admin | Pengelola platform |
| QRIS | Quick Response Code Indonesian Standard — standar pembayaran QR nasional |
| JWT | JSON Web Token — token autentikasi |
| Socket.IO | Library real-time bidirectional communication |
| Zustand | State management library minimalis untuk React |
| Product Type | Kategori produk: PHYSICAL (fisik) atau DIGITAL (digital/downloadable) |

---

## 15. Appendices

### A. File Referensi

| File | Deskripsi |
|------|-----------|
| `.env.local` | Environment variables (API URL, Google Client ID, Socket URL) |
| `src/app/globals.css` | Tailwind theme + custom animations |
| `src/types/index.tsx` | Semua tipe data TypeScript |
| `src/lib/api/client.tsx` | HTTP client base |
| `src/lib/store/authStore.tsx` | Zustand auth store |
| `src/lib/store/cartStore.tsx` | Zustand cart store |
| `src/lib/hooks/useSocket.tsx` | WebSocket hook |
| `src/components/navbar/Navbar.tsx` | Navigation + role-based links |
| `src/app/(buyer)/layout.tsx` | Buyer layout dengan Navbar/Footer |
| `src/app/(seller)/layout.tsx` | Seller layout dengan guard |
| `src/app/(admin)/layout.tsx` | Admin layout dengan guard |

### B. Error Codes

| Kode | Pesan | Solusi |
|------|-------|--------|
| 401 | Unauthorized | Login ulang, token expired |
| 403 | Forbidden | Tidak punya akses ke resource |
| 404 | Not Found | Endpoint atau resource tidak ada |
| 409 | Conflict | Data sudah ada (email terdaftar) |
| 422 | Validation Error | Input tidak valid |
| 500 | Internal Server Error | Error server, coba lagi |

---

*Document ini disusun berdasarkan analisis kode sumber proyek StudentCommerce versi 0.1.0.*
