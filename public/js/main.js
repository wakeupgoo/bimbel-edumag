// ===========================================
// Edumag Website Interactions (Version 2.0)
// Includes: Parallax, Reveal, Nav Toggle, Smooth Scroll, WA Logic, and Scrollspy.
// ===========================================

const ADMIN_WA = "6285134913931";
const navbar = document.querySelector('.navbar');
const revealElements = document.querySelectorAll('.reveal');
const parallaxEls = document.querySelectorAll('.parallax img');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const sections = document.querySelectorAll('section[id], .hero[id]'); // Ambil semua section utama
const konsultasiInput = document.getElementById("konsultasiInput");
const konsultasiBtn = document.getElementById("konsultasiBtn");

// Cek Mobile saat awal load
let isMobile = window.innerWidth <= 900;
let isThrottled = false;

// --- UTILITIES ---

// Animasi Ikon Hamburger ke X
function animateNavToggle() {
    navToggle.classList.toggle('active');
}

// Menonaktifkan Parallax di Mobile
function checkMobile() {
    isMobile = window.innerWidth <= 900;
}
window.addEventListener('resize', checkMobile);


// -------- REVEAL ON SCROLL -------- //
function revealOnScroll() {
    revealElements.forEach(el => {
        const position = el.getBoundingClientRect().top;
        // Trigger point 100px di atas batas bawah viewport
        const triggerPoint = window.innerHeight - 100;

        if (position < triggerPoint) {
            el.classList.add('active');
        }
    });
}


// -------- SCROLLSPY (HIGHLIGHT NAV AKTIF) -------- //
function updateActiveNav() {
    let currentSectionId = '';

    // Dapatkan posisi scroll Y
    const scrollY = window.scrollY;

    sections.forEach(section => {
        // Offset dikurangi tinggi navbar (80px)
        const sectionTop = section.offsetTop - 80;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        // Cek apakah posisi scroll berada di dalam section saat ini
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            currentSectionId = sectionId;
        }
    });

    // Perbarui kelas 'active-link'
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active-link');
    });

    if (currentSectionId) {
        const activeLink = document.querySelector(`.nav-menu a[href="#${currentSectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active-link');
        }
    }
}


// -------- MASTER SCROLL HANDLER (THROTTLED) -------- //
function handleScroll() {
    if (isThrottled) return;

    isThrottled = true;
    setTimeout(() => {
        // 1. Efek Reveal
        revealOnScroll();

        // 2. Scrollspy
        updateActiveNav();

        // 3. Efek Navbar
        const scrolled = window.scrollY > 50;
        navbar.style.background = scrolled
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(255, 255, 255, 0.8)';
        navbar.style.boxShadow = scrolled
            ? '0 2px 12px rgba(0,0,0,0.06)'
            : 'none';

        isThrottled = false;
    }, 100); // Batasi pembaruan setiap 100ms
}

window.addEventListener('scroll', handleScroll);
window.addEventListener('load', () => {
    revealOnScroll(); // Jalankan saat awal load
    updateActiveNav(); // Set link aktif pertama kali
});


// -------- PARALLAX EFFECT (Desktop Only) -------- //
if (!isMobile) {
    const parallaxSpeed = 0.02;

    window.addEventListener('mousemove', e => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        parallaxEls.forEach(img => {
            const moveX = (centerX - e.clientX) * parallaxSpeed;
            const moveY = (centerY - e.clientY) * parallaxSpeed;

            img.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
}


// -------- MOBILE NAVIGATION TOGGLE & ACCESSIBILITY -------- //
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    animateNavToggle();
});

// Tutup menu saat link diklik (diperlukan untuk mobile)
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Tambahan: Tutup menu saat menekan tombol ESC
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape" && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});


// -------- SMOOTH SCROLL FOR NAVIGATION -------- //
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', e => {
        const targetSelector = link.getAttribute('href');
        // Hanya proses hash link internal
        if (!targetSelector || !targetSelector.startsWith('#')) return;

        const target = document.querySelector(targetSelector);
        if (!target) return;

        e.preventDefault();
        const offset = target.offsetTop - 80;

        window.scrollTo({
            top: offset,
            behavior: 'smooth'
        });

        // Update active link segera setelah klik
        // Note: ScrollSpy akan mengambil alih setelah scroll selesai
        document.querySelectorAll('.nav-menu a').forEach(l => l.classList.remove('active-link'));
        link.classList.add('active-link');
    });
});

// -------- KONSULTASI WA LOGIC -------- //
konsultasiBtn.addEventListener("click", () => {
    const text = konsultasiInput.value.trim();

    if (text.length < 5) {
        alert("Tolong tulis minimal satu kalimat ya (min 5 karakter).");
        return;
    }

    const pesan = encodeURIComponent(
        `KONSULTASI BELAJAR EDUMAG\n\nPesan:\n${text}`
    );

    const waURL = `https://wa.me/${ADMIN_WA}?text=${pesan}`;

    window.open(waURL, "_blank");

    // Kosongkan input setelah dikirim untuk UX yang lebih baik
    konsultasiInput.value = '';

    setTimeout(() => {
        // Pesan konfirmasi opsional setelah membuka WA
        console.log("Pesan telah siap, jendela WhatsApp terbuka.");
    }, 100);
});