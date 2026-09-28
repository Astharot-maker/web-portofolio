# MIKAL NOVA — Portfolio Acode + localStorage

## Isi
- Halaman user: `index.html`
- Login admin + CRUD project: `admin.html`
- CSS: `css/style.css`
- JavaScript user: `js/app.js`
- JavaScript admin/CRUD: `js/admin.js`
- Foto profil: `assets/profile.jpg`
- Logo: `assets/logo.png`

## Cara menjalankan di Acode
1. Extract ZIP ini.
2. Buka folder hasil extract di Acode.
3. Buka `index.html` untuk halaman portfolio.
4. Buka `admin.html` untuk login admin.

## Login admin awal
Username: `admin`
Password: `admin123`

Password dapat diubah di:
`js/admin.js`

Cari:
```js
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";
```

## CRUD
Admin dapat:
- Create / tambah project
- Read / melihat project
- Update / edit project
- Delete / hapus project
- Upload gambar project

Data project disimpan di `localStorage` browser.

## Penting
Versi ini TIDAK menggunakan MySQL, AWebServer, PHP, atau API.
Karena memakai localStorage, data hanya tersimpan pada browser/perangkat yang digunakan.

Login admin pada versi static/localStorage ini juga BUKAN sistem keamanan server. Jangan gunakan untuk data rahasia atau website yang membutuhkan keamanan sungguhan.

## GitHub Pages
Folder ini bisa di-upload ke repository GitHub dan digunakan sebagai website statis.
Pastikan `index.html` berada di lokasi yang benar untuk GitHub Pages.

## Kontak
Contoh kontak pada `index.html` masih berupa placeholder:
- emailkamu@example.com
- @instagram_kamu
- nomor WhatsApp contoh

Silakan ganti dengan kontak kamu sendiri.
