# Sistem Manajemen Armada

Penulis: Doni Prima Yukri.

Aplikasi frontend hanya-baca untuk memantau posisi armada. Data diambil dari [Vehicle API MBTA v3](https://api-v3.mbta.com/docs/swagger/index.html#/Vehicle/ApiWeb_VehicleController_index). Antarmuka berbahasa Indonesia.

Ini bukan armada TransJakarta. Warna dan huruf mengikuti bahasa desain [transjakarta.co.id](https://transjakarta.co.id/). Logo situs itu tidak disalin.

## Menjalankan

Perlu Node.js 22. Tidak perlu API key.

```bash
npm install
npm run dev
```

Buka alamat yang dicetak Vite, biasanya `http://localhost:5173`.

| Perintah          | Fungsi                                        |
| ----------------- | --------------------------------------------- |
| `npm test`        | Tes aturan query, total, dan pemangkasan trip |
| `npm run lint`    | ESLint                                        |
| `npm run build`   | Pemeriksaan tipe, lalu build produksi         |
| `npm run preview` | Menayangkan hasil build                       |

`npm install` memakai `.npmrc` (`legacy-peer-deps=true`). Pemeriksaan tipe memakai TypeScript 6 lewat perintah `tsc6`. Paket `typescript` di proyek ini adalah alias `@typescript/typescript6`.

## Arsitektur

React, function components, hooks, dan Tailwind. TypeScript dalam mode strict. Tidak ada backend.

### Mengambil data

TanStack Query memegang fetch, cache, loading, dan error. Satu-satunya kode yang mengenal JSON:API ada di `src/api/mbta.ts`. `src/domain/mapResource.ts` menyambungkan `included` menjadi `Vehicle`, `Route`, `Trip`, dan `Stop`. Komponen tidak membaca payload mentah.

Daftar armada meminta `page[offset]`, `page[limit]`, `filter[route]`, `filter[trip]`, dan `include=route,trip,stop`. Beberapa rute digabung dengan OR. Beberapa trip digabung dengan OR. Kalau keduanya terisi, keduanya digabung dengan AND.

Rute dan trip adalah dropdown multi-pilih. Opsinya dimuat 20 per permintaan, lalu bertambah saat digulir. `GET /trips` tanpa filter mengembalikan 400, jadi menu trip mati sampai sedikitnya satu rute dipilih. Daftar trip adalah jadwal rute itu, bukan hanya trip yang sedang ada armadanya. Trip tanpa armada menampilkan "Tidak ada armada untuk filter ini."

### UI

Armada tampil sebagai grid kartu: label, status (label Indonesia dan kode mentah), lintang dan bujur, serta waktu update terakhir. Di layar lebar kartunya dua kolom.

Detail dibuka di dialog bawaan browser. Isinya label, status, koordinat, waktu update dalam waktu Boston, rute, trip, dan field tambahan. Peta memakai MapLibre dan gaya OpenFreeMap Liberty, tanpa API key. Penanda mengikuti shape trip dari laporan sebelumnya ke laporan baru, lalu berhenti.

Papan, kedua menu, dan dialog masing-masing punya indikator loading dan pesan error yang bisa dicoba lagi.

### Paginasi

Halaman diatur di server lewat `page[offset]` dan `page[limit]`. Ukuran halaman 5, 10, 20, atau 50. Bawaannya 10. Rentang yang tampil berbunyi "Menampilkan {awal}–{akhir} dari {total} data", disertai jumlah halaman dan tombol pindah halaman.

API tidak mengirim jumlah total. `links.last` hanya membawa offset halaman terakhir. Jumlah pasti adalah offset itu ditambah jumlah baris di halaman terakhir, jadi aplikasi mengirim satu permintaan tambahan ke halaman itu. Hasilnya disimpan sampai filter atau ukuran halaman berubah. Sebelum permintaan selesai, rentang menampilkan `…`.

## Susunan folder

- `src/api/` adapter MBTA.
- `src/domain/` tipe, pemetaan JSON:API, dan aturan yang tidak mengenal React.
- `src/features/fleet/` papan, hook query, dialog, dan peta.
- `src/components/` dropdown, chip status, dan paginasi.

Halaman, ukuran halaman, rute, trip, dan armada yang sedang dibuka ada di query string. Contoh: `?page=2&pageSize=20&routes=Red,1&trips=Red~78182069&vehicle=y1912`. Halaman 1 dan 10 baris tidak ditulis. Trip disimpan sebagai `routeId~tripId`. Menghapus sebuah rute ikut menghapus trip yang hanya milik rute itu.
