const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwWs7eqr_hGSTTCwmssnMgHf3GHKpTqoxszyclnRveKLwEmi5xxNL8pxUBouBdzYde4Cg/exec";

async function cariNilai() {
    const tokenInput = document.getElementById('studentToken');
    const btn = document.getElementById('searchBtn');
    const loader = document.getElementById('loader');
    const resultArea = document.getElementById('resultArea');
    const tableBody = document.getElementById('historyTableBody');
    const displayNama = document.getElementById('displayNamaSiswa');

    const token = tokenInput.value.trim();

    if (!token) {
        alert("Harap masukkan token siswa!");
        return;
    }

    btn.disabled = true;
    if (loader) loader.style.display = 'block';
    resultArea.style.display = 'none';
    tableBody.innerHTML = '';

    try {
        const response = await fetch(`${SCRIPT_URL}?action=getHistory&token_siswa=${encodeURIComponent(token)}`);
        const data = await response.json();

        if (data.status === "success" && data.history && data.history.length > 0) {
            if (displayNama) displayNama.textContent = data.history[0].siswa || "Siswa";

            // Calculate summary data
            const totalSessions = data.history.length;
            const averageScore = data.history.reduce((sum, row) => sum + (parseFloat(row.nilai) || 0), 0) / totalSessions;
            const latestMaterial = data.history.sort((a, b) => new Date(b.timestamp || b.tanggal) - new Date(a.timestamp || a.tanggal))[0]?.materi || "-";

            // Update summary cards
            document.getElementById('averageScore').textContent = averageScore.toFixed(1);
            document.getElementById('totalSessions').textContent = totalSessions;
            document.getElementById('latestMaterial').textContent = latestMaterial;

            // Generate progress cards
            const progressCardsContainer = document.getElementById('progressCards');
            progressCardsContainer.innerHTML = '';

            data.history.forEach(row => {
                const waktu = row.timestamp || row.tanggal || "-";
                const score = parseFloat(row.nilai) || 0;
                let badgeColor = 'red';
                if (score > 80) badgeColor = 'green';
                else if (score >= 70) badgeColor = 'yellow';

                const card = document.createElement('div');
                card.className = 'progress-card';
                card.innerHTML = `
                    <div class="card-header">
                        <div class="score-badge ${badgeColor}">${score}</div>
                        <div class="card-main-info">
                            <h4>${row.materi || '-'}</h4>
                            <p>${waktu}</p>
                        </div>
                    </div>
                    <div class="card-notes">
                        <p>${row.catatan || '-'}</p>
                    </div>
                `;
                progressCardsContainer.appendChild(card);
            });

            resultArea.style.display = 'block';
            resultArea.scrollIntoView({ behavior: 'smooth' });
        } else {
            alert("Data tidak ditemukan. Pastikan Token benar.");
        }
    } catch (err) {
        alert("Terjadi gangguan koneksi ke server.");
    } finally {
        btn.disabled = false;
        if (loader) loader.style.display = 'none';
    }
}
