// assets/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    fetchDataAndRender();
    // Inisialisasi Swiper setelah data dirender
    // Diletakkan di fungsi terpisah agar bisa dipanggil setelah DOM USP/Testimonial terisi
});

const API_URL = 'assets/data/home.json';
let brandData = {}; // Global variable to store brand info

async function fetchDataAndRender() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        brandData = data.brand; // Store brand info globally

        // 1. Render All CTA WhatsApp Links
        renderWhatsAppCTAs(brandData.whatsappNumber, brandData.whatsappMessage);

        // 2. Render Hero Section
        document.getElementById('hero-headline').textContent = data.hero.headline;
        document.getElementById('hero-subheadline').textContent = data.hero.subHeadline;

        // 3. Render USP Section
        renderUSP(data.usp);

        // 4. Render About Section
        document.getElementById('about-title').textContent = data.about.title;
        document.getElementById('about-content').textContent = data.about.content;

        // 5. Render Programs Section
        renderPrograms(data.programs);

        // 6. Render Pricing Section
        document.getElementById('pricing-value').textContent = `Mulai dari ${data.pricing.startPrice}`;
        document.getElementById('pricing-note').textContent = data.pricing.note;

        // 7. Render Testimonials
        renderTestimonials(data.testimonials);

        // 8. Render FAQ Section and attach toggle listener
        renderFAQ(data.faq);
        attachFAQToggleListener();

        // ** Fungsionalitas Mobile/Swiper **
        // 9. Inisialisasi Swiper untuk semua carousel
        initializeSwipers();


    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

/**
 * Membuat link WhatsApp lengkap dengan pesan otomatis.
 * @param {string} number Nomor WhatsApp.
 * @param {string} message Pesan otomatis.
 * @returns {string} URL WhatsApp.
 */
function createWhatsAppLink(number, message) {
    const encodedMessage = encodeURIComponent(message);
    // Menghilangkan semua non-digit dari nomor (termasuk '+')
    const cleanedNumber = number.replace(/\D/g, ''); 
    return `https://wa.me/${cleanedNumber}?text=${encodedMessage}`;
}

/**
 * Mengganti semua href CTA WhatsApp
 * @param {string} number Nomor WA
 * @param {string} message Pesan WA otomatis
 */
function renderWhatsAppCTAs(number, message) {
    const waLink = createWhatsAppLink(number, message);

    // Seleksi semua elemen yang memiliki class 'wa-cta-link'
    const ctaLinks = document.querySelectorAll('.wa-cta-link');
    ctaLinks.forEach(link => {
        link.href = waLink;
    });

    // Menghapus ID yang berulang, cukup pakai class:
    // document.getElementById('wa-float').href = waLink; // Contoh: ganti ID ini dengan class
    // document.getElementById('wa-nav').href = waLink;
    // ... dst
}


/**
 * Mengubah USP (Keunggulan) menjadi struktur Swiper-Friendly
 */
function renderUSP(uspArray) {
    const uspListContainer = document.getElementById('usp-list');
    
    // Perubahan: Menambahkan class 'swiper-wrapper' ke div terluar jika ID-nya adalah 'usp-list'
    // ATAU lebih baik: Buat div baru dengan ID="usp-list-wrapper"
    uspListContainer.classList.add('swiper-wrapper');

    uspListContainer.innerHTML = uspArray.map(item => `
        <div class="usp-item card-pop text-center swiper-slide">
            <i class="fas ${item.icon}"></i>
            <h4>${item.title}</h4>
            <p>${item.description}</p>
        </div>
    `).join('');
}


/**
 * Mengubah Programs menjadi struktur Swiper-Friendly
 */
function renderPrograms(programArray) {
    const programListContainer = document.getElementById('programs-list');
    programListContainer.classList.add('swiper-wrapper');

    programListContainer.innerHTML = programArray.map(item => `
        <div class="program-card card-pop swiper-slide">
            <img src="${item.image}" alt="Program ${item.level}">
            <div class="card-content">
                <h4>${item.level}</h4>
                <p>${item.description}</p>
            </div>
        </div>
    `).join('');
}

/**
 * Mengubah Testimonials menjadi struktur Swiper-Friendly
 */
function renderTestimonials(testimonialArray) {
    const testimonialListContainer = document.getElementById('testimonials-list');
    testimonialListContainer.classList.add('swiper-wrapper');
    
    testimonialListContainer.innerHTML = testimonialArray.map(item => `
        <div class="testimonial-card card-pop swiper-slide">
            <p><i class="fas fa-quote-left"></i> ${item.text}</p>
            <p><strong>- ${item.name}</strong></p>
        </div>
    `).join('');
}

function renderFAQ(faqArray) {
    const faqList = document.getElementById('faq-list');
    faqList.innerHTML = faqArray.map((item, index) => `
        <div class="faq-item">
            <div class="faq-question" data-index="${index}">
                <span>${item.question}</span>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="faq-answer">
                <p>${item.answer}</p>
            </div>
        </div>
    `).join('');
}

function attachFAQToggleListener() {
    const questions = document.querySelectorAll('.faq-question');
    questions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('i');

            // --- Logika Penutupan Akordion Lain ---
            document.querySelectorAll('.faq-answer.open').forEach(openAnswer => {
                if (openAnswer !== answer) {
                    openAnswer.classList.remove('open');
                    openAnswer.previousElementSibling.classList.remove('active');
                    openAnswer.style.maxHeight = 0;
                    
                    // Memperbaiki ikon panah saat ditutup
                    const oldIcon = openAnswer.previousElementSibling.querySelector('i');
                    oldIcon.classList.remove('fa-chevron-up');
                    oldIcon.classList.add('fa-chevron-down');
                }
            });

            // --- Logika Toggle Jawaban yang Diklik ---
            if (answer.classList.contains('open')) {
                // Tutup
                answer.classList.remove('open');
                question.classList.remove('active');
                answer.style.maxHeight = 0;
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            } else {
                // Buka
                answer.classList.add('open');
                question.classList.add('active');
                // Mengambil scrollHeight untuk transisi yang dinamis
                answer.style.maxHeight = answer.scrollHeight + 30 + "px"; // Tambah 30px untuk padding
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        });
    });
}

/**
 * Inisialisasi Swiper.js untuk semua section yang membutuhkan swipe.
 * Catatan: Memerlukan link Swiper CSS dan JS di HTML.
 */
function initializeSwipers() {
    // 1. Swiper USP (Keunggulan)
    if (document.getElementById('usp-list')) {
        new Swiper(document.getElementById('usp-list').parentNode, { // Parent harus dipanggil karena idlist sudah jadi swiper-wrapper
            slidesPerView: 1,
            spaceBetween: 20,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            breakpoints: {
                769: {
                    slidesPerView: 3, // Di Desktop/Tablet tetap pakai 3 atau 4 card
                    spaceBetween: 30
                },
                1024: {
                    slidesPerView: 4, 
                    spaceBetween: 30
                }
            }
        });
    }

    // 2. Swiper Programs
    if (document.getElementById('programs-list')) {
        new Swiper(document.getElementById('programs-list').parentNode, {
            slidesPerView: 1,
            spaceBetween: 20,
            pagination: {
                el: ".swiper-pagination-programs",
                clickable: true,
            },
            breakpoints: {
                769: {
                    slidesPerView: 3, 
                    spaceBetween: 30
                }
            }
        });
    }

    // 3. Swiper Testimonials
    if (document.getElementById('testimonials-list')) {
        new Swiper(document.getElementById('testimonials-list').parentNode, {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            pagination: {
                el: ".swiper-pagination-testimonials",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            }
        });
    }
}