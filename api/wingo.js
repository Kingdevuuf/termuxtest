export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Get 'wingo' parameter from query or POST body
  let game = req.query.wingo;
  
  if (!game && req.method === 'POST') {
    try {
      if (req.body) {
        game = req.body.wingo;
      }
    } catch (e) {
      // ignore
    }
  }
  
  game = game || '30s';
  
  // Game type mapping
  const gameMap = {
    '30s': 'WinGo_30S',
    '30sec': 'WinGo_30S',
    '1min': 'WinGo_1M',
    '1m': 'WinGo_1M',
    '3min': 'WinGo_3M',
    '3m': 'WinGo_3M',
    '5min': 'WinGo_5M',
    '5m': 'WinGo_5M'
  };
  
  if (!gameMap[game]) {
    return res.status(200).send('0');
  }
  
  const apiPath = gameMap[game];
  const apiUrl = `https://draw.ar-lottery01.com/WinGo/${apiPath}/GetHistoryIssuePage.json?ts=${Date.now()}`;
  
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data && data.data && data.data.list && data.data.list[0] && data.data.list[0].number) {
        return res.status(200).send(data.data.list[0].number);
      }
    }
    
    return res.status(200).send('0');
    
  } catch (error) {
    return res.status(200).send('0');
  }
}
