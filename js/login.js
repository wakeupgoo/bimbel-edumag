const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxsheqbKDYDDHVP_cg__P1QmqsPyHSWquklMCBUoYbeDionsjgynmFlxoaO3dItzjQRwg/exec";

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    const btn = document.getElementById('btnLogin');

    btn.disabled = true;
    btn.textContent = "Memverifikasi...";

    fetch(SCRIPT_URL, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
            action: "login",
            username: user,
            password: pass
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('namaTutor', data.nama);
                window.location.href = 'admin.html';
            } else {
                alert("Gagal: " + data.message);
                btn.disabled = false;
                btn.textContent = "Masuk";
            }
        })
        .catch(err => {
            console.error(err);
            alert("Koneksi gagal. Pastikan tab 'users' di Sheets sudah ada dan Deploy diatur ke 'Anyone'.");
            btn.disabled = false;
            btn.textContent = "Masuk";
        });
});