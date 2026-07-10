# Buku Kita

Toko buku online dengan tema **Neobrutalist Cobalt**.

## Struktur Proyek

```
Toko buku/
├── index.html              # Login
├── create-akun.html        # Daftar akun
├── forgot-pass.html        # Lupa password
├── dashboard.html          # Beranda (butuh login)
├── Kategori/                # Halaman kategori (butuh login)
├── Detail-buku/              # Halaman detail tiap buku (butuh login)
├── assets/                  # CSS, JS, gambar
└── server/                  # Backend Express + SQLite (autentikasi)
    ├── server.js
    ├── db.js
    └── package.json
```

## Menjalankan Aplikasi (frontend + backend + database)

Autentikasi (daftar & login) sekarang tersimpan di **database SQLite**
melalui backend Node.js/Express, bukan lagi hanya di localStorage browser.

1. Pastikan **Node.js versi 22.5 atau lebih baru** terpasang
   (proyek ini pakai modul bawaan `node:sqlite`, jadi tidak perlu instal driver database tambahan).
2. Buka terminal di folder `server/`:
   ```bash
   cd server
   npm install
   npm start
   ```
3. Server akan jalan di `http://localhost:3000` dan otomatis menyajikan
   seluruh halaman frontend (index.html, dashboard.html, dst) sekaligus API-nya.
4. Buka `http://localhost:3000` di browser — bukan lagi lewat file:// langsung,
   karena login/daftar butuh terhubung ke server.

Database `buku_kita.db` akan otomatis dibuat di folder `server/` saat pertama kali dijalankan.

## API

| Method | Endpoint         | Keterangan                              |
|--------|------------------|------------------------------------------|
| POST   | `/api/register`  | Daftar akun baru                        |
| POST   | `/api/login`     | Login, mengembalikan token JWT           |
| GET    | `/api/me`        | Ambil data user saat ini (butuh token)   |

Token JWT disimpan di `localStorage` browser (key `token`) dan dikirim
lewat header `Authorization: Bearer <token>` untuk mengakses halaman yang butuh login.

## Catatan

- Password disimpan ter-hash (bcrypt), tidak pernah dalam bentuk teks biasa.
- Halaman `dashboard.html`, `Kategori/*`, dan `Detail-buku/*` otomatis
  mengarahkan ke halaman login jika belum ada sesi yang valid.
- Untuk produksi, ganti `JWT_SECRET` di `server/server.js` dengan nilai rahasia sendiri
  (bisa lewat environment variable `JWT_SECRET`).

Made by Fadli Habibi.
