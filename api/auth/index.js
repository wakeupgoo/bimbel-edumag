// api/auth/index.js
// Minimal OAuth proxy for Decap CMS on Vercel
// Env vars required: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, OAUTH_CALLBACK_URL, REPO

export default async function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const pathname = url.pathname.replace(/\/$/, ""); // /api/auth or /api/auth/callback

  const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
  const CALLBACK = process.env.OAUTH_CALLBACK_URL; // e.g. https://bimbeledumag.my.id/api/auth/callback
  const REPO = process.env.REPO; // e.g. wakeupgoo/bimbel-edumag

  if (!CLIENT_ID || !CLIENT_SECRET || !CALLBACK || !REPO) {
    res.status(500).send("Missing required env vars (GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, OAUTH_CALLBACK_URL, REPO)");
    return;
  }

  // Route: /api/auth         -> redirect user to GitHub authorize page
  // Route: /api/auth/callback -> exchange code for access token and postMessage back to opener

  if (pathname.endsWith("/api/auth") || pathname.endsWith("/api/auth/")) {
    const state = Math.random().toString(36).slice(2); // not persisted here; optional enhancement
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: CALLBACK,
      scope: "repo", // decap needs repo access for commits (public/private depending repo)
      state,
      allow_signup: "false"
    });
    const githubAuth = `https://github.com/login/oauth/authorize?${params.toString()}`;
    res.writeHead(302, { Location: githubAuth });
    res.end();
    return;
  }

  if (pathname.endsWith("/api/auth/callback")) {
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code) {
      res.status(400).send("Missing code");
      return;
    }

    try {
      // Exchange code for access token
      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code,
          redirect_uri: CALLBACK,
          state
        })
      });

      const tokenJson = await tokenRes.json();
      if (!tokenJson || tokenJson.error || !tokenJson.access_token) {
        console.error("token error", tokenJson);
        res.status(500).send("Failed to obtain access_token from GitHub");
        return;
      }

      const access_token = tokenJson.access_token;

      // Option A: Post message back to opener (popup flow)
      // Decap CMS expects the popup to return the token to the opener window.
      // We render a tiny HTML that posts the token to window.opener and self-closes.
      const html = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>Authentication complete</title>
  </head>
  <body>
    <script>
      (function () {
        function receiveMessage(e) {
          // no-op placeholder
        }
        // send token to opener (Decap CMS listens for this)
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'authorization_response',
              provider: 'github',
              token: '${access_token}',
              repo: '${REPO}'
            },
            '*'
          );
          window.close();
        } else {
          // fallback: show token so user can copy (not ideal)
          document.body.innerText = 'Token: ${access_token}';
        }
      })();
    </script>
  </body>
</html>
      `.trim();

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.statusCode = 200;
      res.end(html);
      return;

    } catch (err) {
      console.error(err);
      res.status(500).send("Internal error during OAuth callback");
      return;
    }
  }

  res.status(404).send("Not found");
}
