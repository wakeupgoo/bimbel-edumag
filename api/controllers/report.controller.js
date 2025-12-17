const Student = require('../models/Student');
const Report = require('../models/Report');

// FUNGSI 1: Tambah Laporan (Untuk Admin)
exports.addReport = async (req, res) => {
    try {
        const { studentId, materi, hadir, catatan, tanggal } = req.body;
        const studentExists = await Student.findById(studentId);
        if (!studentExists) {
            return res.status(404).json({ message: "error", error: "Siswa tidak ditemukan" });
        }
        const newReport = new Report({
            studentId, materi, hadir, catatan, tanggal: tanggal || Date.now()
        });
        await newReport.save();
        res.status(201).json({ message: "success", data: newReport });
    } catch (error) {
        console.error("Error Add Report:", error.message);
        res.status(500).json({ message: "error", error: error.message });
    }
};

// FUNGSI 2: Ambil Laporan via Token (Untuk Orang Tua)
exports.getReportsByToken = async (req, res) => {
    try {
        const { token } = req.params;
        const student = await Student.findOne({ reportToken: token });
        if (!student) {
            return res.status(404).json({ message: "error", error: "Laporan tidak ditemukan" });
        }
        const reports = await Report.find({ studentId: student._id }).sort({ tanggal: -1 });
        res.json({
            message: "success",
            data: {
                studentName: student.nama,
                studentClass: student.kelas,
                reports: reports
            }
        });
    } catch (error) {
        res.status(500).json({ message: "error", error: error.message });
    }
};

// FUNGSI 3: Tambah Siswa Baru & Generate Token
exports.addStudent = async (req, res) => {
    try {
        const { nama, kelas, noHp, namaOrtu } = req.body;
        const newStudent = new Student({ nama, kelas, noHp, namaOrtu });
        
        // Simpan ke DB. Middleware pre-save di model Student.js 
        // akan mengisi reportToken secara otomatis di sini.
        const savedStudent = await newStudent.save();

        res.status(201).json({ message: "success", data: savedStudent });
    } catch (error) {
        console.error("Error Add Student:", error.message);
        res.status(500).json({ message: "error", error: error.message });
    }
};

// FUNGSI 4: Update Laporan
exports.updateReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { materi, hadir, catatan, tanggal } = req.body;
        const updatedReport = await Report.findByIdAndUpdate(
            id,
            { materi, hadir, catatan, tanggal },
            { new: true }
        ).populate('studentId', 'nama'); // Tambahkan populate agar UI tetap sinkron
        
        if (!updatedReport) {
            return res.status(404).json({ message: "error", error: "Laporan tidak ditemukan" });
        }
        res.json({ message: "success", data: updatedReport });
    } catch (error) {
        res.status(500).json({ message: "error", error: error.message });
    }
};

// FUNGSI 5: Hapus Laporan
exports.deleteReport = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReport = await Report.findByIdAndDelete(id);
        if (!deletedReport) {
            return res.status(404).json({ message: "error", error: "Laporan tidak ditemukan" });
        }
        res.json({ message: "success", detail: "Laporan berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "error", error: error.message });
    }
};

// FUNGSI 6: Ambil Semua Daftar Siswa (Dropdown)
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ nama: 1 });
        res.json({ message: "success", data: students });
    } catch (error) {
        res.status(500).json({ message: "error", error: error.message });
    }
};

// FUNGSI 7: Ambil Semua Laporan (Tabel Admin)
exports.getAllReportsAdmin = async (req, res) => {
    try {
        const reports = await Report.find()
            .populate('studentId', 'nama') 
            .sort({ tanggal: -1 });
        res.json({ message: "success", data: reports });
    } catch (error) {
        res.status(500).json({ message: "error", error: error.message });
    }
};
