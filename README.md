# Sistem Manajemen Armada

**Penulis:** Doni Prima Yukri

Aplikasi frontend *read-only* untuk memantau posisi kendaraan secara langsung. Seluruh data diambil dari [MBTA v3 Vehicle API](https://api-v3.mbta.com/docs/swagger/index.html#/Vehicle/ApiWeb_VehicleController_index) dan disajikan dalam antarmuka berbahasa Indonesia.

> **Catatan:** Data yang tampil di sini bukanlah armada TransJakarta asli, melainkan transportasi publik di Boston (MBTA). Namun, palet warna dan tipografinya sengaja mengadaptasi gaya desain dari [transjakarta.co.id](https://transjakarta.co.id/).

## Cara Menjalankan

Pastikan sudah menginstal **Node.js 22**. Proyek ini bisa langsung dijalankan tanpa memerlukan API *key*.

```bash
npm install
npm run dev
```

Setelah server menyala, buka URL yang ditampilkan oleh Vite (biasanya di `http://localhost:5173`).

| Perintah | Fungsi |
| :--- | :--- |
| `npm test` | Menjalankan *unit test* untuk aturan *query*, perhitungan total data, dan pembersihan filter *trip* |
| `npm run lint` | Mengecek kualitas kode dengan ESLint |
| `npm run build` | Menjalankan *type-check*, lalu membungkus aplikasi untuk produksi |
| `npm run preview` | Menjalankan hasil *build* produksi secara lokal |

**Catatan instalasi & *tooling*:**
Proses `npm install` menggunakan konfigurasi `.npmrc` (`legacy-peer-deps=true`). Untuk pengecekan tipe data, proyek ini memakai TypeScript 6 melalui perintah `tsc6` (paket `typescript` di sini merupakan alias untuk `@typescript/typescript6`).

## Arsitektur & Keputusan Teknis

Aplikasi ini dibangun murni di sisi frontend (tanpa backend tambahan) menggunakan React (*functional components* & *hooks*), Tailwind CSS, dan TypeScript dengan mode `strict`.

### Pengambilan & Pemetaan Data

Urusan *fetching*, *caching*, hingga penanganan status *loading* dan *error* dikelola sepenuhnya oleh **TanStack Query**. 

Supaya komponen UI tetap bersih dan tidak bergantung pada bentuk mentah *response* API, logika pembacaan format JSON:API diisolasi di `src/api/mbta.ts`. Selanjutnya, `src/domain/mapResource.ts` bertugas merangkai data relasi dari properti `included` menjadi objek domain yang siap pakai (`Vehicle`, `Route`, `Trip`, dan `Stop`).

Untuk daftar kendaraan, aplikasi mengirimkan parameter `page[offset]`, `page[limit]`, `filter[route]`, `filter[trip]`, serta `include=route,trip,stop`:
- Memilih beberapa rute sekaligus akan digabung dengan logika **OR**.
- Memilih beberapa *trip* sekaligus akan digabung dengan logika **OR**.
- Jika rute dan *trip* keduanya dipilih, keduanya digabung dengan logika **AND**.

Filter rute dan *trip* dibuat dalam bentuk *dropdown multi-select* dengan *infinite scroll* (memuat 20 opsi per *request* saat digulir ke bawah). Karena *endpoint* `GET /trips` dari MBTA akan mengembalikan *error* `400` jika dipanggil tanpa filter rute, *dropdown trip* sengaja dikunci (*disabled*) sampai pengguna memilih minimal satu rute. Daftar *trip* yang muncul mewakili jadwal pada rute tersebut—jika kebetulan belum ada armada yang jalan di *trip* itu, layar akan menampilkan pesan *"Tidak ada kendaraan untuk filter ini."*

### Tampilan Antarmuka (UI)

Daftar armada ditampilkan dalam bentuk *grid* kartu (otomatis menjadi 2 kolom di layar lebar). Setiap kartu memuat label armada, status perjalanan (dalam bahasa Indonesia beserta kode aslinya), koordinat lintang/bujur, dan waktu pembaruan terakhir.

Saat salah satu kartu diklik, detail lengkapnya akan terbuka lewat elemen `<dialog>` bawaan browser. Di dalamnya terdapat informasi koordinat, waktu pembaruan (mengikuti zona waktu Boston), rute, *trip*, serta peta interaktif. Peta ini menggunakan **MapLibre** dengan *tile style* dari OpenFreeMap Liberty sehingga tidak membutuhkan API *key*. Pergerakan penanda (*marker*) kendaraan dianimasikan mengikuti jalur (*shape*) *trip* dari posisi laporan sebelumnya menuju posisi terbaru.

Daftar utama, kedua *dropdown* filter, dan modal detail masing-masing memiliki indikator *loading* serta tampilan *error* terpisah lengkap dengan tombol *retry*.

### Siasat Paginasi

Paginasi dilakukan di sisi server (*server-side*) memanfaatkan `page[offset]` dan `page[limit]` dengan pilihan ukuran 5, 10 (bawaan), 20, atau 50 baris per halaman. Info halaman ditulis dengan format *"Menampilkan {awal}–{akhir} dari {total} data"*.

Tantangannya, API MBTA tidak menyediakan angka total data secara langsung—properti `links.last` hanya memberikan nilai *offset* untuk halaman paling akhir. Untuk mendapatkan angka total yang akurat, aplikasi melakukan satu *request* tambahan di belakang layar ke halaman terakhir tersebut, lalu menjumlahkan nilai *offset*-nya dengan jumlah data yang ada di halaman terakhir. Hasil perhitungan ini disimpan di *cache* sampai pengguna mengubah filter atau ukuran halaman. Selama angka total masih dihitung, teks total akan menampilkan `…`.

## Struktur Folder & State URL

- `src/api/` — Adapter dan konfigurasi pemanggilan API MBTA.
- `src/domain/` — Definisi tipe data, pemetaan JSON:API, dan logika bisnis murni (tanpa ketergantungan pada React).
- `src/features/fleet/` — Halaman daftar armada, *custom hooks* untuk *query*, dialog detail, dan komponen peta.
- `src/components/` — Komponen UI yang dapat digunakan ulang (*dropdown*, *chip* status, dan kontrol paginasi).

Seluruh *state* navigasi—mulai dari halaman aktif, ukuran halaman, pilihan rute, pilihan *trip*, hingga ID kendaraan yang sedang dibuka—disinkronkan langsung ke *query string* di URL agar mudah dibagikan:

`?page=2&pageSize=20&routes=Red,1&trips=Red~78182069&vehicle=y1912`

Nilai bawaan (`page=1` dan `pageSize=10`) sengaja tidak ditulis ke URL agar tetap ringkas. Data *trip* disimpan dengan format `routeId~tripId` supaya ketika sebuah rute dihapus dari filter, seluruh *trip* yang terkait dengan rute tersebut bisa otomatis ikut dibersihkan.
