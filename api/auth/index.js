export default function handler(req, res) {
  const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const CALLBACK = process.env.OAUTH_CALLBACK_URL;

  if (!CLIENT_ID || !CALLBACK) {
    res.status(500).send("Missing env vars");
    return;
  }

  const state = Math.random().toString(36).slice(2);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: CALLBACK,
    scope: "repo",
    state,
    allow_signup: "false",
  });

  res.writeHead(302, {
    Location: `https://github.com/login/oauth/authorize?${params.toString()}`
  });
  res.end();
}
