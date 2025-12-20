// URL Backend Apps Script Anda
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxsheqbKDYDDHVP_cg__P1QmqsPyHSWquklMCBUoYbeDionsjgynmFlxoaO3dItzjQRwg/exec";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Ambil elemen UI
            const userField = document.getElementById('username');
            const passField = document.getElementById('password');
            const btn = document.getElementById('btnLogin');
            const errorDiv = document.getElementById('errorMessage');

            // Ambil Value & Bersihkan (Trim)
            const username = userField.value.trim();
            const password = passField.value.trim();

            // Validasi Sederhana di Frontend
            if (!username || !password) {
                showError("Username dan Password wajib diisi!");
                return;
            }

            // UI Loading State
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memverifikasi...';
            if (errorDiv) errorDiv.style.display = 'none';

            try {
                // Mengirim data ke Apps Script (doPost)
                const response = await fetch(SCRIPT_URL, {
                    method: "POST",
                    mode: "cors", // Sangat penting untuk lintas domain
                    headers: {
                        "Content-Type": "text/plain;charset=utf-8"
                        // Menggunakan text/plain untuk menghindari preflight CORS yang rumit di Google Script
                    },
                    body: JSON.stringify({
                        action: "login",
                        username: username,
                        password: password
                    })
                });

                if (!response.ok) throw new Error("Gagal terhubung ke server (HTTP Error)");

                const data = await response.json();

                if (data.status === 'success') {
                    // Simpan data sesi di browser
                    sessionStorage.setItem('authToken', data.token);
                    sessionStorage.setItem('namaTutor', data.nama);

                    // Pengalihan ke halaman admin
                    // (Sesuai instruksi Anda tentang masterkey jika diperlukan)
                    window.location.replace('admin.html');
                } else {
                    // Jika status error dari Apps Script (Username/Password salah)
                    showError(data.error || "Username atau Password salah!");
                }

            } catch (err) {
                console.error("Login Error:", err);
                showError("Gangguan koneksi/server. Pastikan tab 'users' tersedia.");
            } finally {
                // Kembalikan tombol ke keadaan semula
                btn.disabled = false;
                btn.textContent = "Masuk";
            }
        });
    }
});

// Fungsi pembantu untuk menampilkan pesan error
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';

        // Efek getar sederhana jika ada CSS-nya
        errorDiv.classList.add('shake');
        setTimeout(() => errorDiv.classList.remove('shake'), 500);
    } else {
        alert(message);
    }
}