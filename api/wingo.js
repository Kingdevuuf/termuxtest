export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  let game = null;
  
  // Get from query string (GET request)
  if (req.query && req.query.wingo) {
    game = req.query.wingo;
  }
  
  // Get from POST body
  if (!game && req.method === 'POST') {
    try {
      // Handle JSON body
      if (req.body) {
        if (typeof req.body === 'object' && req.body.wingo) {
          game = req.body.wingo;
        } else if (typeof req.body === 'string') {
          const parsed = JSON.parse(req.body);
          if (parsed.wingo) game = parsed.wingo;
        }
      }
    } catch (e) {
      // Not JSON, try form data
      try {
        if (req.body && typeof req.body === 'string') {
          const params = new URLSearchParams(req.body);
          game = params.get('wingo');
        }
      } catch (e2) {
        // Ignore
      }
    }
  }
  
  game = game || '30s';
  
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
    // Use node-fetch or native fetch (Node 18+)
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      // Debug log (Vercel logs mein dikhega)
      console.log('API Response:', JSON.stringify(data));
      
      if (data && data.data && data.data.list && data.data.list[0] && data.data.list[0].number) {
        return res.status(200).send(data.data.list[0].number);
      }
    }
    
    return res.status(200).send('0');
    
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(200).send('0');
  }
}
