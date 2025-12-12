export default async function handler(req, res) {
  const { code } = req.query;
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: process.env.OAUTH_CLIENT_ID,
      client_secret: process.env.OAUTH_CLIENT_SECRET,
      code,
    }),
  });
  const data = await response.json();
  res.send(`<html><body><script>
    window.opener.postMessage("authorization:github:success:${JSON.stringify({ token: data.access_token, provider: 'github' })}", "*");
    window.close();
  </script></body></html>`);
}