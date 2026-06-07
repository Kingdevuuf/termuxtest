#!/bin/bash

# Update system and install yt-dlp + ffmpeg
echo "📦 Installing yt-dlp and ffmpeg..."
apt-get update -qq
apt-get install -y -qq yt-dlp ffmpeg

# Verify installation
echo "✅ yt-dlp version:"
yt-dlp --version

echo "✅ ffmpeg version:"
ffmpeg -version | head -1

# Start the Node.js server
echo "🚀 Starting server..."
node api/download.js
