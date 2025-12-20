const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxsheqbKDYDDHVP_cg__P1QmqsPyHSWquklMCBUoYbeDionsjgynmFlxoaO3dItzjQRwg/exec";

async function cariNilai() {
    try {
        // Safety checks: Ensure required HTML elements exist
        const tokenInput = document.getElementById('studentToken');
        const btn = document.getElementById('searchBtn');
        const loader = document.getElementById('loader');
        const resultArea = document.getElementById('resultArea');
        const progressCardsContainer = document.getElementById('progressCards');
        const displayNama = document.getElementById('displayNamaSiswa');

        if (!tokenInput) {
            console.error("Required element 'studentToken' not found in HTML.");
            return;
        }
        if (!btn) {
            console.error("Required element 'searchBtn' not found in HTML.");
            return;
        }
        if (!loader) {
            console.error("Required element 'loader' not found in HTML.");
            return;
        }
        if (!resultArea) {
            console.error("Required element 'resultArea' not found in HTML.");
            return;
        }
        if (!progressCardsContainer) {
            console.error("Required element 'progressCards' not found in HTML.");
            return;
        }
        if (!displayNama) {
            console.error("Required element 'displayNamaSiswa' not found in HTML.");
            return;
        }

        const token = tokenInput.value.trim();

        if (!token) {
            alert("Harap masukkan token siswa!");
            return;
        }

        // UI Feedback: Berikan tanda sedang memproses
        btn.disabled = true;
        btn.textContent = "Mencari...";
        loader.style.display = 'block';
        resultArea.style.display = 'none';
        progressCardsContainer.innerHTML = '';

        // Pemanggilan ke Backend dengan parameter yang sesuai
        const response = await fetch(`${SCRIPT_URL}?action=getHistory&token_siswa=${encodeURIComponent(token)}`, {
            method: "GET"
        });

        if (!response.ok) throw new Error("Gagal terhubung ke server");

        const data = await response.json();

        if (data.status === "success" && data.history && data.history.length > 0) {

            // --- 1. PEMETAAN NAMA SISWA ---
            // Berdasarkan JSON Anda, kunci yang benar adalah 'siswa'
            const firstRecord = data.history[0];
            const namaTerdeteksi = firstRecord.siswa || firstRecord.nama_siswa || "Siswa";

            if (displayNama) displayNama.textContent = namaTerdeteksi;

            // --- 2. KALKULASI RINGKASAN (SUMMARY) ---
            const totalSessions = data.history.length;
            const totalScore = data.history.reduce((sum, row) => sum + (parseFloat(row.nilai) || 0), 0);
            const averageScore = totalScore / totalSessions;

            // Materi terbaru (karena sudah di .reverse() di backend, index 0 adalah yang terbaru)
            const latestMaterial = firstRecord.materi || "-";

            // Update Kartu Ringkasan
            if (document.getElementById('averageScore')) document.getElementById('averageScore').textContent = averageScore.toFixed(1);
            if (document.getElementById('totalSessions')) document.getElementById('totalSessions').textContent = totalSessions;
            if (document.getElementById('latestMaterial')) document.getElementById('latestMaterial').textContent = latestMaterial;

            // --- 3. GENERATE PROGRESS CARDS ---
            data.history.forEach(row => {
                try {
                    // Flexible Date Selection: Use a fallback mechanism to catch the date
                    const waktu = row.timestamp || row.tanggal || row.date || row.waktu || '-';
                    const score = parseFloat(row.nilai) || 0;
                    const materi = row.materi || "-";
                    const catatan = row.catatan || "-";

                    // Tentukan warna badge berdasarkan nilai
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
                                <p><i class="far fa-calendar-alt"></i> ${waktu}</p>
                            </div>
                        </div>
                        <div class="card-notes">
                            <strong>Catatan Tutor:</strong>
                            <p>${catatan.replace(/\n/g, '<br>')}</p>
                        </div>
                    `;
                    progressCardsContainer.appendChild(card);
                } catch (err) {
                    console.error("Error processing card:", err);
                }
            });

            // Tampilkan area hasil dengan efek smooth scroll
            resultArea.style.display = 'block';
            setTimeout(() => {
                resultArea.scrollIntoView({ behavior: 'smooth' });
            }, 100);

        } else {
            alert('Data Kosong');
        }
    } catch (err) {
        console.error("Fetch Error:", err);
        alert("Terjadi gangguan koneksi. Mohon coba beberapa saat lagi.");
    } finally {
        const btn = document.getElementById('searchBtn');
        const loader = document.getElementById('loader');
        btn.disabled = false;
        btn.textContent = "Cek Laporan Sekarang";
        if (loader) loader.style.display = 'none';
    }
}
