const ytdl = require('ytdl-core');

export default async function handler(req, res) {
  // Sirf POST requests allow
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, quality = 'highest' } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Validate YouTube URL
  if (!ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  try {
    // Video info fetch karo
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');

    // Quality mapping
    let format;
    if (quality === 'highest') {
      format = info.formats.find(f => f.hasVideo && f.hasAudio && f.qualityLabel === '1080p') ||
               info.formats.find(f => f.hasVideo && f.hasAudio);
    } else if (quality === 'audio') {
      format = info.formats.find(f => f.hasAudio && !f.hasVideo);
    } else {
      format = info.formats.find(f => f.qualityLabel === quality && f.hasVideo && f.hasAudio);
    }

    if (!format) {
      return res.status(404).json({ error: 'No suitable format found' });
    }

    // Response headers set karo for download
    res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);
    res.setHeader('Content-Type', 'video/mp4');

    // Stream the video
    const stream = ytdl(url, { format });
    stream.pipe(res);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Download failed: ' + error.message });
  }
}
