// Mock data for static frontend version
// Students: array of student objects
let students = JSON.parse(localStorage.getItem('students')) || [
    {
        _id: '1',
        nama: 'Ahmad Fauzi',
        kelas: '10-A',
        reportToken: 'TOKEN123'
    },
    {
        _id: '2',
        nama: 'Siti Aminah',
        kelas: '11-B',
        reportToken: 'TOKEN456'
    },
    {
        _id: '3',
        nama: 'Budi Santoso',
        kelas: '9-C',
        reportToken: 'TOKEN789'
    },
    {
        _id: '4',
        nama: 'Dewi Lestari',
        kelas: '12-A',
        reportToken: 'TOKEN101'
    },
    {
        _id: '5',
        nama: 'Rizki Pratama',
        kelas: '10-B',
        reportToken: 'TOKEN202'
    }
];

// Reports: array of report objects
let reports = JSON.parse(localStorage.getItem('reports')) || [
    {
        _id: 'r1',
        studentId: '1',
        tanggal: new Date().toISOString(),
        materi: 'Matematika-Aljabar',
        hadir: true,
        catatan: 'Baik sekali'
    },
    {
        _id: 'r2',
        studentId: '2',
        tanggal: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        materi: 'Bahasa Indonesia',
        hadir: false,
        catatan: 'Sakit'
    },
    {
        _id: 'r3',
        studentId: '3',
        tanggal: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        materi: 'Fisika',
        hadir: true,
        catatan: 'Perlu bimbingan lebih'
    },
    {
        _id: 'r4',
        studentId: '4',
        tanggal: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        materi: 'Kimia',
        hadir: true,
        catatan: ''
    },
    {
        _id: 'r5',
        studentId: '5',
        tanggal: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        materi: 'Biologi',
        hadir: true,
        catatan: 'Aktif bertanya'
    }
];

// Admin accounts (for completeness, though login is hardcoded)
const admins = [
    {
        username: 'admin',
        password: '123'
    }
];

// Helper functions to save to localStorage
function saveStudents() {
    localStorage.setItem('students', JSON.stringify(students));
}

function saveReports() {
    localStorage.setItem('reports', JSON.stringify(reports));
}

// Generate unique ID
function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Generate token
function generateToken() {
    return 'TOKEN' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// API-like functions to replace fetch calls
function getStudents() {
    return { data: students };
}

function getAllReports() {
    // Populate studentId with full student object
    const populatedReports = reports.map(report => {
        const student = students.find(s => s._id === report.studentId);
        return {
            ...report,
            studentId: student || null
        };
    });
    return { data: populatedReports };
}

function addStudent(data) {
    const newStudent = {
        _id: generateId(),
        nama: data.nama,
        kelas: data.kelas,
        reportToken: generateToken()
    };
    students.push(newStudent);
    saveStudents();
    return { message: 'success', data: newStudent };
}

function addReport(data) {
    const newReport = {
        _id: generateId(),
        studentId: data.studentId,
        tanggal: new Date().toISOString(),
        materi: data.materi,
        hadir: data.hadir,
        catatan: data.catatan
    };
    reports.push(newReport);
    saveReports();
    return { message: 'success' };
}

function updateReport(id, data) {
    const index = reports.findIndex(r => r._id === id);
    if (index !== -1) {
        reports[index] = { ...reports[index], ...data };
        saveReports();
        return { message: 'success' };
    }
    return { message: 'error' };
}

function deleteReport(id) {
    reports = reports.filter(r => r._id !== id);
    saveReports();
    return { message: 'success' };
}
