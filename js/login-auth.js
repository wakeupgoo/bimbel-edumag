const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxsheqbKDYDDHVP_cg__P1QmqsPyHSWquklMCBUoYbeDionsjgynmFlxoaO3dItzjQRwg/exec";

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const userField = document.getElementById('username');
    const passField = document.getElementById('password');
    const btn = document.getElementById('btnLogin');
    const errorDiv = document.getElementById('errorMessage'); // Pastikan ada di HTML

    const user = userField.value.trim();
    const pass = passField.value.trim();

    // 1. Validasi Input Kosong
    if (!user || !pass) {
        alert("Username dan Password tidak boleh kosong!");
        return;
    }

    // 2. UI Loading State
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memverifikasi...';
    if (errorDiv) errorDiv.style.display = 'none';

    try {
        // 3. Fetch menggunakan async/await agar lebih rapi
        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({
                action: "login",
                username: user,
                password: pass
            })
        });

        // Cek jika response bukan 200 OK
        if (!response.ok) throw new Error("Gagal terhubung ke server Google.");

        const data = await response.json();

        // 4. Logika Berhasil/Gagal
        if (data.token) {
            // Simpan data sesi di browser
            sessionStorage.setItem('authToken', data.token);
            sessionStorage.setItem('namaTutor', data.nama);

            // Redirect ke dashboard admin
            window.location.href = 'admin.html';
        } else {
            // Jika status error dari Apps Script (Username/Password salah)
            alert("Gagal: " + (data.error || "Username atau Password salah!"));
            resetButton(btn);
        }

    } catch (err) {
        console.error("Login Error:", err);
        alert("Terjadi kesalahan koneksi. Pastikan Apps Script sudah di-deploy sebagai 'Anyone'.");
        resetButton(btn);
    }
});

// Fungsi untuk mengembalikan tombol jika gagal
function resetButton(btn) {
    btn.disabled = false;
    btn.textContent = "Masuk";
}