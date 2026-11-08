# Belajar Vibecoding - Express + Drizzle + MySQL (Bun Runtime)

Sistem Informasi Kearsipan Dinamis & Persuratan Sekolah (arsip surat masuk/keluar, disposisi berjenjang, dan audit trail log) berbasis **Bun**, **Express.js**, **Drizzle ORM**, dan **MySQL**.

---

## 🚀 Tech Stack
- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: Express.js
- **ORM & Migrations**: Drizzle ORM (`drizzle-kit`)
- **Database**: MySQL (`mysql2` connection pool)
- **Language**: TypeScript

---

## 📁 Struktur Direktori (Modular Feature & Service Architecture)

```text
├── backend/
│   ├── data/                      # Data mentah atau seeder asset
│   ├── migrations/                # Hasil generate migration SQL Drizzle
│   ├── src/
│   │   ├── exceptions/            # Custom application errors (ClientError, InvariantError, dll)
│   │   ├── lib/                   # Database instance (db.ts), Schema (schema.ts), Seeder (seed.ts)
│   │   ├── middleware/            # Error handling & middleware global
│   │   ├── routes/                # Central route registry (index.ts)
│   │   ├── services/
│   │   │   └── users/             # Domain Fitur Users
│   │   │       ├── controller/    # userController.ts
│   │   │       ├── routes/        # index.ts (POST /api/users)
│   │   │       ├── validator/     # schema.ts (validasi body, email, password, role)
│   │   │       ├── userService.ts # Logic duplikasi & hashing bcrypt
│   │   │       └── userRepository.ts # Query Drizzle ORM
│   │   ├── utils/                 # Utility helpers
│   │   └── server.ts              # Entry point server Express
│   └── tests/                     # Unit & integration testing
├── frontend/                      # Client application
├── drizzle.config.ts              # Konfigurasi Drizzle Kit
├── package.json                   # Dependencies & run scripts
└── tsconfig.json
```

---

## 🛠️ Panduan Menjalankan Project

### 1. Prasyarat
- [Bun](https://bun.sh/) (v1.0+)
- Server MySQL aktif

### 2. Konfigurasi Environment
Salin template konfigurasi:
```bash
cp .env.example .env
```
Sesuaikan kredensial MySQL pada `.env`:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password_mysql_anda
DB_NAME=belajar_vibecoding
```

### 3. Migrasi & Seed Database
- **Generate SQL Migration:**
  ```bash
  bun run db:generate
  ```
- **Push Schema ke Database MySQL:**
  ```bash
  bun run db:push
  ```
- **Jalankan Seeder (Roles, Departments, Akun Admin Default):**
  ```bash
  bun run db:seed
  ```
  *(Akun default: email `admin@gmail.com`, password `admin123`)*

### 4. Menjalankan Server & Testing
- **Menjalankan Server (Dev Mode / Hot Reload):**
  ```bash
  bun run dev
  ```
- **Type Checking:**
  ```bash
  bun run typecheck
  ```
- **Menjalankan Unit Test:**
  ```bash
  bun test
  ```

---

## 📡 Dokumentasi Endpoint

### Health Check
`GET /health`
```json
{
  "status": "ok",
  "runtime": "bun",
  "timestamp": "2026-11-08T16:30:00.000Z",
  "services": {
    "server": "healthy",
    "database": "connected"
  }
}
```

### Registrasi User Baru
`POST /api/users`

**Request Body:**
```json
{
  "name": "Budi Santoso",
  "email": "budi@sekolah.sch.id",
  "password": "Password123!",
  "roleId": 2,
  "departmentId": 1,
  "nip": "198501012010011001",
  "jabatan": "Staf Tata Usaha"
}
```

**Response Sukses (`201 Created`):**
```json
{
  "message": "success created account",
  "data": {
    "id": 2,
    "email": "budi@sekolah.sch.id",
    "created_at": "2026-11-08T16:30:00.000Z",
    "updated_at": "2026-11-08T16:30:00.000Z"
  }
}
```

**Response Gagal - Email Sudah Ada (`400 Bad Request`):**
```json
{
  "message": "email already exists",
  "data": null
}
```
