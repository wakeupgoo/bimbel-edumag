const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId, // Menunjuk ke ID unik dari dokumen Student
        ref: 'Student',
        required: true
    },
    tanggal: {
        type: Date,
        default: Date.now
    },
    materi: {
        type: String,
        required: [true, 'Materi harus diisi']
    },
    hadir: {
        type: Boolean,
        default: true
    },
    catatan: {
        type: String
    }
});

module.exports = mongoose.model('Report', ReportSchema);