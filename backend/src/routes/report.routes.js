const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');

/**
 * DAFTAR ROUTE SISTEM RAPORT
 */

// --- ROUTE UNTUK SISWA ---
// 1. Tambah Siswa Baru (Admin)
router.post('/students', reportController.addStudent);

// 2. Ambil Semua Daftar Siswa (Untuk Dropdown di Admin)
router.get('/students', reportController.getAllStudents);


// --- ROUTE UNTUK LAPORAN ---
// 3. Tambah Laporan Baru (Admin)
router.post('/reports', reportController.addReport);

// 4. Ambil Semua Laporan (Untuk Tabel di Admin - Bagian 2)
router.get('/reports-all', reportController.getAllReportsAdmin);

// 5. Ambil Laporan Berdasarkan Token (Untuk Orang Tua)
router.get('/reports/token/:token', reportController.getReportsByToken);

// 6. Update Laporan Berdasarkan ID (Admin)
router.put('/reports/:id', reportController.updateReport);

// 7. Hapus Laporan Berdasarkan ID (Admin)
router.delete('/reports/:id', reportController.deleteReport);


module.exports = router;