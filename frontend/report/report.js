async function cariLaporan() {
    const token = document.getElementById('tokenInput').value;
    const hasilDiv = document.getElementById('hasilLaporan');
    const pesanError = document.getElementById('pesanError');
    const isiTabel = document.getElementById('isiTabel');

    // Reset tampilan
    pesanError.innerText = "";
    hasilDiv.classList.add('hidden');
    isiTabel.innerHTML = "";

    if (!token) {
        pesanError.innerText = "Silakan masukkan token terlebih dahulu!";
        return;
    }

    try {
        // Panggil API Backend kita
        const response = await fetch(`http://localhost:3000/api/reports/token/${token}`);
        const result = await response.json();

        if (response.ok) {
            // Isi data siswa
            document.getElementById('namaSiswa').innerText = result.data.studentName;
            document.getElementById('kelasSiswa').innerText = result.data.studentClass;

            // Isi tabel laporan
            result.data.reports.forEach(report => {
                const row = `
                    <tr>
                        <td>${new Date(report.tanggal).toLocaleDateString('id-ID')}</td>
                        <td>${report.materi}</td>
                        <td>${report.hadir ? 'Hadir' : 'Absen'}</td>
                        <td>${report.catatan || '-'}</td>
                    </tr>
                `;
                isiTabel.innerHTML += row;
            });

            // Munculkan tabel
            hasilDiv.classList.remove('hidden');
        } else {
            // Jika token salah (404)
            pesanError.innerText = result.error || "Laporan tidak ditemukan";
        }
    } catch (error) {
        pesanError.innerText = "Gagal terhubung ke server. Pastikan Backend sudah jalan!";
    }
}