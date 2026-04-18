import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMp3Data } from '../youtubeAPI'; 
import './VideoConverter.css';

const VideoToMp3 = () => {
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedData, setConvertedData] = useState(null);
  const [error, setError] = useState('');

  // YouTube ID Extract Logic
  const extractVideoID = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleConvert = async () => {
    const videoId = extractVideoID(videoUrl);
    
    if (!videoId) {
      setError("Please paste a valid YouTube link.");
      return;
    }

    setIsProcessing(true);
    setError('');
    setConvertedData(null);

    // Modular API Call from youtubeAPI.js
    const result = await fetchMp3Data(videoId);

    if (result.success) {
      setConvertedData({
        title: result.title,
        url: result.link
      });
    } else {
      setError(result.msg);
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="video-container">
      <div className="video-header">
        <button onClick={() => navigate('/')} className="back-btn">
          <span className="arrow">←</span> Back
        </button>
        <button 
          onClick={() => {setVideoUrl(''); setConvertedData(null); setError('');}} 
          className="refresh-btn"
        >
          Refresh
        </button>
      </div>

      <h2 className="video-title" style={{ color: '#7c3aed' }}>YouTube to MP3</h2>

      <div className="url-box-section">
        <div className="input-wrapper">
          <span className="link-icon">🎵</span>
          <input 
            type="text" 
            placeholder="Paste YouTube link here..." 
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>
        
        <button 
          className={`convert-btn-main ${videoUrl ? 'active' : ''}`}
          onClick={handleConvert}
          disabled={!videoUrl || isProcessing}
          style={videoUrl ? { background: '#7c3aed' } : {}}
        >
          {isProcessing ? 'Processing...' : 'Convert to MP3'}
        </button>
      </div>

      {error && <div className="error-box" style={{color: '#ef4444', textAlign: 'center', marginTop: '15px'}}>{error}</div>}

      {/* Compact & Premium Preview Section */}
      {convertedData && (
        <div className="result-card-modern">
          <p className="video-info-label" title={convertedData.title}>
            🎧 {convertedData.title}
          </p>
          
          <div className="audio-player-wrapper">
            <audio controls key={convertedData.url}>
              <source src={convertedData.url} type="audio/mpeg" />
              Your browser does not support audio.
            </audio>
          </div>

          <a 
            href={convertedData.url} 
            target="_blank" 
            rel="noreferrer"
            download 
            className="download-mp4-btn"
          >
            <svg style={{width:'20px', height:'20px', marginRight:'8px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Download MP3
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoToMp3;