// ===========================================
// Edumag Website Interactions (Version 2.2)
// ===========================================
const ADMIN_WA = "6285134913931";
const navbar = document.querySelector('.navbar');
const revealElements = document.querySelectorAll('.reveal');
const parallaxEls = document.querySelectorAll('.parallax img');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const sections = document.querySelectorAll('section[id], .hero[id]');
const konsultasiForm = document.getElementById("konsultasiForm");
const formStatus = document.getElementById("form-status");
const latestPostsContainer = document.getElementById('latest-posts-container');
let isMobile = window.innerWidth <= 900;
let isThrottled = false;

// --- UTILITIES & UI LOGIC ---
function revealOnScroll() {
    revealElements.forEach(el => {
        const position = el.getBoundingClientRect().top;
        if (position < window.innerHeight - 100) {
            el.classList.add('active');
        }
    });
}
window.revealOnScroll = revealOnScroll; // Global for article.js

function updateActiveNav() {
    let currentSectionId = '';
    const scrollY = window.scrollY;
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 80;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            currentSectionId = sectionId;
        }
    });
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href').includes(`#${currentSectionId}`)) {
            link.classList.add('active-link');
        }
    });
}

function handleScroll() {
    if (isThrottled) return;
    isThrottled = true;
    setTimeout(() => {
        revealOnScroll();
        updateActiveNav();
        const scrolled = window.scrollY > 50;
        navbar.style.background = scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)';
        navbar.style.boxShadow = scrolled ? '0 2px 12px rgba(0,0,0,0.06)' : 'none';
        isThrottled = false;
    }, 100);
}
window.addEventListener('scroll', handleScroll);
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// --- FUNGSI SEMI-DINAMIS ---

// DUMMY DATA (Harus sama dengan ID di article.js)
const DUMMY_POSTS = [
    { id: 1, title: "5 Cara Mengelola Waktu Belajar Agar Lebih Produktif", excerpt: "Pelajari teknik pomodoro dan manajemen tugas...", category: "Tips Belajar", image: "https://via.placeholder.com/400x250/9D76C1/ffffff?text=Artikel+1" },
    { id: 2, title: "Strategi Jitu Menghadapi Soal UTBK yang Sulit", excerpt: "Pentingnya pemahaman konsep dasar dan latihan...", category: "Persiapan Ujian", image: "https://via.placeholder.com/400x250/A3D0AF/000000?text=Artikel+2" },
    { id: 3, title: "Cara Menjaga Motivasi Belajar Tetap Tinggi Setiap Hari", excerpt: "Dari menetapkan tujuan kecil hingga mencari *study buddy*...", category: "Motivasi", image: "https://via.placeholder.com/400x250/FFA726/000000?text=Artikel+3" },
];

function createPostCard(post) {
    const articleUrl = `artikel-detail.html?id=${post.id}`; // LINK KRUSIAL
    const card = document.createElement('article');
    card.classList.add('blog-card', 'reveal');
    card.innerHTML = `
        <a href="${articleUrl}"> <img src="${post.image}" alt="${post.title}" class="blog-image"> </a>
        <div class="blog-content">
            <span class="blog-category">${post.category}</span>
            <h3><a href="${articleUrl}">${post.title}</a></h3> 
            <p class="blog-excerpt">${post.excerpt}</p>
            <a href="${articleUrl}" class="read-more">Baca Selengkapnya <i class="fa-solid fa-arrow-right"></i></a>
        </div>
    `;
    return card;
}

function loadLatestPosts() {
    if (!latestPostsContainer) return;
    latestPostsContainer.innerHTML = '';
    setTimeout(() => {
        DUMMY_POSTS.forEach(post => {
            latestPostsContainer.appendChild(createPostCard(post));
        });
        revealOnScroll();
    }, 500);
}

// --- FORM SUBMISSION (ANGGAP SAMA) ---

window.addEventListener('load', () => {
    revealOnScroll();
    updateActiveNav();
    loadLatestPosts();
});