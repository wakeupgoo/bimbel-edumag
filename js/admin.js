const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwWs7eqr_hGSTTCwmssnMgHf3GHKpTqoxszyclnRveKLwEmi5xxNL8pxUBouBdzYde4Cg/exec";
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
    tableBody.innerHTML = '<tr><td colspan="5">⏳ Memuat data siswa...</td></tr>';

    try {
        const response = await fetch(`${SCRIPT_URL}?action=getStudents`);
        const students = await response.json();

        // Kosongkan dulu
        select.innerHTML = '<option value="">-- Pilih Siswa --</option>';
        tableBody.innerHTML = '';

        students.forEach(s => {
            // Mapping data sesuai formatToJSON dari Apps Script (huruf kecil)
            const id = s.id_siswa || s.id;
            const nama = s.nama_siswa || s.nama;
            const kelas = s.kelas_siswa || s.kelas;
            const token = s.token_siswa || s.token;
            const wa = s.whatsapp_siswa || s.whatsapp;

            // Isi Dropdown Input Nilai
            const opt = document.createElement('option');
            opt.value = token;
            opt.textContent = `${nama} (${kelas})`;
            opt.dataset.nama = nama;
            select.appendChild(opt);

            // Isi Tabel Manajemen
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${nama}</td>
                <td>${kelas}</td>
                <td><code>${token}</code></td>
                <td>${wa || '-'}</td>
                <td>
                    <div style="display: flex; gap: 5px;">
                        <button class="btn-edit" onclick='siapkanEdit(${JSON.stringify(s)})'>Edit</button>
                        <button class="btn-delete" onclick="hapusSiswa('${token}')">Hapus</button>
                        <button class="btn-wa" style="background:#25D366; color:white;" onclick="kirimWA('${nama}', '${token}', '${wa}')">Kirim WA</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (err) {
        console.error("Gagal muat siswa:", err);
        tableBody.innerHTML = '<tr><td colspan="5">❌ Gagal memuat data</td></tr>';
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
        token_siswa: document.getElementById('mToken').value,
        whatsapp_siswa: document.getElementById('mWhatsApp').value
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
    document.getElementById('oldToken').value = s.token_siswa || s.token;

    document.getElementById('mID').value = s.id_siswa || s.id || "";
    document.getElementById('mNama').value = s.nama_siswa || s.nama || "";
    document.getElementById('mKelas').value = s.kelas_siswa || s.kelas || "";
    document.getElementById('mToken').value = s.token_siswa || s.token || "";
    document.getElementById('mWhatsApp').value = s.whatsapp_siswa || s.whatsapp || "";

    document.getElementById('btnSubmitManage').textContent = "Simpan Perubahan";
    document.getElementById('btnSubmitManage').style.background = "#ff9800";
    document.getElementById('btnCancelEdit').style.display = "inline-block";

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
    if (!confirm(`Hapus siswa dengan token ${token}? Data nilai tidak akan hilang tapi siswa tidak muncul lagi.`)) return;

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

// --- FUNGSI KIRIM WA (VERSI FIX ANTI-404) ---
function kirimWA(nama, token, whatsapp) {
    if (!whatsapp || whatsapp === "" || whatsapp === "null") {
        alert("Nomor WhatsApp tidak tersedia.");
        return;
    }

    // 1. Bersihkan nomor (hanya angka)
    let phone = whatsapp.toString().replace(/\D/g, '');

    // 2. Format 0 -> 62
    if (phone.startsWith('0')) {
        phone = '62' + phone.substring(1);
    }

    // 3. Pesan (Gunakan \n untuk baris baru)
    const message = `*--- AKSES LAPORAN EDUMAG ---*\n\n` +
        `Halo Ayah/Bunda, berikut adalah akses laporan belajar Ananda *${nama}*:\n\n` +
        `*Token Siswa:* ${token}\n` +
        `*Link Portal:* https://bimbeledumag.my.id/cek-nilai.html\n\n` +
        `Silakan masukkan token di atas pada link tersebut untuk melihat perkembangan belajar. Terima kasih!\n\n` +
        `*Bimbel Edumag*`;

    // 4. Encode & Buka URL
    const url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);
    window.open(url, '_blank');
}

function cancelEdit() {
    resetManageForm();
}