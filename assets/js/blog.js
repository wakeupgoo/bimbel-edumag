// assets/js/blog.js

document.addEventListener('DOMContentLoaded', () => {
    fetchBlogDataAndRender();
});

const BLOG_API_URL = 'assets/data/blog.json';
const WA_NUMBER = "+6285134913931";
const WA_MESSAGE = "Halo Admin Bimbel Edumag, saya ingin bertanya mengenai artikel di Blog.";

async function fetchBlogDataAndRender() {
    try {
        const response = await fetch(BLOG_API_URL);
        const data = await response.json();

        renderWhatsAppCTAsBlog(WA_NUMBER, WA_MESSAGE);
        renderArticles(data.articles);

    } catch (error) {
        console.error('Error fetching blog data:', error);
    }
}

/**
 * Membuat link WhatsApp lengkap dengan pesan otomatis.
 * @param {string} number Nomor WhatsApp.
 * @param {string} message Pesan otomatis.
 * @returns {string} URL WhatsApp.
 */
function createWhatsAppLinkBlog(number, message) {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${number.replace(/\+/g, '')}?text=${encodedMessage}`;
}

/**
 * Mengganti semua href CTA WhatsApp di halaman blog
 * @param {string} number Nomor WA
 * @param {string} message Pesan WA otomatis
 */
function renderWhatsAppCTAsBlog(number, message) {
    const waLink = createWhatsAppLinkBlog(number, message);

    document.getElementById('wa-float').href = waLink;
    document.getElementById('wa-nav').href = waLink;
    document.getElementById('wa-footer-blog').href = waLink;
}

function renderArticles(articleArray) {
    const articleList = document.getElementById('article-list');

    if (articleArray.length === 0) {
        articleList.innerHTML = '<p class="text-center">Belum ada artikel yang tersedia saat ini.</p>';
        return;
    }

    articleList.innerHTML = articleArray.map(article => `
        <div class="article-card card-pop">
            <img src="${article.image}" alt="${article.title}">
            <div class="card-content">
                <p class="meta">
                    <span style="color: var(--color-secondary); font-weight: 700;">${article.category}</span>
                    <i class="fas fa-calendar-alt"></i> ${article.date}
                </p>
                <h4>${article.title}</h4>
                <p>${article.summary}</p>
                <a href="#article-detail-${article.id}" class="read-more">Baca Selengkapnya <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    `).join('');
}