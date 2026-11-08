# Belajar Vibecoding - Express + Drizzle + MySQL (Bun Runtime)

Backend REST API starter kit yang dibangun menggunakan **Bun**, **Express.js**, **Drizzle ORM**, dan **MySQL**.

---

## 🚀 Tech Stack
- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [Express.js](https://expressjs.com/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) & `drizzle-kit`
- **Database**: MySQL (`mysql2` driver)
- **Language**: TypeScript

---

## 📁 Struktur Direktori

```text
├── drizzle/              # File migration SQL hasil generate Drizzle
├── src/
│   ├── db/
│   │   ├── index.ts      # Inisialisasi koneksi pool database Drizzle
│   │   └── schema.ts     # Definisi schema tabel Drizzle
│   ├── routes/
│   │   ├── health.route.ts # Health check endpoint & status DB
│   │   └── item.route.ts   # Contoh implementasi REST CRUD endpoint
│   └── index.ts          # Entry point aplikasi Express
├── .env.example          # Template konfigurasi environment variable
├── drizzle.config.ts     # Konfigurasi Drizzle Kit & migrasi
├── package.json          # Dependency & command scripts
└── tsconfig.json         # Konfigurasi TypeScript
```

---

## 🛠️ Panduan Menjalankan Project

### 1. Prasyarat
- [Bun](https://bun.sh/) (v1.0+)
- MySQL server aktif

### 2. Konfigurasi Environment
Salin file `.env.example` ke `.env` dan sesuaikan kredensial MySQL Anda:
```bash
cp .env.example .env
```

Isi variabel:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=belajar_vibecoding
```

### 3. Migrasi Database (Drizzle)
- **Generate migrasi SQL:**
  ```bash
  bun run db:generate
  ```
- **Push schema langsung ke database (Development):**
  ```bash
  bun run db:push
  ```
- **Buka Drizzle Studio (Database GUI):**
  ```bash
  bun run db:studio
  ```

### 4. Menjalankan Server
- **Mode Development (Hot-Reload):**
  ```bash
  bun run dev
  ```
- **Mode Production:**
  ```bash
  bun run start
  ```
- **Cek Type TypeScript:**
  ```bash
  bun run typecheck
  ```

---

## 📡 API Endpoints

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/health` | Cek status server dan koneksi MySQL |
| `GET` | `/api/items` | Ambil semua data items |
| `GET` | `/api/items/:id` | Ambil data item berdasarkan ID |
| `POST` | `/api/items` | Tambah data item baru |
| `DELETE` | `/api/items/:id` | Hapus item berdasarkan ID |
