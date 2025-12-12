export default function handler(req, res) {
  // Ambil Client ID dari Environment Variables Vercel
  const client_id = process.env.OAUTH_CLIENT_ID;

  // 1. Validasi: Jika Client ID kosong, beri peringatan yang jelas
  if (!client_id) {
    return res.status(500).send("Error: OAUTH_CLIENT_ID belum diatur di Environment Variables Vercel.");
  }

  // 2. Buat URL Authorize GitHub
  // scope=repo,user dibutuhkan agar Decap CMS bisa mengedit file di GitHub Anda
  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo,user`;

  // 3. Arahkan user ke halaman login GitHub
  res.redirect(githubUrl);
}