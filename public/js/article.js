async function loadArticles() {
    const container = document.getElementById('article-list');
    if (!container) return;

    const username = 'wakeupgoo'; 
    const repo = 'bimbel-edumag';
    
    try {
        console.log("Mencoba mengambil artikel dari GitHub..."); // Cek di konsol
        const response = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/public/_articles`);
        const files = await response.json();

        console.log("Daftar file yang ditemukan:", files); // Lihat apa isinya

        if (!Array.isArray(files) || files.length === 0) {
            container.innerHTML = '<p style="text-align:center;">Belum ada artikel di folder _articles GitHub.</p>';
            return;
        }

        container.innerHTML = ''; 

        for (const file of files) {
            if (file.name.endsWith('.md')) {
                const res = await fetch(file.download_url);
                const content = await res.text();
                
                // Ambil Judul
                const titleMatch = content.match(/title:\s*(.*)/);
                const title = titleMatch ? titleMatch[1].replace(/['"]/g, '') : file.name;
                
                // Ambil Gambar (Thumbnail) dari metadata
                const thumbMatch = content.match(/thumbnail:\s*(.*)/);
                const thumb = thumbMatch ? thumbMatch[1].replace(/['"]/g, '') : 'https://via.placeholder.com/400x250?text=No+Image';

                const card = document.createElement('div');
                card.className = 'card reveal'; 
                card.innerHTML = `
                    <img src="${thumb}" alt="${title}" style="width:100%; border-radius:10px; margin-bottom:10px;">
                    <h3>${title}</h3>
                    <p>Tips belajar dari Bimbel EduMag...</p>
                    <a href="artikel-detail.html?file=${file.name}" class="cta-btn" style="padding: 5px 15px; font-size: 0.8rem; display: inline-block; margin-top: 10px; text-decoration: none;">Baca</a>
                `;
                container.appendChild(card);
            }
        }
    } catch (error) {
        console.error("Kesalahan fatal:", error);
        container.innerHTML = '<p>Gagal memuat daftar artikel.</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadArticles);