const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');

// Routes untuk laporan siswa
router.get('/reports', reportController.getAllReports);
router.get('/reports/:studentId', reportController.getReportByStudentId);
router.post('/reports', reportController.createReport);
router.put('/reports/:studentId', reportController.updateReport);
router.delete('/reports/:studentId', reportController.deleteReport);

module.exports = router;
