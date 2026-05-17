export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/plain');
  const { type, api_key, domain } = req.query;
  if (!type || !api_key || !domain) return res.status(400).send('0');
  try {
    const r = await fetch(`https://jio-lottery.online/User/api/wingo.php?type=${encodeURIComponent(type)}&api_key=${encodeURIComponent(api_key)}&domain=${encodeURIComponent(domain)}`);
    res.send((await r.text()).trim());
  } catch { res.send('0'); }
}
