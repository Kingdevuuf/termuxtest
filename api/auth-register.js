export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const qs = new URLSearchParams(req.query).toString();
    const url = `https://jio-lottery.online/User/api/register.php${qs?'?'+qs:''}`;
    const init = { method: req.method, headers: { 'Content-Type': 'application/json' } };
    if (req.headers.authorization) init.headers.Authorization = req.headers.authorization;
    if (req.method !== 'GET') init.body = JSON.stringify(req.body || {});
    const r = await fetch(url, init);
    const text = await r.text();
    res.status(r.status);
    try { res.json(JSON.parse(text)); } catch { res.send(text); }
  } catch (e) { res.status(500).json({ error: 'Proxy error' }); }
}
