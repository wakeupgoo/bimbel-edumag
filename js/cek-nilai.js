const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwWs7eqr_hGSTTCwmssnMgHf3GHKpTqoxszyclnRveKLwEmi5xxNL8pxUBouBdzYde4Cg/exec";

async function cariNilai() {
    const tokenInput = document.getElementById('studentToken');
    const btn = document.getElementById('searchBtn');
    const loader = document.getElementById('loader');
    const resultArea = document.getElementById('resultArea');
    const progressCardsContainer = document.getElementById('progressCards');
    const displayNama = document.getElementById('displayNamaSiswa');

    // Apps Script membandingkan string secara kaku, kita ambil value asli
    const token = tokenInput.value.trim();

    if (!token) {
        alert("Harap masukkan token siswa!");
        return;
    }

    // UI Feedback
    btn.disabled = true;
    if (loader) loader.style.display = 'block';
    resultArea.style.display = 'none';
    progressCardsContainer.innerHTML = '';

    try {
        // Menggunakan parameter 'token_siswa' sesuai dengan doGet di Apps Script
        const response = await fetch(`${SCRIPT_URL}?action=getHistory&token_siswa=${encodeURIComponent(token)}`, {
            method: "GET",
            mode: "cors"
        });

        const data = await response.json();

        if (data.status === "success" && data.history && data.history.length > 0) {

            // --- PEMETAAN DATA (PENTING: Gunakan Huruf Kecil sesuai formatToJSON) ---
            // Data diambil dari Apps Script yang sudah diproses formatToJSON
            const firstRecord = data.history[0];

            // Ambil nama (Coba nama_siswa dulu, jika gagal coba nama)
            if (displayNama) displayNama.textContent = firstRecord.nama_siswa || firstRecord.siswa || "Siswa";

            // Kalkulasi Summary
            const totalSessions = data.history.length;
            const averageScore = data.history.reduce((sum, row) => sum + (parseFloat(row.nilai) || 0), 0) / totalSessions;

            // Ambil materi terakhir
            const latestMaterial = firstRecord.materi || "-";

            // Update Summary Cards di UI
            if (document.getElementById('averageScore')) document.getElementById('averageScore').textContent = averageScore.toFixed(1);
            if (document.getElementById('totalSessions')) document.getElementById('totalSessions').textContent = totalSessions;
            if (document.getElementById('latestMaterial')) document.getElementById('latestMaterial').textContent = latestMaterial;

            // Generate Progress Cards
            data.history.forEach(row => {
                // Apps Script: Tanggal otomatis jadi format dd/MM/yyyy di formatToJSON
                const waktu = row.tanggal || row.timestamp || "-";
                const score = parseFloat(row.nilai) || 0;
                const materi = row.materi || "-";
                const catatan = row.catatan || "-";

                let badgeColor = 'red';
                if (score > 80) badgeColor = 'green';
                else if (score >= 70) badgeColor = 'yellow';

                const card = document.createElement('div');
                card.className = 'progress-card';
                card.innerHTML = `
                    <div class="card-header">
                        <div class="score-badge ${badgeColor}">${score}</div>
                        <div class="card-main-info">
                            <h4>${materi}</h4>
                            <p>${waktu}</p>
                        </div>
                    </div>
                    <div class="card-notes">
                        <p>${catatan}</p>
                    </div>
                `;
                progressCardsContainer.appendChild(card);
            });

            resultArea.style.display = 'block';
            resultArea.scrollIntoView({ behavior: 'smooth' });

        } else {
            alert("Data tidak ditemukan. Pastikan Token benar dan sudah ada riwayat belajar.");
        }
    } catch (err) {
        console.error("Error Detail:", err);
        alert("Terjadi gangguan koneksi ke server. Pastikan Anda sudah mempublikasikan Apps Script sebagai 'Anyone'.");
    } finally {
        btn.disabled = false;
        if (loader) loader.style.display = 'none';
    }
}