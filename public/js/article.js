// ===========================================
// ARTICLE.JS - Logika Halaman Detail Artikel
// ===========================================

// --- ELEMEN HTML UTAMA ---
const pageTitleEl = document.getElementById('page-title');
const loadingStatusEl = document.getElementById('loading-status');
const articleContentEl = document.getElementById('article-content');
const articleTitleEl = document.getElementById('article-title');
const articleCategoryEl = document.getElementById('article-category');
const articleAuthorEl = document.getElementById('article-author');
const articleDateEl = document.getElementById('article-date');
const articleReadTimeEl = document.getElementById('article-read-time');
const articleImageEl = document.getElementById('article-image');
const articleCaptionEl = document.getElementById('article-caption');
const articleMainTextEl = document.getElementById('article-main-text');
const relatedPostsContainerEl = document.getElementById('related-posts-container');
const shareWa = document.querySelector('.share-wa');
const shareFb = document.querySelector('.share-fb');
const shareTw = document.querySelector('.share-tw');


// --- SIMULASI DATA (HARUS SAMA DENGAN ID DI main.js) ---
const ARTICLE_DATA = [
    { id: 1, title: "5 Cara Mengelola Waktu Belajar Agar Lebih Produktif", category: "Tips Belajar", author: "Tim Edumag", date: "10 November 2025", readTime: 5, image: "https://via.placeholder.com/1200x600/9D76C1/ffffff?text=MANAJEMEN+WAKTU", caption: "Ilustrasi manajemen waktu yang efektif...", excerpt: "Pelajari teknik pomodoro dan manajemen tugas...", 
        contentHTML: `<p>Manajemen waktu adalah kunci sukses, terutama bagi pelajar...</p><h2>1. Terapkan Teknik Pomodoro</h2><p>Teknik Pomodoro adalah metode manajemen waktu...</p><blockquote class="edumag-quote">"Kunci bukan memprioritaskan apa yang ada di jadwal Anda..."</blockquote>`, relatedIds: [2, 3] },
    { id: 2, title: "Strategi Jitu Menghadapi Soal UTBK yang Sulit", category: "Persiapan Ujian", author: "Tim Edumag", date: "25 Oktober 2025", readTime: 7, image: "https://via.placeholder.com/1200x600/A3D0AF/000000?text=UTBK+STRATEGI", caption: "Persiapan mental dan materi...", excerpt: "Pentingnya pemahaman konsep dasar...", contentHTML: `<p>... Konten lengkap Strategi UTBK ...</p>`, relatedIds: [1, 3] },
    { id: 3, title: "Cara Menjaga Motivasi Belajar Tetap Tinggi Setiap Hari", category: "Motivasi", author: "Tim Edumag", date: "01 November 2025", readTime: 4, image: "https://via.placeholder.com/1200x600/FFA726/000000?text=MOTIVASI+BELAJAR", caption: "Trik psikologis...", excerpt: "Dari menetapkan tujuan kecil hingga mencari *study buddy*...", contentHTML: `<p>... Konten lengkap Motivasi Belajar ...</p>`, relatedIds: [1, 2] },
];

function getArticleIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    return id ? parseInt(id) : null;
}

function renderRelatedPostCard(post) {
    const articleUrl = `artikel-detail.html?id=${post.id}`;
    const card = document.createElement('a');
    card.classList.add('blog-card', 'reveal');
    card.href = articleUrl;
    card.innerHTML = `<img src="${post.image}" alt="${post.title}" class="blog-image"><div class="blog-content"><span class="blog-category">${post.category}</span><h3>${post.title}</h3><p class="blog-excerpt">${post.excerpt}</p><span class="read-more">Baca Selengkapnya <i class="fa-solid fa-arrow-right"></i></span></div>`;
    relatedPostsContainerEl.appendChild(card);
}

function updateShareLinks(title) {
    const currentUrl = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Baca artikel menarik ini: ${title} - Bimbel Edumag`);
    shareWa.href = `https://wa.me/?text=${text}%20${currentUrl}`;
    shareFb.href = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
    shareTw.href = `https://twitter.com/intent/tweet?text=${text}&url=${currentUrl}`;
}

async function loadAndRenderArticle() {
    const articleId = getArticleIdFromUrl();
    if (!articleId) {
        loadingStatusEl.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Artikel tidak ditemukan. Silakan kembali ke <a href="index.html#blog">Halaman Artikel</a>.';
        loadingStatusEl.style.color = 'red';
        return;
    }

    const articleData = ARTICLE_DATA.find(article => article.id === articleId);

    if (!articleData) {
        loadingStatusEl.innerHTML = '<i class="fa-solid fa-bug"></i> Data artikel tidak tersedia.';
        loadingStatusEl.style.color = 'red';
        return;
    }
    
    await new Promise(resolve => setTimeout(resolve, 800)); 

    // Suntikkan Konten
    pageTitleEl.textContent = articleData.title + " | Bimbel EduMag";
    document.getElementById('meta-description').content = articleData.excerpt;
    articleTitleEl.textContent = articleData.title;
    articleCategoryEl.textContent = articleData.category;
    articleAuthorEl.innerHTML = `<i class="fa-solid fa-user"></i> Penulis: ${articleData.author}`;
    articleDateEl.innerHTML = `<i class="fa-solid fa-calendar"></i> Tanggal: ${articleData.date}`;
    articleReadTimeEl.innerHTML = `<i class="fa-solid fa-clock"></i> ${articleData.readTime} Menit Baca`;
    articleImageEl.src = articleData.image;
    articleImageEl.alt = articleData.title;
    articleCaptionEl.textContent = articleData.caption;
    articleMainTextEl.innerHTML = articleData.contentHTML;
    updateShareLinks(articleData.title);

    // Render Artikel Terkait
    relatedPostsContainerEl.innerHTML = '';
    const relatedPosts = ARTICLE_DATA.filter(p => articleData.relatedIds.includes(p.id));
    if (relatedPosts.length > 0) {
        relatedPosts.forEach(renderRelatedPostCard);
    } else {
        relatedPostsContainerEl.innerHTML = '<p>Tidak ada artikel terkait saat ini.</p>';
    }

    // Transisi Tampilan
    loadingStatusEl.style.display = 'none';
    articleContentEl.style.display = 'block';
    if (window.revealOnScroll) window.revealOnScroll();
}

document.addEventListener('DOMContentLoaded', loadAndRenderArticle);