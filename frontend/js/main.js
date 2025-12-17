/**
 * main.js - Vanilla JavaScript for Bimbel Edumag
 * Functions: Fetch JSON, Render Content, Sticky Nav, Scroll Reveal, FAQ Accordion, WhatsApp Link Generation, Popup
 */

document.addEventListener('DOMContentLoaded', () => {
    const DATA_URL = 'data/index.json';

    // --- Utility Functions ---

    const generateWhatsAppLink = (number, message) => {
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${number.replace(/\+/g, '')}?text=${encodedMessage}`;
    };

    const updateElement = (hookName, type, content) => {
        const elements = document.querySelectorAll(`[data-js-hook="${hookName}"]`);
        elements.forEach(el => {
            switch (type) {
                case 'text':
                    el.textContent = content;
                    break;
                case 'html':
                    el.innerHTML = content;
                    break;
                case 'href':
                    el.href = content;
                    break;
                case 'icon':
                    el.className = content; // Assuming Font Awesome class
                    break;
            }
        });
    };

    const renderList = (items, containerSelector, templateFunction) => {
        const container = document.querySelector(containerSelector);
        if (container) {
            container.innerHTML = items.map(templateFunction).join('');
        }
    };

    const createUSPTemplate = (usp) => `
        <div class="usp-card">
            <i class="fa-solid fa-star icon-usp"></i>
            <h3>${usp}</h3>
        </div>
    `;

    const createProgramTemplate = (program) => `
        <div class="program-card">
            <i class="${program.icon} icon-program"></i>
            <h4>${program.title}</h4>
            <p>${program.description}</p>
        </div>
    `;

    const createTestimonialTemplate = (t) => `
        <div class="testimonial-card">
            <i class="${t.icon}"></i>
            <blockquote>"${t.quote}"</blockquote>
            <cite>
                <strong>${t.name}</strong><br>
                <span>${t.role}</span>
            </cite>
        </div>
    `;

    const createFAQTemplate = (faq, index) => `
        <div class="faq-item" data-index="${index}">
            <button class="faq-question" data-js-hook="faq-toggle">
                ${faq.question}
                <i class="fa-solid fa-chevron-down"></i>
            </button>
            <div class="faq-answer">
                <p>${faq.answer}</p>
            </div>
        </div>
    `;

    // --- Popup (Global) ---
    const initPopup = () => {
        const popup = document.getElementById("popupOverlay");
        if (!popup) return;

        if (!sessionStorage.getItem("popupShown")) {
            popup.style.display = "flex";
            sessionStorage.setItem("popupShown", "true");
        }
    };

    window.closePopup = () => {
        const popup = document.getElementById("popupOverlay");
        if (popup) popup.style.display = "none";
    };

    // --- JSON Fetching & Rendering ---
    const initContent = async () => {
        try {
            const response = await fetch(DATA_URL);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            const waLink = generateWhatsAppLink(data.whatsapp.number, data.whatsapp.message);

            // Brand & Hero
            updateElement('brand-name', 'text', `${data.brand.name} - ${data.brand.tagline}`);
            updateElement('brand-tagline', 'text', data.brand.tagline);
            updateElement('hero-title', 'text', data.brand.name);
            updateElement('hero-subtitle', 'text', data.brand.tagline);
            updateElement('about-title', 'text', `Mengapa ${data.brand.name} Adalah Pilihan Tepat?`);
            updateElement('about-desc', 'text', data.brand.description);
            updateElement('masterkey-title', 'text', 'Edumag MasterKey');
            updateElement('masterkey-subtitle', 'text', 'Metode pembelajaran inovatif yang mengubah cara siswa belajar');
            updateElement('pricing-info', 'html', `Mulai dari <span class="price">${data.pricing.min_price}</span> . ${data.pricing.description}`);
            updateElement('cta-bottom-title', 'text', data.cta_bottom.title);
            updateElement('cta-bottom-subtitle', 'text', data.cta_bottom.subtitle);

            // Lists
            renderList(data.keunggulan, '[data-js-hook="usp-list"]', createUSPTemplate);
            renderList(data.programs, '[data-js-hook="program-list"]', createProgramTemplate);
            renderList(data.testimonials, '[data-js-hook="testimonial-list"]', createTestimonialTemplate);
            renderList(data.faq, '[data-js-hook="faq-list"]', createFAQTemplate);

            // MasterKey
            const masterkeyList = document.querySelector('[data-js-hook="masterkey-list"]');
            if (masterkeyList && data.masterkey) {
                masterkeyList.innerHTML = data.masterkey.map((item, index) => `
                    <div class="masterkey-item" data-js-hook="scroll-reveal" data-step="${index + 1}">
                        <div class="step-number">${index + 1}</div>
                        <h4>${item.title}</h4>
                        <p>${item.description}</p>
                    </div>
                `).join('');
            }

            // Visi & Misi
            const visiText = document.querySelector('[data-js-hook="visi-text"]');
            if (visiText && data.visi) visiText.textContent = data.visi;
            const misiList = document.querySelector('[data-js-hook="misi-list"]');
            if (misiList && data.misi) {
                misiList.innerHTML = data.misi.map(item => `<li>${item}</li>`).join('');
            }

            // WhatsApp CTAs
            updateElement('whatsapp-cta', 'href', waLink);
            updateElement('whatsapp-cta-float', 'href', waLink);
            updateElement('whatsapp-number', 'text', data.whatsapp.number);

            // UI Interactions
            initFAQAccordion();
            initStickyNavbar();
            initScrollReveal();

        } catch (error) {
            console.error('Failed to load or process index data:', error);
            const fallbackLink = generateWhatsAppLink('+6285134913931', 'Halo Admin Bimbel Edumag, saya ingin konsultasi belajar.');
            updateElement('whatsapp-cta', 'href', fallbackLink);
            updateElement('whatsapp-cta-float', 'href', fallbackLink);
        }
    };

    // --- UI Interactions ---
    const initFAQAccordion = () => {
        const faqList = document.querySelector('[data-js-hook="faq-list"]');
        if (!faqList) return;

        faqList.addEventListener('click', (event) => {
            const toggleButton = event.target.closest('[data-js-hook="faq-toggle"]');
            if (!toggleButton) return;

            const faqItem = toggleButton.closest('.faq-item');
            const answer = faqItem.querySelector('.faq-answer');
            const icon = toggleButton.querySelector('i');

            const isOpen = faqItem.classList.contains('active');

            document.querySelectorAll('.faq-item.active').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    item.querySelector('.faq-answer').style.maxHeight = null;
                    item.querySelector('i').classList.replace('fa-chevron-up', 'fa-chevron-down');
                }
            });

            if (isOpen) {
                faqItem.classList.remove('active');
                answer.style.maxHeight = null;
                icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
            } else {
                faqItem.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
                icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
            }
        });
    };

    const initStickyNavbar = () => {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        const handleScroll = () => {
            if (window.scrollY > 50) navbar.classList.add('sticky');
            else navbar.classList.remove('sticky');
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
    };

    const initScrollReveal = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('[data-js-hook="scroll-reveal"]').forEach(element => observer.observe(element));
    };

    const initHamburgerMenu = () => {
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
        if (!hamburger || !mobileMenu || !mobileMenuOverlay) return;

        const toggleMenu = () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            mobileMenuOverlay.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        };

        hamburger.addEventListener('click', toggleMenu);
        mobileMenuOverlay.addEventListener('click', toggleMenu);
        mobileMenu.addEventListener('click', (event) => {
            if (event.target.tagName === 'A') toggleMenu();
        });
    };

    // --- Blog Page Logic (Conditional) ---
    if (document.body.classList.contains('page-blog')) {
        const BLOG_DATA_URL = 'data/blog.json';

        const createBlogCardTemplate = (article) => `
            <article class="blog-card" data-js-hook="scroll-reveal">
                <div class="card-thumbnail" style="background-image: url('assets/images/${article.thumbnail}');"></div>
                <div class="card-content">
                    <span class="card-category"><i class="fa-solid fa-tag"></i> ${article.category}</span>
                    <a href="#${article.slug}" class="card-title-link"><h3>${article.title}</h3></a>
                    <p class="card-excerpt">${article.excerpt}</p>
                    <div class="card-meta">
                        <span><i class="fa-solid fa-calendar-alt"></i> ${article.date}</span>
                        <span><i class="fa-solid fa-user-edit"></i> ${article.author}</span>
                    </div>
                    <a href="#${article.slug}" class="btn btn-primary-outline">Baca Selengkapnya <i class="fa-solid fa-arrow-right"></i></a>
                </div>
            </article>
        `;

        const renderBlogList = async () => {
            const container = document.querySelector('[data-js-hook="blog-list"]');
            if (!container) return;

            try {
                const response = await fetch(BLOG_DATA_URL);
                if (!response.ok) throw new Error('Failed to fetch blog data');
                const articles = await response.json();

                container.innerHTML = articles.map(createBlogCardTemplate).join('');
                document.querySelectorAll('.blog-card').forEach(element => {
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                entry.target.classList.add('in-view');
                                observer.unobserve(entry.target);
                            }
                        });
                    }, { threshold: 0.1 });
                    observer.observe(element);
                });

            } catch (error) {
                console.error('Error rendering blog list:', error);
                container.innerHTML = '<p class="error-message">Gagal memuat artikel blog. Silakan coba lagi nanti.</p>';
            }
        };

        renderBlogList();
    }

    // --- Execution ---
    initPopup();
    initContent();
    initHamburgerMenu();
});
