export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    res.status(400).send("Missing code");
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
            code: "${code}"
          },
          "*"
        );
        window.close();
      }
    </script>
  </body>
</html>
  `);
}
