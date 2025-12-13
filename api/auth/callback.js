export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    res.status(400).send("Missing code");
    return;
  }

  const tokenRes = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      })
    }
  );

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    res.status(500).send("Failed to obtain access token");
    return;
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(`
<!doctype html>
<html>
  <body>
    <script>
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "authorization_response",
            provider: "github",
            token: "${tokenData.access_token}"
          },
          window.location.origin
        );
        window.close();
      }
    </script>
  </body>
</html>
  `);
}
