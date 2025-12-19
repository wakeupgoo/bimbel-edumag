const SCRIPT_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

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

            data.history.forEach(row => {
                const tr = document.createElement('tr');
                const waktu = row.timestamp || row.tanggal || "-";

                tr.innerHTML = `
                    <td style="white-space: nowrap;">${waktu}</td>
                    <td><b>${row.materi || '-'}</b></td>
                    <td>${row.tutor || '-'}</td>
                    <td><span class="score-badge">${row.nilai || '0'}</span></td>
                    <td style="font-size: 0.85em; font-style: italic; color: #666;">${row.catatan || '-'}</td>
                `;
                tableBody.appendChild(tr);
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
