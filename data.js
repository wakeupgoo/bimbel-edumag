// Jika ingin data permanen, masukkan hasil copy JSON ke dalam tanda [] di bawah ini
let initialStudents = [{"_id":"1766032100668bhxau3sa6","nama":"Aldrian","kelas":"7-A","reportToken":"1222"},{"_id":"1766032135477j7cikniib","nama":"Keyzia","kelas":"7-A","reportToken":"2429"},{"_id":"17660321514139nsa5a2el","nama":"Selo","kelas":"7-A","reportToken":"6446"},{"_id":"1766032164549v002hrfzj","nama":"Hosea","kelas":"7-A","reportToken":"8559"},{"_id":"1766032193109hial0fzck","nama":"Bangkit","kelas":"7-A","reportToken":"3847"},{"_id":"1766036234213m7vxham1m","nama":"Devi","kelas":"10-A","reportToken":"3472"},{"_id":"1766036829219lmicpw4sp","nama":"Celine","kelas":"8-A","reportToken":"7137"},{"_id":"17660368842727af7slai6","nama":"Nur Zahra","kelas":"8-A","reportToken":"7852"},{"_id":"17660368975382kegn6ksr","nama":"Renata","kelas":"8-A","reportToken":"7924"},{"_id":"17660369077453mjc66wey","nama":"Chen","kelas":"7-A","reportToken":"4964"},{"_id":"17660369164308ezejlanb","nama":"Afdhal","kelas":"7-A","reportToken":"3592"},{"_id":"1766036933636ltijsir3x","nama":"Nada","kelas":"9-A","reportToken":"5181"},{"_id":"1766037908670emyd6330p","nama":"Andro","kelas":"8-A","reportToken":"3413"},{"_id":"17660379470066yyjno7jh","nama":"Tata","kelas":"8-A","reportToken":"1778"},{"_id":"1766038008372vp3f4jq15","nama":"Graciela","kelas":"8-A","reportToken":"3556"},{"_id":"17660390848798e3zskk51","nama":"Difa","kelas":"7-A","reportToken":"8412"}];
let initialReports = [{"_id":"1766032219090xzb0wxlyu","studentId":"1766032193109hial0fzck","tanggal":"2025-12-18T04:30:19.090Z","materi":"Ipa-Listrik statis","hadir":true,"catatan":"Bangkit sangat semangat belajar tapi kurang teliti menjawab soal"},{"_id":"1766032932818jiczylayj","studentId":"1766032193109hial0fzck","tanggal":"2025-12-18T04:42:12.818Z","materi":"English-past tense","hadir":true,"catatan":"kurang bisa v2"},{"_id":"17660329598360zkjnbyha","studentId":"1766032193109hial0fzck","tanggal":"2025-12-18T04:42:39.836Z","materi":"Ipa - Genus","hadir":true,"catatan":"belum hafal nama ordo"},{"_id":"1766036252869nz1lfbjvz","studentId":"1766036234213m7vxham1m","tanggal":"2025-12-18T05:37:32.869Z","materi":"English-past tense","hadir":true,"catatan":"Kurang paham vocab"},{"_id":"1766039270276y1um2xt00","studentId":"17660390848798e3zskk51","tanggal":"2025-12-18T06:27:50.276Z","materi":"English - past tense","hadir":true,"catatan":"Difa semangatnya luar biasa! Tadi masih agak ketukar dikit di Regular & Irregular Verbs, tapi itu wajar kok. Yang penting berani coba dulu."}];

// Logika penggabungan data
let storedStudents = JSON.parse(localStorage.getItem('students'));
let storedReports = JSON.parse(localStorage.getItem('reports'));

// Untuk students: Jika localStorage kosong atau array kosong, gunakan initialStudents
if (!storedStudents || storedStudents.length === 0) {
    students = initialStudents;
    localStorage.setItem('students', JSON.stringify(initialStudents));
} else {
    students = storedStudents;
    // Auto-sync: Jika initialStudents lebih banyak, update localStorage
    if (initialStudents.length > storedStudents.length) {
        students = initialStudents;
        localStorage.setItem('students', JSON.stringify(initialStudents));
    }
}

// Untuk reports: Jika localStorage kosong atau array kosong, gunakan initialReports
if (!storedReports || storedReports.length === 0) {
    reports = initialReports;
    localStorage.setItem('reports', JSON.stringify(initialReports));
} else {
    reports = storedReports;
    // Auto-sync: Jika initialReports lebih banyak, update localStorage
    if (initialReports.length > storedReports.length) {
        reports = initialReports;
        localStorage.setItem('reports', JSON.stringify(initialReports));
    }
}

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
