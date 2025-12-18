# Panduan Update Data Laporan Siswa

Gunakan instruksi ini setiap kali Anda ingin memperbarui data siswa atau laporan agar bisa dilihat oleh orang tua di HP masing-masing.

---

## Langkah 1: Ambil Data dari Admin
1. Buka halaman `admin.html` di laptop Anda.
2. Klik tombol **"Salin Data JSON"**.
3. Copy (Salin) seluruh teks yang muncul di kotak tersebut.

---

## Langkah 2: Perintah untuk Blackbox AI (VS Code)
Buka file `data.js` di VS Code, tekan `Ctrl+I` atau buka chat Blackbox, lalu **Kopas (Paste)** perintah di bawah ini:

> **PERINTAH UPDATE DATA:**
> "Tolong perbarui file `data.js` ini dengan data JSON terbaru yang saya lampirkan. Ikuti instruksi teknis ini dengan ketat:
>
> 1. **Update Variabel:** Masukkan data siswa ke `initialStudents` dan data laporan ke `initialReports`.
>
> 2. **Logika Sinkronisasi (PENTING):** Ubah bagian pengambilan data agar HP orang tua otomatis terupdate:
>    - Ambil data dari `localStorage`.
>    - JIKA `localStorage` kosong, bernilai `null`, atau isinya hanya array kosong `[]`, MAKA wajib gunakan data dari `initialStudents`.
>    - TAMBAHKAN LOGIKA: Jika `initialStudents.length` (di kode) lebih besar dari data di `localStorage` (di HP), maka timpa `localStorage` dengan data kode agar data terbaru muncul.
>
> 3. **Pertahankan Fungsi:** Jangan hapus fungsi `saveStudents`, `saveReports`, `generateId`, dsb.
>
> **DATA JSON SAYA:**
> [TEMPEL HASIL SALIN DARI ADMIN DI SINI]"

---

## Langkah 3: Finalisasi & Deploy
1. **Save:** Tekan `Ctrl + S` pada file `data.js` setelah Blackbox selesai bekerja.
2. **Deploy:** Buka dashboard Vercel, lalu **Drag & Drop** folder proyek Anda kembali untuk update.
3. **Cek HP:** Buka link di HP menggunakan **Mode Penyamaran (Incognito)** untuk memastikan data terbaru sudah masuk.