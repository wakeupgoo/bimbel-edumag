async function loadArticles() {
    const container = document.getElementById('article-list');
    if (!container) return;

    const username = 'wakeupgoo'; 
    const repo = 'bimbel-edumag';
    
    try {
        console.log("Mencoba mengambil artikel...");
        const response = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/public/_articles`);
        const files = await response.json();

        if (!Array.isArray(files) || files.length === 0) {
            container.innerHTML = '<p>Belum ada artikel.</p>';
            return;
        }

        container.innerHTML = ''; 

        for (const file of files) {
            if (file.name.endsWith('.md')) {
                const res = await fetch(file.download_url);
                const content = await res.text();
                
                // Parsing Judul
                const titleMatch = content.match(/title:\s*(.*)/);
                const title = titleMatch ? titleMatch[1].replace(/['"]/g, '') : file.name;
                
                // Parsing Thumbnail (Jika tidak ada, gunakan gambar default yang pasti jalan)
                const thumbMatch = content.match(/thumbnail:\s*(.*)/);
                let thumb = thumbMatch ? thumbMatch[1].replace(/['"]/g, '') : '';
                if (!thumb || thumb.trim() === "") {
                    thumb = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&q=80";
                }

                const card = document.createElement('div');
                // Menghapus 'reveal' untuk memastikan artikel langsung muncul tanpa menunggu animasi
                card.className = 'card'; 
                card.style.opacity = "1";
                card.style.transform = "none";
                card.style.border = "1px solid #ddd";
                card.style.padding = "15px";
                card.style.borderRadius = "10px";
                card.style.marginBottom = "20px";
                card.style.background = "#fff";

                card.innerHTML = `
                    <img src="${thumb}" alt="${title}" style="width:100%; height:200px; object-fit:cover; border-radius:8px; margin-bottom:10px;">
                    <h3 style="margin:10px 0; color:#333;">${title}</h3>
                    <p style="font-size:0.9rem; color:#666;">Klik di bawah untuk membaca teknik belajar yang efektif ini.</p>
                    <a href="artikel-detail.html?file=${file.name}" class="cta-btn" style="display:inline-block; margin-top:10px; padding:8px 20px; background:#f39c12; color:white; text-decoration:none; border-radius:5px;">Baca Selengkapnya</a>
                `;
                container.appendChild(card);
            }
        }
        console.log("Artikel berhasil dimunculkan ke layar!");
    } catch (error) {
        console.error("Kesalahan:", error);
        container.innerHTML = '<p>Gagal memuat artikel.</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadArticles);