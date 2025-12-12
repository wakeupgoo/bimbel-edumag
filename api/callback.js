export default async function handler(req, res) {
  const { code } = req.query;
  try {
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
    const content = `
      <html><body><script>
        (function() {
          function recieveMessage(e) {
            window.opener.postMessage('authorization:github:success:${JSON.stringify({ token: data.access_token, provider: 'github' })}', e.origin);
            window.close();
          }
          window.addEventListener("message", recieveMessage, false);
          window.opener.postMessage("authorizing:github", "*");
        })()
      </script></body></html>`;
    res.setHeader('Content-Type', 'text/html');
    res.send(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}