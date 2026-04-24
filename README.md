# Notulen App

Aplikasi transkripsi rapat real-time yang modern, dibangun dengan Next.js dan AssemblyAI.

## Fitur Utama

- **Transkripsi Real-time**: Menggunakan AssemblyAI untuk mengubah suara menjadi teks secara instan.
- **Manajemen Sesi**: Validasi kode rapat dan ruang (floor) sebelum memulai transkripsi.
- **Persistensi Data**: Menggunakan Redux Toolkit dan Redux Persist untuk menjaga data sesi tetap ada meskipun halaman di-refresh.
- **Antarmuka Modern**: Dibangun dengan FlyonUI (Tailwind CSS component library) untuk tampilan yang bersih dan responsif.
- **Keamanan Sesi**: Fitur untuk keluar dari sesi (Exit Session) dengan penghapusan data lokal yang aman.

## Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [FlyonUI](https://flyonui.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Persistence**: [Redux Persist](https://github.com/rt2zz/redux-persist)
- **AI/Transcription**: [AssemblyAI](https://www.assemblyai.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Struktur Proyek

```text
src/
├── app/                  # Next.js App Router (Pages & API)
│   ├── api/              # API Routes (Check MOM, Token, Submit)
│   ├── transcript-page/  # Halaman Utama Transkripsi
│   └── layout.tsx        # Root Layout & Providers
├── components/           # Komponen UI Reusable
├── context/              # React Context (Legacy/Alternative)
├── hooks/                # Custom React Hooks (AssemblyAI logic)
└── redux/                # Redux Store, Slices, & Persist Config
```

## Memulai Pengembangan

### Prasyarat

- Node.js 18+
- NPM / Yarn / PNPM

### Instalasi

1. Clone repositori ini.
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Konfigurasi variabel lingkungan di file `.env.local`:
   ```env
   ASSEMBLYAI_API_KEY=your_api_key_here
   ```
4. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/check-mom`: Memvalidasi kode meeting.
- `GET /api/get-token`: Mendapatkan token sementara untuk AssemblyAI.
- `POST /api/post-transcript`: Mengirimkan hasil transkrip akhir.

## Lisensi

[MIT](LICENSE)
