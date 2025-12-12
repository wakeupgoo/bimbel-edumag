// public/js/article.js - KHUSUS HALAMAN DEPAN
async function loadArticles() {
    const container = document.getElementById('article-list');
    if (!container) return; // Berhenti jika bukan di halaman index

    const username = 'wakeupgoo';
    const repo = 'bimbel-edumag';

    try {
        // Ambil daftar file dari folder _articles di GitHub
        const response = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/public/_articles`);
        const files = await response.json();

        if (!Array.isArray(files) || files.length === 0) {
            container.innerHTML = '<p>Belum ada artikel yang diterbitkan.</p>';
            return;
        }

        container.innerHTML = ''; // Hapus tulisan "Sedang memuat..."

        // Loop setiap file markdown
        for (const file of files) {
            if (file.name.endsWith('.md')) {
                // Ambil isi file untuk mendapatkan Judul
                const res = await fetch(file.download_url);
                const content = await res.text();

                const titleMatch = content.match(/title:\s*(.*)/);
                const title = titleMatch ? titleMatch[1].replace(/['"]/g, '') : file.name;

                const card = document.createElement('div');
                card.className = 'card reveal';
                card.innerHTML = `
                    <h3>${title}</h3>
                    <p>Tips belajar efektif dengan waktu singkat...</p>
                    <a href="artikel-detail.html?file=${file.name}" class="cta-btn" style="padding: 5px 15px; font-size: 0.8rem; display: inline-block; margin-top: 10px; text-decoration: none;">Baca Selengkapnya</a>
                `;
                container.appendChild(card);
            }
        }
    } catch (error) {
        console.error("Error:", error);
        container.innerHTML = '<p>Gagal memuat artikel. Coba refresh halaman.</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadArticles);