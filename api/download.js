const { exec } = require('child_process');
const { promisify } = require('util');
const express = require('express');

const execPromise = promisify(exec);
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

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
    try {
        const command = `yt-dlp -f "best[ext=mp4]/best" -g --no-warnings "${url}"`;
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
    try {
        const command = `yt-dlp -j --no-warnings "${url}"`;
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

// For local testing
if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
}
