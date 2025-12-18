// Jika ingin data permanen, masukkan hasil copy JSON ke dalam tanda [] di bawah ini
let initialStudents = [{"_id":"1766046583828ej2i2i752","nama":"Celine","kelas":"8-A","reportToken":"9229"},{"_id":"1766046652376ekveejsfg","nama":"Nur Zahra","kelas":"8-A","reportToken":"1577"},{"_id":"1766046662010q0x8ae2dy","nama":"Renata","kelas":"8-A","reportToken":"6883"},{"_id":"1766046668664s2v6dqu3v","nama":"Chen","kelas":"7-A","reportToken":"4264"},{"_id":"17660466791500ua2zgpoo","nama":"Afdhal","kelas":"7-A","reportToken":"1399"},{"_id":"1766046690976o5f8sfstk","nama":"Nada","kelas":"9-A","reportToken":"9542"},{"_id":"17660467204931yv11p0az","nama":"Yara","kelas":"10-A","reportToken":"6298"}];
let initialReports = [{"_id":"1766046744770mlijl250j","studentId":"17660467204931yv11p0az","tanggal":"2025-12-18T08:32:24.770Z","materi":"Basic Class - Aljabar","hadir":true,"catatan":"Yara anak yang cantik dan gemar membaca buku ","nilai":85}];

// Clear old localStorage only once
if (!localStorage.getItem('dataCleared')) { localStorage.clear(); localStorage.setItem('dataCleared', 'true'); }

// Logika penggabungan data
let storedStudents = JSON.parse(localStorage.getItem('students'));
let storedReports = JSON.parse(localStorage.getItem('reports'));

// Untuk students: Jika localStorage kosong atau array kosong, gunakan initialStudents
if (!storedStudents || storedStudents.length === 0) {
    students = initialStudents;
} else {
    students = storedStudents;
}
// Auto-sync: Jika initialStudents lebih banyak, update localStorage
if (initialStudents.length > students.length) {
    students = initialStudents;
}
localStorage.setItem('students', JSON.stringify(students));

// Untuk reports: Jika localStorage kosong atau array kosong, gunakan initialReports
if (!storedReports || storedReports.length === 0) {
    reports = initialReports;
} else {
    reports = storedReports;
}
// Auto-sync: Jika initialReports lebih banyak, update localStorage
if (initialReports.length > reports.length) {
    reports = initialReports;
}
localStorage.setItem('reports', JSON.stringify(reports));

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

// Fungsi Reset: Membersihkan localStorage dan kembali ke data awal
function clearLocalStorage() {
    localStorage.removeItem('students');
    localStorage.removeItem('reports');
    // Reload data dari initial
    students = initialStudents;
    reports = initialReports;
    localStorage.setItem('students', JSON.stringify(initialStudents));
    localStorage.setItem('reports', JSON.stringify(initialReports));
}

// Generate unique ID
function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Generate token
function generateToken() {
    let token;
    do {
        token = Math.floor(1000 + Math.random() * 9000).toString(); // 1000-9999
    } while (students.some(s => s.reportToken.toString() === token.toString()));
    return token;
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
        catatan: data.catatan,
        nilai: data.nilai || 0
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
