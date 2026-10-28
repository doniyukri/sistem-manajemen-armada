# Skrip demo

Naskah untuk video 5–10 menit. Yang merekam adalah penulis. Urutan di bawah mengikuti tiga hal yang diminta brief: cara mengambil data, cara UI dibangun, dan cara paginasi bekerja.

Siapkan `npm run dev` dan editor di samping browser. Mulai dari beranda tanpa query string, dengan menu dan dialog tertutup.

## 1. Cara data diambil

Buka `src/features/fleet/useFleetQueries.ts`, fungsi `useVehiclePage`.

Daftar kendaraan adalah satu `useQuery`. `queryKey` berisi id rute yang sudah diurutkan, id trip, nomor halaman, dan ukuran halaman. Karena kunci itu ikut berubah, baris dari filter lama tidak bisa tampil seolah-olah milik filter baru. `placeholderData: keepPreviousData` menahan kartu yang sudah ada sampai halaman berikutnya datang, jadi papan tidak kosong setiap ganti halaman.

`refetchInterval` daftar adalah 30 detik, dan tetap hidup saat menu atau dialog terbuka. Kartu yang sudah ada tidak diganti oleh layar error kalau permintaan berikutnya gagal. Detail yang sedang terbuka punya permintaan sendiri setiap 10 detik, menyertakan `trip.shape`, dan kartunya memakai laporan yang lebih baru. `retry` di `src/App.tsx` dibatasi satu kali. Fokus jendela tidak memicu unduhan baru; kembali ke tab hanya memuat ulang kalau data sudah lebih tua dari intervalnya.

Buka `src/api/mbta.ts`, fungsi `getVehicles`, lalu `buildVehicleSearchParams` di `src/domain/rules.ts`.

Adapter yang menyusun permintaan. Parameternya `page[offset]`, `page[limit]`, `filter[route]`, `filter[trip]`, dan `include=route,trip,stop`. Header-nya `Accept: application/vnd.api+json`. Tidak ada API key.

Buka `mapVehicle` di `src/domain/mapResource.ts`.

`included` digabung di sini menurut `type` dan `id`. Komponen hanya menerima `Vehicle`, `Route`, `Trip`, dan `Stop`. Satu kendaraan dari `GET /vehicles/{id}` datang sebagai objek, bukan array. `mapOneVehicle` menerima keduanya.

Di browser, tunjuk satu kartu: label, status bahasa Indonesia plus kode mentah (`Dalam perjalanan` / `IN_TRANSIT_TO`, `Berhenti` / `STOPPED_AT`, `Akan tiba` / `INCOMING_AT`), lintang dan bujur, serta "Diperbarui … yang lalu".

## 2. Cara UI dibangun

Buka blok `@theme` di `src/index.css`.

Tailwind v4. Warnanya diambil dari stylesheet TransJakarta: header `#06367c`, bidang `#0846a1`, garis pendek `#174DA1`, panel `#CDE6FD`. PT Sans datang dari paket fontsource, bukan dari server TransJakarta. Layar ini bukan salinan beranda pemasaran, dan file logo mereka tidak ada di repositori.

Buka `src/features/fleet/VehicleDialog.tsx`.

Detail memakai elemen `<dialog>` bawaan. `showModal` mengunci fokus. Escape, tombol Tutup, dan klik di luar panel menutup dialog. Fokus kembali ke kartu yang membukanya. Peta MapLibre dimuat hanya saat dialog ini tampil, dengan gaya OpenFreeMap Liberty, tanpa API key. Garisnya adalah shape trip. Penanda bergeser di garis itu dari posisi laporan terakhir ke posisi laporan baru selama jarak waktu kedua laporan, lalu diam di titik baru sampai laporan berikutnya.

Di browser, klik satu kartu. Tunjuk rute, trip, perhentian, arah, okupansi, garis rute, dan penanda yang bergerak di peta. Tutup dengan Escape.

Buka `onKeyDown` di `src/components/MultiSelect.tsx`.

Listbox ini ditulis sendiri, bukan pustaka headless. Panah atas dan bawah memindahkan sorotan. Enter memilih atau membatalkan baris. Spasi di kotak cari mengetik; Spasi di luar kotak cari memilih baris. Escape menutup menu. Sentinel di bawah daftar meminta 20 opsi berikutnya saat digulir.

Di browser, buka Rute. Gerakkan sorotan dengan panah, pilih dengan Enter, lalu gulir sampai daftar bertambah. Trip tetap bertuliskan "Pilih rute terlebih dahulu" sebelum ada rute. Setelah satu rute dipilih, buka Trip dan pilih satu. Tunjuk URL: trip tersimpan sebagai `routeId~tripId`. Hapus rute itu. Trip yang hanya milik rute itu ikut hilang, dan halaman kembali ke 1.

## 3. Cara paginasi bekerja

Di browser, tunjuk "Menampilkan 1–10 dari {total} data" dan "Halaman 1 dari {jumlah}". Ganti ukuran halaman menjadi 5. URL menulis `pageSize=5`, parameter `page` hilang karena halaman kembali ke 1, dan rentangnya menjadi 1–5.

Buka `exactTotal` di `src/domain/rules.ts`, lalu `useVehicleTotal` di `src/features/fleet/useFleetQueries.ts`.

API tidak mengirim jumlah total. `links.last` hanya membawa offset halaman terakhir. Jumlah pasti adalah offset itu ditambah jumlah baris di halaman terakhir. Karena halaman yang sedang tampil biasanya bukan halaman terakhir, aplikasi mengirim satu permintaan tambahan ke offset tersebut. Hasilnya disimpan sampai filter atau ukuran halaman berubah. Kalau halaman yang sedang tampil sudah halaman terakhir, permintaan tambahan itu tidak dikirim. Selama jumlah belum ada, rentang menampilkan `…`, bukan perkiraan.

Itu sebabnya angka "dari {total}" boleh dipakai sebagai jumlah halaman. Tombol Berikutnya juga memakai `links.next`, jadi halaman berikutnya tetap bisa dibuka sebelum jumlah selesai dihitung.
