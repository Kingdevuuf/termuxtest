const { exec } = require('child_process');
const { promisify } = require('util');
const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');

const execPromise = promisify(exec);
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

// yt-dlp binary path (will be downloaded on first run)
const YTDLP_PATH = path.join('/tmp', 'yt-dlp');
let downloadInProgress = false;

// Download yt-dlp binary if not exists
async function ensureYtDlp() {
    if (fs.existsSync(YTDLP_PATH)) {
        return true;
    }
    
    // Wait if download already in progress
    if (downloadInProgress) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return ensureYtDlp();
    }
    
    downloadInProgress = true;
    
    return new Promise((resolve, reject) => {
        const url = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux';
        const file = fs.createWriteStream(YTDLP_PATH);
        
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                fs.chmodSync(YTDLP_PATH, '755'); // Execute permission
                downloadInProgress = false;
                resolve(true);
            });
        }).on('error', (err) => {
            fs.unlinkSync(YTDLP_PATH);
            downloadInProgress = false;
            reject(err);
        });
    });
}

function detectPlatform(url) {
    const platforms = {
        'youtube': ['youtube.com', 'youtu.be'],
        'instagram': ['instagram.com', 'instagr.am'],
        'facebook': ['facebook.com', 'fb.watch'],
        'twitter': ['twitter.com', 'x.com'],
        'reddit': ['reddit.com', 'redd.it'],
        'tiktok': ['tiktok.com'],
        'linkedin': ['linkedin.com'],
        'twitch': ['twitch.tv'],
        'vimeo': ['vimeo.com']
    };
    for (const [platform, domains] of Object.entries(platforms)) {
        if (domains.some(d => url.includes(d))) return platform;
    }
    return 'unknown';
}

async function getDirectVideoUrl(url) {
    await ensureYtDlp();
    
    try {
        // Use downloaded binary directly - no installation needed!
        const command = `${YTDLP_PATH} -f "best[ext=mp4]/best" -g --no-warnings "${url}"`;
        const { stdout, stderr } = await execPromise(command, { timeout: 30000 });
        
        if (stderr && !stdout) throw new Error(stderr);
        const directUrl = stdout.trim().split('\n')[0];
        if (!directUrl || directUrl === 'ERROR') throw new Error('No video URL found');
        return directUrl;
    } catch (error) {
        throw new Error(`Failed: ${error.message}`);
    }
}

async function getMetadata(url) {
    await ensureYtDlp();
    
    try {
        const command = `${YTDLP_PATH} -j --no-warnings "${url}"`;
        const { stdout } = await execPromise(command, { timeout: 30000 });
        const data = JSON.parse(stdout);
        return {
            title: data.title,
            duration: data.duration,
            thumbnail: data.thumbnail,
            uploader: data.uploader,
            platform: data.extractor_key
        };
    } catch (error) {
        return null;
    }
}

// GET endpoint
app.get('/api/download', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ success: false, error: 'URL required' });
    if (!url.startsWith('http')) return res.status(400).json({ success: false, error: 'Invalid URL' });

    try {
        const directUrl = await getDirectVideoUrl(url);
        const metadata = await getMetadata(url);
        res.json({
            success: true,
            platform: detectPlatform(url),
            direct_url: directUrl,
            metadata: metadata
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST endpoint
app.post('/api/download', async (req, res) => {
    const url = req.body.url;
    if (!url) return res.status(400).json({ success: false, error: 'URL required' });

    try {
        const directUrl = await getDirectVideoUrl(url);
        const metadata = await getMetadata(url);
        res.json({
            success: true,
            platform: detectPlatform(url),
            direct_url: directUrl,
            metadata: metadata
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'OK', message: 'Video Download API is running' });
});

module.exports = app;

if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
}
