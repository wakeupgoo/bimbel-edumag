const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyZ0Of_eGkIoUzqqpF4GvKVK0d6ggt9sl4D1AH1-Q3pzhrPtXgQ3hB4OpaR4IcDWRCJMA/exec";
const SECRET_TOKEN = "TOKEN_RAHASIA_KITA";

document.addEventListener('DOMContentLoaded', () => {
    // 1. Proteksi Halaman
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.replace('login.html');
        return;
    }

    // 2. Set Tampilan Nama Tutor
    const nama = localStorage.getItem('namaTutor');
    if (document.getElementById('tutor')) document.getElementById('tutor').value = nama || "Tutor";
    if (document.getElementById('namaTutorDisplay')) {
        document.getElementById('namaTutorDisplay').textContent = "Halo, " + (nama || "Admin");
    }

    // 3. Muat Data Siswa (Dropdown & Tabel)
    loadStudentsFromSheets();
});

// --- FUNGSI LOGOUT ---
function logout() {
    if (confirm("Apakah Anda yakin ingin keluar dari aplikasi?")) {
        localStorage.clear();
        window.location.replace('login.html');
    }
}

// --- MUAT DATA SISWA ---
async function loadStudentsFromSheets() {
    const select = document.getElementById('studentSelect');
    const tableBody = document.getElementById('listSiswaTable');
    if (!select || !tableBody) return;

    select.innerHTML = '<option value="">⏳ Memuat...</option>';
    tableBody.innerHTML = '<tr><td colspan="4">⏳ Memuat data siswa...</td></tr>';

    try {
        const response = await fetch(`${SCRIPT_URL}?action=getStudents`);
        const students = await response.json();

        // Kosongkan dulu
        select.innerHTML = '<option value="">-- Pilih Siswa --</option>';
        tableBody.innerHTML = '';

        students.forEach(s => {
            // Isi Dropdown Input Nilai
            const opt = document.createElement('option');
            opt.value = s.token;
            opt.textContent = `${s.nama} (${s.kelas})`;
            opt.dataset.nama = s.nama;
            select.appendChild(opt);

            // Isi Tabel Manajemen
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${s.nama}</td>
                <td>${s.kelas}</td>
                <td><code>${s.token}</code></td>
                <td>
                    <button class="btn-edit" onclick='siapkanEdit(${JSON.stringify(s)})'>Edit</button>
                    <button class="btn-delete" onclick="hapusSiswa('${s.token}')">Hapus</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (err) {
        console.error("Gagal muat siswa:", err);
        tableBody.innerHTML = '<tr><td colspan="4">❌ Gagal memuat data</td></tr>';
    }
}

// --- SIMPAN PROGRES BELAJAR (FORM ATAS) ---
document.getElementById('formSiswa').addEventListener('submit', function (e) {
    e.preventDefault();
    const selectSiswa = document.getElementById('studentSelect');
    const btn = e.submitter || this.querySelector('button[type="submit"]');

    btn.disabled = true;
    btn.textContent = "Menyimpan...";

    const payload = {
        action: "inputProgress",
        token: SECRET_TOKEN,
        tutor: document.getElementById('tutor').value,
        siswa: selectSiswa.options[selectSiswa.selectedIndex].dataset.nama,
        token_siswa: selectSiswa.value,
        materi: document.getElementById('materi').value,
        nilai: document.getElementById('nilai').value,
        catatan: document.getElementById('catatan').value
    };

    fetch(SCRIPT_URL, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
    })
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                alert("✅ Progres berhasil disimpan!");
                this.reset();
                document.getElementById('tutor').value = localStorage.getItem('namaTutor');
            } else {
                alert("❌ Gagal: " + data.message);
            }
        })
        .catch(err => alert("Terjadi kesalahan koneksi."))
        .finally(() => {
            btn.disabled = false;
            btn.textContent = "Simpan Data Progres";
        });
});

// --- MANAJEMEN SISWA (TAMBAH / EDIT) ---
document.getElementById('formManageSiswa').addEventListener('submit', async function (e) {
    e.preventDefault();
    const isEdit = document.getElementById('editMode').value === "true";
    const btn = document.getElementById('btnSubmitManage');

    btn.disabled = true;
    btn.textContent = "Memproses...";

    const payload = {
        action: isEdit ? "editStudent" : "addStudent",
        old_token: document.getElementById('oldToken').value,
        id_siswa: document.getElementById('mID').value,
        nama_siswa: document.getElementById('mNama').value,
        kelas_siswa: document.getElementById('mKelas').value,
        token_siswa: document.getElementById('mToken').value
    };

    try {
        const res = await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "cors",
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.status === "success") {
            alert("✅ " + data.message);
            resetManageForm();
            loadStudentsFromSheets();
        } else {
            alert("❌ Gagal: " + data.message);
        }
    } catch (err) {
        alert("Gagal memproses data siswa.");
    } finally {
        btn.disabled = false;
    }
});

// Fungsi untuk mengisi form saat tombol edit diklik
function siapkanEdit(s) {
    document.getElementById('titleManage').textContent = "Edit Data Siswa";
    document.getElementById('editMode').value = "true";
    document.getElementById('oldToken').value = s.token;

    document.getElementById('mID').value = s.id || "";
    document.getElementById('mNama').value = s.nama || "";
    document.getElementById('mKelas').value = s.kelas || "";
    document.getElementById('mToken').value = s.token || "";

    document.getElementById('btnSubmitManage').textContent = "Simpan Perubahan";
    document.getElementById('btnSubmitManage').style.background = "#ff9800";
    document.getElementById('btnCancelEdit').style.display = "inline-block";

    // Scroll ke form edit agar terlihat
    document.getElementById('formManageSiswa').scrollIntoView({ behavior: 'smooth' });
}

function resetManageForm() {
    document.getElementById('formManageSiswa').reset();
    document.getElementById('editMode').value = "false";
    document.getElementById('titleManage').textContent = "Kelola Database Siswa";
    document.getElementById('btnSubmitManage').textContent = "Tambah Siswa Baru";
    document.getElementById('btnSubmitManage').style.background = "#4CAF50";
    document.getElementById('btnCancelEdit').style.display = "none";
}

// Fungsi Hapus Siswa
async function hapusSiswa(token) {
    if (!confirm(`Hapus siswa dengan token ${token}? Data nilai tidak akan hilang dari tab progress tapi siswa tidak akan muncul lagi di daftar.`)) return;

    try {
        const res = await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "cors",
            body: JSON.stringify({ action: "deleteStudent", token_siswa: token })
        });
        const data = await res.json();
        alert(data.message);
        loadStudentsFromSheets();
    } catch (err) {
        alert("Gagal menghapus siswa.");
    }
}