// Konfigurasi GitHub
const username = 'wakeupgoo';
const repo = 'bimbel-edumag';

async function init() {
    const detailContainer = document.getElementById('article-main-text');
    const listContainer = document.getElementById('article-list');

    if (detailContainer) {
        // JIKA DI HALAMAN DETAIL
        loadArticleDetail();
    } else if (listContainer) {
        // JIKA DI HALAMAN DEPAN
        loadArticleList();
    }
}

// --- FUNGSI HALAMAN DETAIL ---
async function loadArticleDetail() {
    const params = new URLSearchParams(window.location.search);
    const fileName = params.get('file');

    if (!fileName) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/public/_articles/${fileName}`);
        const data = await response.json();
        const content = atob(data.content); // Decode base64 dari GitHub

        // Pisahkan Metadata (Frontmatter) dan Isi
        const parts = content.split('---');
        const metaRaw = parts[1];
        const bodyRaw = parts.slice(2).join('---');

        // Ambil Data Metadata
        const title = metaRaw.match(/title:\s*(.*)/)?.[1].replace(/['"]/g, '') || "Tanpa Judul";
        const date = metaRaw.match(/date:\s*(.*)/)?.[1] || "-";
        const category = metaRaw.match(/category:\s*(.*)/)?.[1] || "Umum";
        const thumb = metaRaw.match(/thumbnail:\s*(.*)/)?.[1].replace(/['"]/g, '') || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800";

        // Update Tampilan HTML
        document.title = `${title} - Bimbel EduMag`;
        document.getElementById('article-title').innerText = title;
        document.getElementById('article-category').innerText = category;
        document.getElementById('article-date').innerHTML = `<i class="fa-solid fa-calendar"></i> ${date}`;
        document.getElementById('article-image').src = thumb;

        // Render Markdown ke HTML menggunakan Marked.js
        document.getElementById('article-main-text').innerHTML = marked.parse(bodyRaw);

        // Hitung Waktu Baca Sederhana
        const words = bodyRaw.split(/\s+/).length;
        const readTime = Math.ceil(words / 200);
        document.getElementById('article-read-time').innerHTML = `<i class="fa-solid fa-clock"></i> ${readTime} Menit Baca`;

        // Tampilkan konten, sembunyikan loading
        document.getElementById('loading-status').style.display = 'none';
        document.getElementById('article-content').style.display = 'block';

    } catch (error) {
        console.error("Gagal memuat artikel:", error);
        document.getElementById('loading-status').innerHTML = "Artikel tidak ditemukan.";
    }
}

// --- FUNGSI HALAMAN DEPAN (Copy dari yang sebelumnya) ---
async function loadArticleList() {
    const container = document.getElementById('article-list');
    try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/public/_articles`);
        const files = await response.json();

        container.innerHTML = '';
        for (const file of files) {
            if (file.name.endsWith('.md')) {
                const res = await fetch(file.download_url);
                const text = await res.text();
                const title = text.match(/title:\s*(.*)/)?.[1].replace(/['"]/g, '') || file.name;

                const card = document.createElement('div');
                card.className = 'article-card';
                card.innerHTML = `
                    <div class="article-info">
                        <h3>${title}</h3>
                        <a href="artikel-detail.html?file=${file.name}" class="cta-btn">Baca</a>
                    </div>
                `;
                container.appendChild(card);
            }
        }
    } catch (e) { console.error(e); }
}

document.addEventListener('DOMContentLoaded', init);