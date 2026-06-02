const express = require('express');
const ytdl = require('ytdl-core');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Frontend HTML serve karo
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Video Downloader - YouTube Downloader</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 10px;
            font-size: 28px;
        }
        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
            font-size: 14px;
        }
        input, select {
            width: 100%;
            padding: 12px 15px;
            margin: 10px 0;
            border: 2px solid #ddd;
            border-radius: 10px;
            font-size: 16px;
            transition: 0.3s;
        }
        input:focus, select:focus {
            outline: none;
            border-color: #667eea;
        }
        button {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 10px;
            transition: transform 0.2s;
        }
        button:hover {
            transform: scale(1.02);
        }
        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        .loading {
            display: none;
            text-align: center;
            margin-top: 20px;
            color: #667eea;
        }
        .error {
            background: #fee;
            color: #c00;
            padding: 12px;
            border-radius: 10px;
            margin-top: 20px;
            display: none;
        }
        .info {
            background: #f0f0f0;
            padding: 15px;
            border-radius: 10px;
            margin-top: 20px;
            font-size: 12px;
            color: #666;
            text-align: center;
        }
        .quality-selector {
            margin: 15px 0;
        }
        .quality-selector label {
            font-weight: bold;
            display: block;
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎥 Video Downloader</h1>
        <p class="subtitle">YouTube videos download karo - Free & Fast</p>
        
        <input type="text" id="url" placeholder="YouTube URL paste karo (e.g., https://youtube.com/watch?v=...)" />
        
        <div class="quality-selector">
            <label>📺 Quality:</label>
            <select id="quality">
                <option value="highest">Best Quality (1080p)</option>
                <option value="720p">720p HD</option>
                <option value="480p">480p</option>
                <option value="360p">360p</option>
                <option value="lowest">Lowest Quality</option>
                <option value="audio">Only Audio (MP3)</option>
            </select>
        </div>
        
        <button onclick="downloadVideo()" id="downloadBtn">⬇️ Download Video</button>
        
        <div class="loading" id="loading">
            ⏳ Processing... please wait
        </div>
        
        <div class="error" id="error"></div>
        
        <div class="info">
            ⚠️ Sirf YouTube videos ke liye kaam karta hai<br>
            💡 Agar 1080p download nahi ho raha, 720p try karo
        </div>
    </div>

    <script>
        async function downloadVideo() {
            const url = document.getElementById('url').value;
            const quality = document.getElementById('quality').value;
            const btn = document.getElementById('downloadBtn');
            const loading = document.getElementById('loading');
            const errorDiv = document.getElementById('error');
            
            if (!url) {
                showError('Please enter a YouTube URL');
                return;
            }
            
            // Validate YouTube URL
            if (!url.includes('youtube.com/watch') && !url.includes('youtu.be/')) {
                showError('Only YouTube URLs are supported');
                return;
            }
            
            btn.disabled = true;
            loading.style.display = 'block';
            errorDiv.style.display = 'none';
            
            try {
                const response = await fetch('/download', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url, quality })
                });
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Download failed');
                }
                
                // Get filename from Content-Disposition header
                const contentDisposition = response.headers.get('Content-Disposition');
                let filename = 'video.mp4';
                if (contentDisposition) {
                    const match = contentDisposition.match(/filename="?(.+)"?/);
                    if (match) filename = match[1];
                }
                
                // Download the file
                const blob = await response.blob();
                const downloadUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(downloadUrl);
                
            } catch (err) {
                showError(err.message);
            } finally {
                btn.disabled = false;
                loading.style.display = 'none';
            }
        }
        
        function showError(msg) {
            const errorDiv = document.getElementById('error');
            errorDiv.textContent = '❌ ' + msg;
            errorDiv.style.display = 'block';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }
    </script>
</body>
</html>
  `);
});

// Download API endpoint
app.post('/download', async (req, res) => {
  const { url, quality = 'highest' } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  
  // Validate YouTube URL
  if (!ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'Invalid YouTube URL. Only YouTube videos are supported.' });
  }
  
  try {
    // Get video info
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
    
    // Select format based on quality
    let format;
    const formats = info.formats;
    
    if (quality === 'highest') {
      // Try 1080p first, then fallback to best available
      format = formats.find(f => f.qualityLabel === '1080p' && f.hasVideo && f.hasAudio) ||
               formats.find(f => f.hasVideo && f.hasAudio);
    } else if (quality === '720p') {
      format = formats.find(f => f.qualityLabel === '720p' && f.hasVideo && f.hasAudio);
    } else if (quality === '480p') {
      format = formats.find(f => f.qualityLabel === '480p' && f.hasVideo && f.hasAudio);
    } else if (quality === '360p') {
      format = formats.find(f => f.qualityLabel === '360p' && f.hasVideo && f.hasAudio);
    } else if (quality === 'lowest') {
      format = formats.find(f => f.hasVideo && f.hasAudio);
    } else if (quality === 'audio') {
      format = formats.find(f => f.hasAudio && !f.hasVideo);
    }
    
    if (!format) {
      // Fallback: just get any video+audio format
      format = formats.find(f => f.hasVideo && f.hasAudio);
      if (!format) {
        return res.status(404).json({ error: 'No suitable format found' });
      }
    }
    
    // Set headers for download
    const ext = quality === 'audio' ? 'mp3' : 'mp4';
    res.setHeader('Content-Disposition', `attachment; filename="${title}.${ext}"`);
    res.setHeader('Content-Type', quality === 'audio' ? 'audio/mpeg' : 'video/mp4');
    
    // Stream the video
    const stream = ytdl(url, { format: format });
    stream.pipe(res);
    
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed: ' + error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📥 YouTube Video Downloader ready!`);
});
