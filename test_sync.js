// Test script to verify data loading and synchronization logic
// This simulates the data.js logic without browser dependencies

// Mock localStorage
const localStorageMock = {
    store: {},
    getItem: function(key) {
        return this.store[key] || null;
    },
    setItem: function(key, value) {
        this.store[key] = value;
    },
    removeItem: function(key) {
        delete this.store[key];
    },
    clear: function() {
        this.store = {};
    }
};

// Replace localStorage with mock
global.localStorage = localStorageMock;

// Copy the data from data.js
let initialStudents = [{"_id":"1766046583828ej2i2i752","nama":"Celine","kelas":"8-A","reportToken":"9229"},{"_id":"1766046652376ekveejsfg","nama":"Nur Zahra","kelas":"8-A","reportToken":"1577"},{"_id":"1766046662010q0x8ae2dy","nama":"Renata","kelas":"8-A","reportToken":"6883"},{"_id":"1766046668664s2v6dqu3v","nama":"Chen","kelas":"7-A","reportToken":"4264"},{"_id":"17660466791500ua2zgpoo","nama":"Afdhal","kelas":"7-A","reportToken":"1399"},{"_id":"1766046690976o5f8sfstk","nama":"Nada","kelas":"9-A","reportToken":"9542"},{"_id":"17660467204931yv11p0az","nama":"Yara","kelas":"10-A","reportToken":"6298"},{"_id":"176604940745340l2t0yrf","nama":"zahra","kelas":"8-A","reportToken":"3413"}];
let initialReports = [{"_id":"1766046744770mlijl250j","studentId":"17660467204931yv11p0az","tanggal":"2025-12-18T08:32:24.770Z","materi":"Basic Class - Aljabar","hadir":true,"catatan":"Yara anak yang cantik dan gemar membaca buku ","nilai":85},{"_id":"1766049120207t0sepzlmf","studentId":"1766046668664s2v6dqu3v","tanggal":"2025-12-18T09:12:00.207Z","materi":"Basic Class - Aljabar","hadir":true,"catatan":"Chen, semangat belajarnya keren banget. Kamu berani coba jawab, cepat nangkap materi, dan jawabannya juga konsisten benar. Pertahankan ya, tinggal jaga fokus dan konsistensinya.","nilai":100},{"_id":"1766049212929upy0upcqk","studentId":"17660466791500ua2zgpoo","tanggal":"2025-12-18T09:13:32.929Z","materi":"Basic Class - Aljabar","hadir":true,"catatan":"Afdhal, nilai 0 kamu dapat karena soal tidak dikerjakan. Ini bukan karena kamu tidak mampu, tapi karena kamu belum mencoba. Aljabar memang materi baru buat kamu, jadi wajar kalau masih bingung. Tapi ke depannya, kamu perlu mulai berani mengerjakan, meskipun belum yakin dengan jawabannya. Mencoba itu jauh lebih baik daripada tidak mengerjakan sama sekali. Kami akan bantu prosesnya, yang penting kamu mau usaha.","nilai":0},{"_id":"1766049306652tzb6eqzf8","studentId":"1766046583828ej2i2i752","tanggal":"2025-12-18T09:15:06.652Z","materi":"Basic Class - Aljabar","hadir":true,"catatan":"Celine, kamu sudah memperhatikan penjelasan dengan baik di kelas. Nilai 40 ini jadi tanda bahwa kamu sebenarnya sudah punya dasar, tapi masih perlu lebih aktif supaya pemahamannya makin kuat. Jangan ragu untuk bertanya atau mencoba menjawab, meskipun belum yakin. Semakin sering mencoba, kemampuanmu akan semakin meningkat.","nilai":40},{"_id":"1766049355854j1pl11t2b","studentId":"1766046662010q0x8ae2dy","tanggal":"2025-12-18T09:15:55.854Z","materi":"Basic Class - Aljabar","hadir":true,"catatan":"Renata, kamu sudah mengikuti kelas dengan tenang dan memperhatikan materi dengan baik. Nilai 70 menunjukkan pemahamanmu sudah cukup bagus. Ke depannya, coba lebih aktif ikut diskusi atau mencoba menjawab supaya pemahamanmu makin kuat dan nilainya bisa lebih meningkat.","nilai":70},{"_id":"17660494597802e77ux4hr","studentId":"176604940745340l2t0yrf","tanggal":"2025-12-18T09:17:39.780Z","materi":"Basic Class - Aljabar","hadir":true,"catatan":"Zahra, kamu sudah aktif dan selalu berusaha menjawab dengan baik. Nilai 70 menunjukkan pemahamanmu sudah cukup kuat. Sikap belajarmu ini sudah bagus, tinggal dipertahankan dan terus diasah supaya hasilnya bisa semakin maksimal.","nilai":70},{"_id":"1766049516972fv1cj40og","studentId":"1766046690976o5f8sfstk","tanggal":"2025-12-18T09:18:36.972Z","materi":"Basic Class - Aljabar","hadir":true,"catatan":"Nada, kebiasaan belajarmu sudah sangat baik. Kamu aktif bertanya saat ada materi yang belum dipahami, dan itu terlihat dari hasil belajarmu. Nilai 100 menunjukkan pemahamanmu sangat kuat. Pertahankan sikap ini dan terus konsisten ya.","nilai":100},{"_id":"1766135289106tqz651fpd","studentId":"1766046583828ej2i2i752","tanggal":"2025-12-19T09:08:09.106Z","materi":"Basic Class - English Simple Present Tense","hadir":true,"catatan":"Celine sangat aktif dalam kelas dan mampu memahami materi dengan cepat. Ia konsisten menjawab pertanyaan dengan tepat dan menunjukkan pemahaman konsep yang baik.\nPada beberapa kesempatan, masih perlu ketelitian pada penggunaan verb dalam Simple Present Tense, khususnya untuk subjek she/he/it yang memerlukan akhiran -s/-es.\nDengan sedikit perhatian pada detail tata bahasa tersebut, Celine berpotensi mempertahankan performa akademiknya yang sudah sangat baik.","nilai":100},{"_id":"1766135336328kz6fp44rn","studentId":"1766046668664s2v6dqu3v","tanggal":"2025-12-19T09:08:56.328Z","materi":"Basic Class - English Simple Present Tense","hadir":true,"catatan":"Chenn menunjukkan konsistensi belajar yang sangat baik. Pemahaman dasar tata bahasa Inggrisnya sudah kuat dan stabil.\nHingga saat ini tidak ditemukan kendala berarti dalam mengikuti materi.\nDiharapkan Chenn dapat terus menjaga konsistensi ini agar kemampuan bahasanya semakin matang di level berikutnya.","nilai":100},{"_id":"1766135385470pfk4vzims","studentId":"176604940745340l2t0yrf","tanggal":"2025-12-19T09:09:45.470Z","materi":"Basic Class - English Simple Present Tense","hadir":true,"catatan":"Mayra mampu menulis teks deskriptif dengan struktur yang rapi dan pilihan kosakata yang tepat. Ia sudah menunjukkan kepekaan dalam menggunakan ungkapan bahasa Inggris secara kontekstual.\n\nMasukan kecil hanya pada penguatan variasi kalimat agar tulisannya semakin kaya.\n\nDengan kemampuan yang sudah dimiliki, Mayra sangat berpotensi berkembang lebih jauh dalam keterampilan menulis bahasa Inggris.","nilai":100},{"_id":"1766135439897r51y5w0yg","studentId":"1766046690976o5f8sfstk","tanggal":"2025-12-19T09:10:39.897Z","materi":"Basic Class - English Simple Present Tense","hadir":true,"catatan":"Nada memiliki gaya belajar yang tenang namun konsisten. Ia teliti dalam mengerjakan soal dan menunjukkan akurasi yang baik, terutama saat evaluasi.\n\nNada juga aktif bertanya ketika belum memahami materi, yang menunjukkan sikap belajar yang positif.\n\nDengan mempertahankan ketelitian dan rasa ingin tahunya, Nada dapat terus meningkatkan pemahaman secara bertahap dan stabil.","nilai":100},{"_id":"1766135487750l22lgzg1d","studentId":"1766046662010q0x8ae2dy","tanggal":"2025-12-19T09:11:27.750Z","materi":"Basic Class - English Simple Present Tense","hadir":true,"catatan":"Renata menunjukkan pemahaman materi yang sangat baik meskipun cenderung tenang di kelas. Ia mampu menyerap penjelasan dengan optimal dan mengingat materi sebelumnya dengan baik.\n\nKemampuan memilih kata dalam penulisan teks deskriptif juga sudah berkembang dengan matang.\n\nJika terus konsisten, Renata memiliki potensi besar untuk unggul secara akademik dengan gaya belajarnya yang reflektif.","nilai":100},{"_id":"1766135539887x5z8f69oz","studentId":"17660466791500ua2zgpoo","tanggal":"2025-12-19T09:12:19.887Z","materi":"Basic Class - English Simple Present Tense","hadir":true,"catatan":"Afdhal memiliki penguasaan kosakata bahasa Inggris yang baik dan menunjukkan inisiatif tinggi dengan aktif bertanya ketika menemui kesulitan.\n\nIa masih memerlukan pendampingan untuk memantau dan menstabilkan progres belajarnya, namun ketika sudah diarahkan, Afdhal mampu memahami materi dengan baik.\n\nDengan pendampingan yang konsisten, Afdhal berpotensi meningkatkan hasil belajarnya secara signifikan.","nilai":90}];

// Simulate the data loading logic
let students, reports;

// Clear old localStorage only once (simulate)
if (!localStorage.getItem('dataCleared')) {
    localStorage.clear();
    localStorage.setItem('dataCleared', 'true');
}

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

// Test results
console.log('Test Results:');
console.log('initialStudents length:', initialStudents.length);
console.log('initialReports length:', initialReports.length);
console.log('students length after sync:', students.length);
console.log('reports length after sync:', reports.length);
console.log('localStorage students length:', JSON.parse(localStorage.getItem('students')).length);
console.log('localStorage reports length:', JSON.parse(localStorage.getItem('reports')).length);

// Check if new reports are present
const newReports = reports.filter(r => r.tanggal.startsWith('2025-12-19'));
console.log('New reports (2025-12-19):', newReports.length);
console.log('All tests passed:', initialStudents.length === 8 && initialReports.length === 13 && reports.length === 13 && newReports.length === 6);
