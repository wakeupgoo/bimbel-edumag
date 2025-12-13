// assets/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    fetchDataAndRender();
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
    return `https://wa.me/${number.replace(/\+/g, '')}?text=${encodedMessage}`;
}

/**
 * Mengganti semua href CTA WhatsApp
 * @param {string} number Nomor WA
 * @param {string} message Pesan WA otomatis
 */
function renderWhatsAppCTAs(number, message) {
    const waLink = createWhatsAppLink(number, message);

    document.getElementById('wa-float').href = waLink;
    document.getElementById('wa-nav').href = waLink;
    document.getElementById('wa-hero').href = waLink;
    document.getElementById('wa-pricing').href = waLink;
    document.getElementById('wa-cta').href = waLink;
    document.getElementById('wa-footer').href = waLink;
}


function renderUSP(uspArray) {
    const uspList = document.getElementById('usp-list');
    uspList.innerHTML = uspArray.map(item => `
        <div class="usp-item card-pop text-center">
            <i class="fas ${item.icon}"></i>
            <h4>${item.title}</h4>
            <p>${item.description}</p>
        </div>
    `).join('');
}

function renderPrograms(programArray) {
    const programList = document.getElementById('programs-list');
    programList.innerHTML = programArray.map(item => `
        <div class="program-card card-pop">
            <img src="${item.image}" alt="Program ${item.level}">
            <div class="card-content">
                <h4>${item.level}</h4>
                <p>${item.description}</p>
            </div>
        </div>
    `).join('');
}

function renderTestimonials(testimonialArray) {
    const testimonialList = document.getElementById('testimonials-list');
    testimonialList.innerHTML = testimonialArray.map(item => `
        <div class="testimonial-card card-pop">
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

            // Close all open answers
            document.querySelectorAll('.faq-answer.open').forEach(openAnswer => {
                if (openAnswer !== answer) {
                    openAnswer.classList.remove('open');
                    openAnswer.previousElementSibling.classList.remove('active');
                    openAnswer.style.maxHeight = 0;
                    openAnswer.previousElementSibling.querySelector('i').classList.remove('fa-chevron-up');
                    openAnswer.previousElementSibling.querySelector('i').classList.add('fa-chevron-down');
                }
            });

            // Toggle the clicked answer
            if (answer.classList.contains('open')) {
                answer.classList.remove('open');
                question.classList.remove('active');
                answer.style.maxHeight = 0;
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            } else {
                answer.classList.add('open');
                question.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px"; // Set max height for smooth transition
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        });
    });
}

