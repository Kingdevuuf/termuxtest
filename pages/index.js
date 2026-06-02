import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('highest');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, quality }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Download failed');
      }

      // Create blob and trigger download
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'video.mp4';
      link.click();
      URL.revokeObjectURL(link.href);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎥 Video Downloader</h1>
      <p style={styles.subtitle}>YouTube videos download karo - Free & Fast</p>

      <form onSubmit={handleDownload} style={styles.form}>
        <input
          type="text"
          placeholder="YouTube URL paste karo..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={styles.input}
          required
        />

        <select
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
          style={styles.select}
        >
          <option value="highest">Best Quality (1080p)</option>
          <option value="720p">720p</option>
          <option value="480p">480p</option>
          <option value="360p">360p</option>
          <option value="audio">Only Audio (MP3)</option>
        </select>

        <button 
          type="submit" 
          disabled={loading}
          style={styles.button}
        >
          {loading ? 'Downloading... 🔄' : 'Download Video ⬇️'}
        </button>
      </form>

      {error && <p style={styles.error}>❌ {error}</p>}

      <div style={styles.info}>
        <p>⚠️ Sirf YouTube videos ke liye kaam karta hai</p>
        <p>💡 Instagram/TikTok ke liye alag API banana padega</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
  },
  title: {
    fontSize: '2.5rem',
    color: '#ff0000',
  },
  subtitle: {
    color: '#666',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '15px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    outline: 'none',
  },
  select: {
    padding: '12px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    backgroundColor: 'white',
  },
  button: {
    padding: '15px',
    fontSize: '18px',
    backgroundColor: '#ff0000',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: '20px',
  },
  info: {
    marginTop: '40px',
    padding: '15px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#666',
  },
};
