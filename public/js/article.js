const username = 'wakeupgoo';
const repo = 'bimbel-edumag';

document.addEventListener('DOMContentLoaded', () => {
    const detailContainer = document.getElementById('article-main-text');
    if (detailContainer) {
        loadDetail();
    } else {
        loadList();
    }
});

// FUNGSI LOAD DAFTAR ARTIKEL (DI INDEX)
async function loadList() {
    const container = document.getElementById('article-list');
    if (!container) return;

    try {
        const res = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/public/_articles`);
        const files = await res.json();

        container.innerHTML = '';
        for (const file of files) {
            if (file.name.endsWith('.md')) {
                const rawRes = await fetch(file.download_url);
                const text = await rawRes.text();

                const title = text.match(/title:\s*(.*)/)?.[1].replace(/['"]/g, '') || file.name;
                const thumb = text.match(/thumbnail:\s*(.*)/)?.[1].replace(/['"]/g, '') || 'assets/img/Hero.jpg';

                container.innerHTML += `
                    <div class="article-card reveal active">
                        <img src="${thumb}" class="article-thumb">
                        <div class="article-info">
                            <h3>${title}</h3>
                            <a href="artikel-detail.html?file=${file.name}" class="cta-btn">Baca</a>
                        </div>
                    </div>`;
            }
        }
    } catch (e) { console.error("Gagal muat list:", e); }
}

// FUNGSI LOAD ISI ARTIKEL (DI DETAIL)
async function loadDetail() {
    const params = new URLSearchParams(window.location.search);
    const fileName = params.get('file');

    if (!fileName) return;

    try {
        const res = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/public/_articles/${fileName}`);
        const data = await res.json();
        const content = atob(data.content);

        const parts = content.split('---');
        const meta = parts[1];
        const body = parts.slice(2).join('---');

        const title = meta.match(/title:\s*(.*)/)?.[1].replace(/['"]/g, '');
        const category = meta.match(/category:\s*(.*)/)?.[1];
        const thumb = meta.match(/thumbnail:\s*(.*)/)?.[1].replace(/['"]/g, '');

        document.getElementById('article-title').innerText = title;
        document.getElementById('article-category').innerText = category;
        document.getElementById('article-image').src = thumb;
        document.getElementById('article-main-text').innerHTML = marked.parse(body);

        document.getElementById('loading-status').style.display = 'none';
        document.getElementById('article-content').style.display = 'block';
    } catch (e) { console.error("Gagal muat artikel:", e); }
}