export default function handler(req, res) {
  const client_id = process.env.OAUTH_CLIENT_ID;
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo,user`);
}