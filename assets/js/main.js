document.addEventListener('DOMContentLoaded', async () => {

    // --- 1. DATA KONTEN UTAMA (SIMULASI PEMUATAN home.json) ---
    // Menggunakan data JSON yang Anda berikan
    const dataContent = {
        "brand": {
            "name": "Bimbel Edumag",
            "tagline": "Belajar jadi lebih mudah dan menyenangkan",
            "whatsappNumber": "6285134913931", // Dibuat tanpa "+" di depan
            "whatsappMessage": "Halo Admin Bimbel Edumag, saya ingin konsultasi belajar."
        },
        "hero": {
            "headline": "Siap Sukses Belajar? Metode Edumag MasterKey Antar Siswa Capai Nilai Terbaik.",
            "subHeadline": "Bimbel Edumag: Fokus pada kebutuhan siswa, kelas kecil, dan pengembangan diri. Kami tidak hanya mengajar, kami membentuk juara."
        },
        "about": {
            "title": "Kenali Lebih Dekat Edumag: Tempat Belajar Paling Efektif",
            "content": "Didirikan dengan visi membentuk generasi unggul, Bimbel Edumag fokus pada kualitas pembelajaran. Kami percaya bahwa setiap siswa memiliki potensi unik. Melalui metode MasterKey, kami mengoptimalkan proses belajar dengan pendekatan personal, memastikan materi terserap maksimal dan minat belajar tumbuh secara alami."
        },
        "usp": [
            { "icon": "fa-user-graduate", "title": "Bimbel Berorientasi Siswa", "description": "Kurikulum adaptif sesuai gaya belajar tiap anak. Bukan hanya target nilai, tapi penguatan pondasi akademik." },
            { "icon": "fa-key", "title": "Metode Edumag MasterKey", "description": "Sistem belajar teruji yang memecahkan kesulitan inti materi. Lebih cepat paham, lebih lama ingat." },
            { "icon": "fa-users", "title": "Kelas Maksimal 13 Siswa", "description": "Fokus pengajar lebih terjamin. Siswa lebih aktif bertanya dan mendapat perhatian penuh. Kualitas, bukan kuantitas." },
            { "icon": "fa-hands-helping", "title": "Program Soft Skill Semesteran", "description": "Mengembangkan kemampuan non-akademik: public speaking, leadership, dan time management. Persiapan total menuju masa depan." }
        ],
        // Menambahkan ikon untuk Program, sesuai permintaan Anda.
        "programs": [
            { "icon": "fa-child", "level": "Kelas Reguler SD", "description": "Fondasi akademik kuat dengan metode belajar bermain. Fokus pada Calistung dan Sains Dasar." },
            { "icon": "fa-calculator", "level": "Kelas Reguler SMP", "description": "Penguatan mata pelajaran UN/AKM dan kurikulum terbaru. Persiapan intensif untuk masuk SMA favorit." },
            { "icon": "fa-flask", "level": "Kelas Reguler SMA", "description": "Fokus pada persiapan UTBK/SNBT dan pendalaman materi jurusan (IPA/IPS). Tryout berkala & strategi masuk PTN." },
            { "icon": "fa-user-lock", "level": "Kelas Privat (Semua Jenjang)", "description": "Bimbingan 1-on-1 dengan pengajar senior Edumag. Jadwal fleksibel dan materi sangat personal." }
        ],
        "pricing": {
            "startPrice": "Rp 150.000",
            "note": "Silakan konsultasikan kebutuhan belajar Anda untuk mendapatkan detail harga yang paling akurat."
        },
        "testimonials": [
            { "text": "Semenjak di Edumag, anak saya jadi lebih semangat belajar dan nilainya naik drastis. Metode MasterKey-nya benar-benar efektif!", "name": "Bapak Rahmat (Orang Tua Siswa)" },
            { "text": "Belajar di sini tidak kaku. Soft skill class-nya juga bantu saya lebih percaya diri saat presentasi di sekolah.", "name": "Citra Lestari (Siswa SMA)" }
        ],
        "faq": [
            { "question": "Apa itu Metode Edumag MasterKey?", "answer": "MasterKey adalah metode belajar khas Edumag yang berfokus pada pemahaman konsep dasar (core concept) sebelum masuk ke variasi soal. Ini memastikan siswa memiliki fondasi yang kuat, sehingga kesulitan belajar dapat diatasi secara tuntas." },
            { "question": "Berapa kapasitas maksimal siswa dalam satu kelas?", "answer": "Kami membatasi maksimal 13 siswa per kelas reguler. Tujuannya adalah memastikan setiap siswa mendapatkan perhatian yang cukup dari pengajar dan suasana belajar tetap kondusif." },
            { "question": "Apakah Edumag menyediakan kelas privat?", "answer": "Ya, kami menyediakan layanan Kelas Privat dengan sistem 1-on-1. Materi, waktu, dan pengajar dapat disesuaikan dengan kebutuhan spesifik siswa." }
        ]
    };

    // --- Helper Function: Update Semua Link WhatsApp ---
    function updateWaLinks(waNumber, waMessage) {
        const waBase = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

        // Update Floating Button
        document.getElementById('wa-float').href = waBase;

        // Update Nav Link
        document.getElementById('wa-nav-btn').href = waBase;

        // Update Hero CTA
        document.getElementById('wa-hero-btn').href = waBase;

        // Update Pricing CTA
        document.getElementById('wa-pricing-btn').href = waBase;

        // Update Final CTA
        document.getElementById('wa-cta-btn').href = waBase;

        // Update Footer Link
        const waFooter = document.getElementById('wa-footer-link');
        waFooter.href = waBase;
        waFooter.innerHTML = `<i class="fab fa-whatsapp"></i> +${waNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3')}`; // Format nomor
    }

    // --- 2. FUNGSI RENDER & INJEKSI DATA ---

    function renderStaticContent() {
        // Hero, About, Pricing
        document.getElementById('hero-headline').textContent = dataContent.hero.headline;
        document.getElementById('hero-subheadline').textContent = dataContent.hero.subHeadline;
        document.getElementById('about-title').textContent = dataContent.about.title;
        document.getElementById('about-content').textContent = dataContent.about.content;
        document.getElementById('pricing-value').textContent = dataContent.pricing.startPrice;
        document.getElementById('pricing-note').textContent = dataContent.pricing.note;
        document.getElementById('footer-tagline').textContent = dataContent.brand.tagline;

        // About Section Icon text correction (MasterKey is new focus)
        const aboutIconText = document.querySelector('#about .card-pop p');
        if (aboutIconText) {
            aboutIconText.textContent = '#MetodeMasterKey';
        }

        // Update semua link WA
        updateWaLinks(dataContent.brand.whatsappNumber, dataContent.brand.whatsappMessage);
    }


    // Fungsi untuk merender USP (Swiper)
    function renderUSP(uspArray) {
        const uspListContainer = document.getElementById('usp-list');
        uspListContainer.innerHTML = uspArray.map((item, index) => `
            <div class="usp-item card-pop swiper-slide text-center" 
                data-aos="zoom-in-up" 
                data-aos-delay="${index * 150}"> 
                <i class="fas ${item.icon}"></i>
                <h4>${item.title}</h4>
                <p>${item.description}</p>
            </div>
        `).join('');

        new Swiper('.swiper-usp-container', {
            slidesPerView: 1,
            spaceBetween: 20,
            pagination: {
                el: '.swiper-usp-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 4,
                    spaceBetween: 30,
                    allowTouchMove: false,
                }
            }
        });
    }

    // Fungsi untuk merender Programs (Swiper - Menggunakan ICON)
    function renderPrograms(programArray) {
        const programListContainer = document.getElementById('programs-list');
        programListContainer.innerHTML = programArray.map((item, index) => `
            <div class="program-card card-pop swiper-slide"
                data-aos="flip-up"
                data-aos-delay="${index * 150}">
                
                <i class="fas ${item.icon}"></i> 
                
                <div class="card-content">
                    <h4>${item.level}</h4>
                    <p>${item.description}</p>
                </div>
            </div>
        `).join('');

        new Swiper('.swiper-programs-container', {
            slidesPerView: 1,
            spaceBetween: 20,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-programs-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 4,
                    spaceBetween: 30,
                    allowTouchMove: false,
                }
            }
        });
    }

    // Fungsi untuk merender Testimonials (Swiper)
    function renderTestimonials(testimonialArray) {
        const testimonialListContainer = document.getElementById('testimonials-list');
        testimonialListContainer.innerHTML = testimonialArray.map((item, index) => `
            <div class="testimonial-card card-pop swiper-slide"
                data-aos="fade-up"
                data-aos-delay="${index * 100}">
                <p><i class="fas fa-quote-left"></i> ${item.text}</p>
                <p><strong>- ${item.name}</strong></p>
            </div>
        `).join('');

        new Swiper('.swiper-testimonials-container', {
            slidesPerView: 1,
            spaceBetween: 20,
            pagination: {
                el: '.swiper-testimonials-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                    allowTouchMove: false,
                }
            }
        });
    }

    // Fungsi untuk merender FAQ (Accordion)
    function renderFAQ(faqArray) {
        const faqList = document.getElementById('faq-list');
        faqList.innerHTML = faqArray.map((item, index) => `
            <div class="faq-item" data-aos="fade-up" data-aos-delay="${index * 50}">
                <div class="faq-question" data-index="${index}">
                    <span>${item.question}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>${item.answer}</p>
                </div>
            </div>
        `).join('');

        // Logika Accordion
        faqList.addEventListener('click', (e) => {
            const question = e.target.closest('.faq-question');
            if (question) {
                const answer = question.nextElementSibling;
                const icon = question.querySelector('i');
                const isOpen = question.classList.contains('active');

                // Tutup semua kecuali yang diklik
                document.querySelectorAll('.faq-question').forEach(q => {
                    q.classList.remove('active');
                    q.nextElementSibling.classList.remove('open');
                    q.nextElementSibling.style.maxHeight = null;
                    q.querySelector('i').style.transform = 'rotate(0deg)';
                });

                // Buka/Tutup yang diklik
                if (!isOpen) {
                    question.classList.add('active');
                    answer.classList.add('open');
                    answer.style.maxHeight = answer.scrollHeight + "px";
                    icon.style.transform = 'rotate(180deg)';
                }
            }
        });
    }

    // --- 3. EKSEKUSI UTAMA ---
    renderStaticContent();
    renderUSP(dataContent.usp);
    renderPrograms(dataContent.programs);
    renderTestimonials(dataContent.testimonials);
    renderFAQ(dataContent.faq);
});