# RuangKursus

RuangKursus adalah aplikasi **Course Management** berbasis web
menggunakan **Django REST Framework** sebagai backend dan **React +
Vite** sebagai frontend.

## Fitur

-   CRUD course
-   CRUD peserta
-   Status selesai/belum selesai
-   Statistik course dan peserta
-   Pagination peserta (20 data per halaman)
-   Riwayat aktivitas
-   Pencarian data
-   Informasi cuaca melalui Weather API

## Teknologi

**Backend:** Python, Django, Django REST Framework, SQLite\
**Frontend:** React, Vite, JavaScript, CSS

## Struktur Project

``` text
ruangkursus/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/
│   ├── courses/
│   ├── participants/
│   └── activities/
├── frontend/
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       ├── api.js
│       └── styles.css
├── .gitignore
└── README.md
```

## Menjalankan Backend

Masuk ke folder backend:

``` bash
cd backend
```

Buat dan aktifkan virtual environment:

``` bash
python -m venv venv
venv\Scripts\activate
```

Install dependency:

``` bash
python -m pip install -r requirements.txt
```

Buat file `.env`:

``` bash
copy .env.example .env
```

Isi Weather API key pada `backend/.env`:

``` env
WEATHER_API_KEY=API_KEY_ANDA
```

Buat dan jalankan migration:

``` bash
python manage.py makemigrations
python manage.py migrate
```

Jalankan backend:

``` bash
python manage.py runserver
```

Backend berjalan di:

``` text
http://127.0.0.1:8000/
```

## Menjalankan Frontend

Buka terminal baru:

``` bash
cd frontend
npm install
npm run dev
```

Buka aplikasi:

``` text
http://localhost:5173/
```

## API

  Endpoint                    Fungsi
  --------------------------- -------------------
  `/api/courses/`             Data course
  `/api/participants/`        Data peserta
  `/api/activities/`          Riwayat aktivitas
  `/api/weather/?q=Jakarta`   Informasi cuaca

## Catatan

-   Backend dan frontend harus berjalan bersamaan.
-   Jalankan `migrate` sebelum pertama kali menjalankan aplikasi.
-   Jangan upload `.env`, `venv`, dan `node_modules` ke GitHub.
-   Jika project dipindahkan atau di-clone, buat ulang `venv`.
-   Daftar peserta menggunakan pagination maksimal 20 peserta per
    halaman.
