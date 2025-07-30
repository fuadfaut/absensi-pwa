# Aplikasi Rekap Absensi PWA

Aplikasi Progressive Web App (PWA) untuk rekap absensi karyawan yang dibangun dengan Nuxt.js 3, Vue 3, dan Tailwind CSS.

## 📋 Changelog

Lihat dokumentasi lengkap perubahan dan perbaikan aplikasi di [**📋 Changelog**](./changelog/README.md).

### 🔄 Versi Terbaru
- **v1.3.0** - [Perbaikan Import Settings](./changelog/v1.3.0-import-settings-fix.md)
- **v1.2.0** - [Perbaikan Import Riwayat](./changelog/v1.2.0-import-riwayat-fix.md)
- **v1.1.0** - [Perbaikan Ikon](./changelog/v1.1.0-icon-improvements.md)

## 🚀 Fitur Utama

### ✅ Fitur yang Sudah Diimplementasikan

- **Progressive Web App (PWA)**: Dapat diinstall di perangkat mobile dan desktop
- **Responsive Design**: Optimized untuk berbagai ukuran layar
- **Offline Support**: Bekerja tanpa koneksi internet
- **Data Persistence**: Menggunakan localStorage untuk menyimpan data
- **Modern UI/UX**: Menggunakan pola desain dari Hyper UI dengan Tailwind CSS

### 📱 Halaman dan Fitur

#### 1. Halaman Rekap (/)
- **Aksi Cepat**: Check-in dan Check-out untuk hari ini
- **Input Manual**: Form untuk input absensi dengan tanggal, waktu, dan catatan
- **Validasi**: Check-in wajib diisi, mencegah duplikasi check-in/out

#### 2. Halaman Riwayat (/riwayat)
- **Sub-tab Laporan**:
  - Laporan bulanan dengan statistik (Total Hari, Hadir, Hanya CI, Tidak Absen)
  - Tabel detail dengan status dan durasi kerja
- **Sub-tab Daftar**:
  - Daftar absensi per bulan
  - Fitur edit dan hapus entri absensi
  - Ekspor/impor riwayat dalam format teks

#### 3. Halaman Pengaturan (/settings)
- **Manajemen Profil**: Edit nama dan jabatan
- **Manajemen Data**: Ekspor/impor seluruh data dalam format JSON
- **Reset Aplikasi**: Hapus semua data dengan konfirmasi

### 🎨 Komponen UI

- **Modal Components**: Profile setup, edit absensi, konfirmasi hapus, konfirmasi reset
- **Message Box**: Notifikasi sukses dan error dengan animasi fade
- **Enhanced Buttons**: Gradient buttons dengan hover effects
- **Form Components**: Input fields dengan styling yang konsisten
- **Cards**: Shadow dan hover effects untuk better UX

## 🛠️ Teknologi yang Digunakan

- **Framework**: Nuxt.js 4.0.2
- **Frontend**: Vue 3 dengan Composition API
- **Styling**: Tailwind CSS dengan custom components
- **PWA**: @vite-pwa/nuxt untuk service worker dan manifest
- **Icons**: Heroicons (SVG icons)
- **Data Storage**: localStorage (client-side)

## 📦 Instalasi dan Menjalankan Aplikasi

### Prerequisites
- Node.js (versi 18 atau lebih baru)
- npm atau yarn

### Langkah Instalasi

1. **Clone atau download project**
   ```bash
   cd absensi-pwa
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Jalankan development server**
   ```bash
   npm run dev
   ```

4. **Buka browser**
   - Akses: `http://localhost:3000`
   - Aplikasi akan terbuka dengan setup profil awal

### Build untuk Production

1. **Build aplikasi**
   ```bash
   npm run build
   ```

2. **Preview build**
   ```bash
   npm run preview
   ```

3. **Generate static files (optional)**
   ```bash
   npm run generate
   ```

## 📱 Instalasi sebagai PWA

1. Buka aplikasi di browser (Chrome/Edge/Safari)
2. Klik ikon "Install" di address bar atau menu browser
3. Aplikasi akan terinstall sebagai aplikasi native
4. Dapat diakses dari home screen atau start menu

