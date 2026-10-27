# Sistem Manajemen Armada

Papan posisi kendaraan, hanya baca. Data hidup diambil dari [MBTA v3](https://api-v3.mbta.com) di Boston. Antarmuka berbahasa Indonesia.

Ini bukan armada TransJakarta. Warna, huruf, dan bentuk kartu mengikuti bahasa desain [transjakarta.co.id](https://transjakarta.co.id/). Logo situs itu tidak disalin.

Penulis: Doni Prima Yukri.

## Menjalankan

Perlu Node.js 22.

```bash
npm install
npm run dev
```

Buka alamat yang dicetak Vite, biasanya `http://localhost:5173`.

| Perintah          | Fungsi                                                        |
| ----------------- | ------------------------------------------------------------- |
| `npm test`        | Aturan murni: query kendaraan, jumlah total, pemangkasan trip |
| `npm run lint`    | ESLint                                                        |
| `npm run format`  | Prettier                                                      |
| `npm run build`   | Pemeriksaan tipe, lalu build produksi                         |
| `npm run preview` | Menayangkan hasil build                                       |

Tidak perlu API key.

`npm install` membaca `.npmrc` (`legacy-peer-deps=true`). npm 10.9 di mesin pengembangan gagal menyusun peer opsional Vitest tanpa pengaturan itu.

Pemeriksaan tipe memakai TypeScript 6 lewat perintah `tsc6`. Paket `typescript` di proyek ini adalah alias `@typescript/typescript6`, karena ESLint belum bisa memuat API TypeScript 7.

## Susunan

- `src/api/` satu-satunya kode yang mengenal JSON:API MBTA.
- `src/domain/` menyimpan Vehicle, Route, Trip, Stop, dan aturan yang tidak mengenal React.
- `src/features/fleet/` menyimpan papan, hook TanStack Query, dialog, dan peta.
- `src/components/` menyimpan listbox, chip status, dan paginasi.

Komponen tidak membaca `included`. `src/domain/mapResource.ts` menyambungkan relasi menjadi objek domain.

## Dua jebakan API

Respons daftar tidak berisi `meta.total`. Yang ada `links.first`, `links.last`, dan `links.next`. Jumlah pasti adalah offset halaman terakhir ditambah jumlah baris di halaman itu. Aplikasi meminta halaman terakhir satu kali lagi, lalu menyimpan hasilnya sampai filter atau ukuran halaman berubah. Sebelum permintaan itu selesai, rentang menampilkan `…`.

`GET /trips` tanpa `filter[]` mengembalikan 400. Daftar trip dinonaktifkan sampai sedikitnya satu rute dipilih, lalu diminta dengan `filter[route]`.

Rute yang dipilih digabung dengan OR. Trip yang dipilih digabung dengan OR. Kalau keduanya terisi, keduanya digabung dengan AND.

## URL

Halaman, ukuran halaman, id rute, id trip, dan kendaraan yang sedang dibuka ada di query string.

`?page=2&pageSize=20&routes=Red,1&trips=Red~78182069&vehicle=y1912`

Nilai bawaan tidak ditulis: halaman 1 dan 10 baris. Trip disimpan sebagai `routeId~tripId`. Menghapus sebuah rute ikut menghapus trip yang hanya milik rute itu.

## Peta dan pembaruan

Peta di dialog memakai MapLibre dan gaya OpenFreeMap Liberty (`https://tiles.openfreemap.org/styles/liberty`), tanpa API key. Berkas peta dimuat saat dialog dibuka. Garis pada peta adalah shape trip kendaraan itu. Penanda bergeser di sepanjang garis itu dari laporan posisi sebelumnya ke laporan baru, lalu berhenti di titik itu sampai laporan berikutnya.

Halaman kendaraan yang sedang tampil dimuat ulang setiap 30 detik, termasuk saat menu filter atau dialog terbuka. Kartu tidak diredupkan. Jika pembaruan gagal, kartu terakhir tetap tampil. Kendaraan yang sedang dibuka diminta setiap 10 detik, dan kartunya memakai laporan yang lebih baru. Tulisan "Data dimuat pukul …" memakai jam komputer peninjau dan umur data itu. Waktu pada kartu memakai zona `America/New_York` dan berlabel "waktu Boston".

## Cabang

`main` selalu dalam keadaan yang bisa dijalankan. Commit awal di cabang itu adalah dasar repositori.

Perubahan berikutnya dibuat di cabang singkat, lalu digabung ke `main`:

- `feat/…` untuk perilaku baru
- `fix/…` untuk perbaikan
- `chore/…` untuk alat atau dokumentasi yang tidak mengubah layar

Nama cabang memakai bahasa Inggris dan huruf kecil, misalnya `feat/vehicle-map`. Pekerjaan baru tidak ditumpuk langsung di `main`.

## Yang tidak ikut

Backend, login, mengubah data, Redux, Next.js, Storybook, tes end-to-end, paket komponen, GitHub Actions, dan URL hosting.

Keputusan desain ada di `DECISIONS.md`. Naskah video ada di `docs/skrip-demo.md`.
