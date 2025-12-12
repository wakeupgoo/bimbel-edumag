/**
 * ARTICLE.JS - Logika Halaman Detail Artikel (Versi Decap CMS)
 * Mengambil data langsung dari GitHub berdasarkan parameter URL ?file=nama-file.md
 */

const username = 'wakeupgoo'; 
const repo = 'bimbel-edumag';

// --- ELEMEN HTML ---
const articleContentEl = document.getElementById('article-content');
const loadingStatusEl = document.getElementById('loading-status');
const articleTitleEl = document.getElementById('article-title');
const articleDateEl = document.getElementById('article-date');
const articleCategoryEl = document.getElementById('article-category');
const articleImageEl = document.getElementById('article-image');
const articleMainTextEl = document.getElementById('article-main-text');

// 1. Ambil Nama File dari URL (?file=judul-artikel.md)
function getFileNameFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('file');
}

// 2. Parser Sederhana untuk Frontmatter (YAML) dan Markdown
function parseMarkdown(md) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = md.match(frontmatterRegex);
    
    if (!match) return { metadata: {}, body: md };

    const metadataStr = match[1];
    const body = match[2];
    const metadata = {};

    metadataStr.split('\n').forEach(line => {
        const [key, ...value] = line.split(':');
        if (key && value) {
            metadata[key.trim()] = value.join(':').trim().replace(/['"]/g, '');
        }
    });

    return { metadata, body };
}

// 3. Fungsi Utama Memuat Artikel
async function loadAndRenderArticle() {
    const fileName = getFileNameFromUrl();

    if (!fileName) {
        loadingStatusEl.innerHTML = 'Artikel tidak ditemukan. <a href="index.html">Kembali ke Beranda</a>';
        return;
    }

    try {
        // Ambil file mentah dari GitHub
        const response = await fetch(`https://raw.githubusercontent.com/${username}/${repo}/main/public/_articles/${fileName}`);
        
        if (!response.ok) throw new Error("File tidak ditemukan");

        const rawContent = await response.text();
        const { metadata, body } = parseMarkdown(rawContent);

        // Update DOM dengan data dari CMS
        document.title = `${metadata.title || 'Artikel'} | Bimbel EduMag`;
        articleTitleEl.textContent = metadata.title || 'Tanpa Judul';
        articleDateEl.textContent = metadata.date || '';
        articleCategoryEl.textContent = metadata.category || 'Edukasi';
        
        // Handle Gambar (Jika ada)
        if (metadata.thumbnail) {
            articleImageEl.src = metadata.thumbnail;
            articleImageEl.style.display = 'block';
        }

        // Tampilkan Isi (Konversi baris baru menjadi paragraf sederhana)
        articleMainTextEl.innerHTML = body
            .split('\n\n')
            .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
            .join('');

        // Tampilkan konten, sembunyikan loading
        loadingStatusEl.style.display = 'none';
        articleContentEl.style.display = 'block';

    } catch (error) {
        console.error(error);
        loadingStatusEl.innerHTML = 'Gagal memuat artikel. Pastikan artikel sudah dipublikasikan.';
    }
}

document.addEventListener('DOMContentLoaded', loadAndRenderArticle);