## 🗂️ Struktur Project

```
absensi-pwa/
├── assets/css/           # CSS files dengan Tailwind
├── components/           # Vue components
│   ├── MessageBox.vue
│   ├── ProfileSetupModal.vue
│   ├── EditAttendanceModal.vue
│   ├── DeleteConfirmModal.vue
│   ├── ResetConfirmModal.vue
│   └── HistoryExportImport.vue
├── composables/          # Vue composables
│   └── useAttendance.js  # Main attendance logic
├── layouts/              # Nuxt layouts
│   └── default.vue       # Default layout dengan navigation
├── pages/                # Nuxt pages (auto-routing)
│   ├── index.vue         # Halaman rekap
│   ├── riwayat.vue       # Halaman riwayat
│   └── settings.vue      # Halaman pengaturan
├── public/               # Static files dan PWA icons
├── nuxt.config.ts        # Nuxt configuration
├── tailwind.config.js    # Tailwind configuration
└── package.json          # Dependencies
```

## 💾 Data Storage

Aplikasi menggunakan localStorage dengan struktur:
```json
{
  "profile": {
    "name": "Nama User",
    "jabatan": "Jabatan User"
  },
  "attendances": [
    {
      "date": "2025-07-29",
      "checkIn": "08:00",
      "checkOut": "17:00",
      "notes": "Catatan",
      "name": "Nama User"
    }
  ]
}
```

## 🔧 Kustomisasi

### Mengubah Tema Warna
Edit file `tailwind.config.js` untuk mengubah color palette.

### Menambah Fitur Baru
1. Tambahkan state di `composables/useAttendance.js`
2. Buat component baru di folder `components/`
3. Update pages sesuai kebutuhan

### Mengubah PWA Settings
Edit konfigurasi PWA di `nuxt.config.ts` bagian `pwa`.

## 🐛 Troubleshooting

### Aplikasi tidak muncul di browser
- Pastikan development server berjalan di port 3000
- Check console browser untuk error

### Data hilang setelah refresh
- Pastikan localStorage tidak diblokir browser
- Check browser developer tools > Application > Local Storage

### PWA tidak bisa diinstall
- Pastikan menggunakan HTTPS (untuk production)
- Check PWA manifest di developer tools

## 📝 Catatan Migrasi

Aplikasi ini adalah hasil migrasi dari single HTML file ke Nuxt.js PWA dengan:
- ✅ Semua fitur original dipertahankan
- ✅ UI/UX ditingkatkan dengan Hyper UI patterns
- ✅ Code structure lebih modular dan maintainable
- ✅ PWA capabilities untuk better user experience
- ✅ Modern development workflow dengan Nuxt.js

## 📈 Development History

| Versi | Tanggal | Highlights |
|-------|---------|------------|
| **v1.3.0** | 30 Jan 2025 | 🔧 Perbaikan import settings, dual import modes |
| **v1.2.0** | 30 Jan 2025 | 📥 Perbaikan import riwayat, format validation |
| **v1.1.0** | 30 Jan 2025 | 🎨 Standardisasi ikon dengan Heroicons |
| **v1.0.0** | 29 Jan 2025 | 🚀 Rilis awal aplikasi PWA |

> **📋 Dokumentasi Lengkap**: Lihat [Changelog](./changelog/README.md) untuk detail teknis setiap perubahan.

## 🔮 Roadmap

- [ ] Cloud sync dan backup
- [ ] Multi-user support
- [ ] Advanced reporting
- [ ] Push notifications
- [ ] Geolocation tracking

> **🗺️ Roadmap Lengkap**: Lihat [Development Roadmap](./changelog/ROADMAP.md) untuk rencana detail pengembangan jangka panjang.

## 🤝 Kontribusi

Untuk berkontribusi pada project ini:
1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Create Pull Request

---

**Dibuat dengan ❤️ menggunakan Nuxt.js, Vue 3, dan Tailwind CSS**
