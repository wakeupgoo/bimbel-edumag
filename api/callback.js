export default async function handler(req, res) {
  const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

  const code = req.query.code;

  if (!code) {
    res.status(400).send("Missing code");
    return;
  }

  const tokenRes = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      }),
    }
  );

  const data = await tokenRes.json();

  if (!data.access_token) {
    res.status(500).json(data);
    return;
  }

  const html = `
<!doctype html>
<html>
  <body>
    <script>
      if (window.opener) {
        window.opener.postMessage(
          {
            provider: "github",
            token: "${data.access_token}"
          },
          "*"
        );
        window.close();
      }
    </script>
  </body>
</html>
`;

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
