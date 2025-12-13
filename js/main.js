/**
 * main.js - Vanilla JavaScript for Bimbel Edumag
 * Functions: Fetch JSON, Render Content, Sticky Nav, Scroll Reveal, FAQ Accordion, WhatsApp Link Generation
 */

document.addEventListener('DOMContentLoaded', () => {
    const DATA_URL = 'data/index.json';
    const WA_NUMBER = '+6285134913931';
    const WA_MESSAGE = 'Halo Admin Bimbel Edumag, saya ingin konsultasi belajar.';

    // --- Utility Functions ---

    /**
     * Generates the full WhatsApp link with pre-filled message.
     * @returns {string} The complete WhatsApp URL.
     */
    const generateWhatsAppLink = () => {
        const encodedMessage = encodeURIComponent(WA_MESSAGE);
        return `https://wa.me/${WA_NUMBER.replace(/\+/g, '')}?text=${encodedMessage}`;
    };

    /**
     * Finds elements by data-js-hook and updates their content or attributes.
     * @param {string} hookName - The value of the data-js-hook attribute.
     * @param {string} type - 'text', 'html', 'href', or 'icon'.
     * @param {string} content - The content or attribute value.
     */
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

    // --- JSON Fetching & Rendering ---

    /**
     * Renders a list of items (e.g., USP, Programs) into a specified container.
     * @param {Array<Object>} items - Array of data objects.
     * @param {string} containerSelector - Selector for the HTML container.
     * @param {Function} templateFunction - Function to generate the HTML for a single item.
     */
    const renderList = (items, containerSelector, templateFunction) => {
        const container = document.querySelector(containerSelector);
        if (container) {
            container.innerHTML = items.map(templateFunction).join('');
        }
    };

    /**
     * HTML template for a USP item.
     */
    const createUSPTemplate = (usp) => `
        <div class="usp-card">
            <i class="${usp.icon} icon-usp"></i>
            <h3>${usp.title}</h3>
            <p>${usp.description}</p>
        </div>
    `;

    /**
     * HTML template for a Program item.
     */
    const createProgramTemplate = (program) => `
        <div class="program-card">
            <i class="${program.icon} icon-program"></i>
            <h4>${program.title}</h4>
            <p>${program.description}</p>
        </div>
    `;

    /**
     * HTML template for a Testimonial item.
     */
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

    /**
     * HTML template for an FAQ item.
     */
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

    /**
     * Fetches the main data and initializes content rendering.
     */
    const initContent = async () => {
        try {
            const response = await fetch(DATA_URL);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const waLink = generateWhatsAppLink();

            // 1. Render Brand & Hero Content
            updateElement('brand-name', 'text', data.brand.name);
            updateElement('hero-title', 'text', data.hero.title);
            updateElement('hero-subtitle', 'text', data.hero.subtitle);
            updateElement('about-title', 'text', data.about.title);
            updateElement('about-desc', 'text', data.about.description);
            updateElement('pricing-info', 'html', `Mulai dari <span class="price">${data.pricing.min_price}</span> . ${data.pricing.description}`);
            updateElement('cta-bottom-title', 'text', data.cta_bottom.title);
            updateElement('cta-bottom-subtitle', 'text', data.cta_bottom.subtitle);

            // 2. Render Lists
            renderList(data.usps, '[data-js-hook="usp-list"]', createUSPTemplate);
            renderList(data.programs, '[data-js-hook="program-list"]', createProgramTemplate);
            renderList(data.testimonials, '[data-js-hook="testimonial-list"]', createTestimonialTemplate);
            renderList(data.faq, '[data-js-hook="faq-list"]', createFAQTemplate);

            // 3. Render WhatsApp CTAs
            updateElement('whatsapp-cta', 'href', waLink);
            updateElement('whatsapp-cta-float', 'href', waLink);

            // 4. Initialize UI Interactions
            initFAQAccordion();
            initStickyNavbar();
            initScrollReveal();

        } catch (error) {
            console.error('Failed to load or process index data:', error);
            // Fallback for critical CTAs if data load fails
            updateElement('whatsapp-cta', 'href', generateWhatsAppLink());
            updateElement('whatsapp-cta-float', 'href', generateWhatsAppLink());
        }
    };

    // --- UI Interactions ---

    /**
     * Initializes the FAQ accordion functionality.
     */
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

            // Close all first (optional: keep open for multiple)
            document.querySelectorAll('.faq-item.active').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    item.querySelector('.faq-answer').style.maxHeight = null;
                    item.querySelector('i').classList.replace('fa-chevron-up', 'fa-chevron-down');
                }
            });

            // Toggle current item
            if (isOpen) {
                faqItem.classList.remove('active');
                answer.style.maxHeight = null;
                icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
            } else {
                faqItem.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px"; // Dynamic height
                icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
            }
        });
    };


    /**
     * Initializes the sticky navbar functionality.
     */
    const initStickyNavbar = () => {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        const handleScroll = () => {
            // Cek apakah posisi scroll lebih dari 50px
            if (window.scrollY > 50) {
                navbar.classList.add('sticky');
            } else {
                navbar.classList.remove('sticky');
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
    };


    /**
     * Initializes basic Scroll Reveal functionality using the 'in-view' class.
     */
    const initScrollReveal = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target); // Stop observing once revealed
                }
            });
        }, {
            threshold: 0.1 // Reveal when 10% of element is visible
        });

        document.querySelectorAll('[data-js-hook="scroll-reveal"]').forEach(element => {
            observer.observe(element);
        });
    };

    // --- Execution ---
    initContent();
});

// Blog specific JS (optional, but good practice for modularity)
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('page-blog')) {
        const BLOG_DATA_URL = 'data/blog.json';

        const createBlogCardTemplate = (article) => `
            <article class="blog-card" data-js-hook="scroll-reveal">
                <div class="card-thumbnail" style="background-image: url('assets/images/${article.thumbnail}');"></div>
                <div class="card-content">
                    <span class="card-category"><i class="fa-solid fa-tag"></i> ${article.category}</span>
                    <a href="#${article.slug}" class="card-title-link">
                        <h3>${article.title}</h3>
                    </a>
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

                // Re-init scroll reveal for the newly rendered cards
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('in-view');
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });

                document.querySelectorAll('.blog-card').forEach(element => {
                    observer.observe(element);
                });

            } catch (error) {
                console.error('Error rendering blog list:', error);
                container.innerHTML = '<p class="error-message">Gagal memuat artikel blog. Silakan coba lagi nanti.</p>';
            }
        };

        renderBlogList();
    }
});