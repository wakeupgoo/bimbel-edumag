const mongoose = require('mongoose');
const crypto = require('crypto');

const StudentSchema = new mongoose.Schema({
    nama: { type: String, required: true },
    kelas: { type: String, required: true },
    noHp: { type: String },
    namaOrtu: { type: String },
    reportToken: {
        type: String,
        unique: true,
        index: true
    }
});

// FUNGSI GENERATE TOKEN UNIK (VERSI FIX)
StudentSchema.pre('save', async function () {
    // Karena kita menggunakan async function, kita tidak butuh parameter 'next'
    // Cukup pastikan fungsi ini selesai (resolved)

    if (!this.reportToken) {
        let isUnique = false;
        let token = "";
        let tries = 0;

        while (!isUnique && tries < 10) {
            token = crypto.randomBytes(3).toString('hex').toUpperCase();

            // Gunakan this.constructor untuk akses Model
            const existingStudent = await this.constructor.findOne({ reportToken: token });

            if (!existingStudent) {
                isUnique = true;
            }
            tries++;
        }
        this.reportToken = token;
    }
    // Tanpa next(), Mongoose otomatis lanjut jika fungsi async selesai
});

module.exports = mongoose.model('Student', StudentSchema);