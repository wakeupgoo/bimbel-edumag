// Jika ingin data permanen, masukkan hasil copy JSON ke dalam tanda [] di bawah ini
let initialStudents = [{"_id":"1766046583828ej2i2i752","nama":"Celine","kelas":"8-A","reportToken":"9229"},{"_id":"1766046652376ekveejsfg","nama":"Nur Zahra","kelas":"8-A","reportToken":"1577"},{"_id":"1766046662010q0x8ae2dy","nama":"Renata","kelas":"8-A","reportToken":"6883"},{"_id":"1766046668664s2v6dqu3v","nama":"Chen","kelas":"7-A","reportToken":"4264"},{"_id":"17660466791500ua2zgpoo","nama":"Afdhal","kelas":"7-A","reportToken":"1399"},{"_id":"1766046690976o5f8sfstk","nama":"Nada","kelas":"9-A","reportToken":"9542"},{"_id":"17660467204931yv11p0az","nama":"Yara","kelas":"10-A","reportToken":"6298"},{"_id":"176604940745340l2t0yrf","nama":"zahra","kelas":"8-A","reportToken":"3413"}];
let initialReports = [{"_id":"1766046744770mlijl250j","studentId":"17660467204931yv11p0az","tanggal":"2025-12-18T08:32:24.770Z","materi":"Basic Class - Aljabar","hadir":true,"catatan":"Yara anak yang cantik dan gemar membaca buku ","nilai":85},{"_id":"1766049120207t0sepzlmf","studentId":"1766046668664s2v6dqu3v","tanggal":"2025-12-18T09:12:00.207Z","materi":"Basic Class - Aljabar","hadir":true,"catatan":"Chen, semangat belajarnya keren banget. Kamu berani coba jawab, cepat nangkap materi, dan jawabannya juga konsisten benar. Pertahankan ya, tinggal jaga fokus dan konsistensinya.","nilai":100},{"_id":"1766049212929upy0upcqk","studentId":"17660466791500ua2zgpoo","tanggal":"2025-12-18T09:13:32.929Z","materi":"Basic Class - Aljabar","hadir":true,"catatan":"Afdhal, nilai 0 kamu dapat karena soal tidak dikerjakan. Ini bukan karena kamu tidak mampu, tapi karena kamu belum mencoba. Aljabar memang materi baru buat kamu, jadi wajar kalau masih bingung. Tapi ke depannya, kamu perlu mulai berani mengerjakan, meskipun belum yakin dengan jawabannya. Mencoba itu jauh lebih baik daripada tidak mengerjakan sama sekali. Kami akan bantu prosesnya, yang penting kamu mau usaha.","nilai":0},{"_id":"1766049306652tzb6eqzf8","studentId":"1766046583828ej2i2i752","tanggal":"2025-12-18T09:15:06.652Z","materi":"Basic Class - Aljabar","hadir":true,"catatan":"Celine, kamu sudah memperhatikan penjelasan dengan baik di kelas. Nilai 40 ini jadi tanda bahwa kamu sebenarnya sudah punya dasar, tapi masih perlu lebih aktif supaya pemahamannya makin kuat. Jangan ragu untuk bertanya atau mencoba menjawab, meskipun belum yakin. Semakin sering mencoba, kemampuanmu akan semakin meningkat.","nilai":40},{"_id":"1766049355854j1pl11t2b","studentId":"1766046662010q0x8ae2dy","tanggal":"2025-12-18T09:15:55.854Z","materi":"Basic Class - Aljabar","hadir":true,"catatan":"Renata, kamu sudah mengikuti kelas dengan tenang dan memperhatikan materi dengan baik. Nilai 70 menunjukkan pemahamanmu sudah cukup bagus. Ke depannya, coba lebih aktif ikut diskusi atau mencoba menjawab supaya pemahamanmu makin kuat dan nilainya bisa lebih meningkat.","nilai":70},{"_id":"17660494597802e77ux4hr","studentId":"176604940745340l2t0yrf","tanggal":"2025-12-18T09:17:39.780Z","materi":"Basic Class - Aljabar","hadir":true,"catatan":"Zahra, kamu sudah aktif dan selalu berusaha menjawab dengan baik. Nilai 70 menunjukkan pemahamanmu sudah cukup kuat. Sikap belajarmu ini sudah bagus, tinggal dipertahankan dan terus diasah supaya hasilnya bisa semakin maksimal.","nilai":70},{"_id":"1766049516972fv1cj40og","studentId":"1766046690976o5f8sfstk","tanggal":"2025-12-18T09:18:36.972Z","materi":"Basic Class - Aljabar","hadir":true,"catatan":"Nada, kebiasaan belajarmu sudah sangat baik. Kamu aktif bertanya saat ada materi yang belum dipahami, dan itu terlihat dari hasil belajarmu. Nilai 100 menunjukkan pemahamanmu sangat kuat. Pertahankan sikap ini dan terus konsisten ya.","nilai":100}];

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
