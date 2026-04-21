

  import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchUnsplashImages } from '../ImageGeneratorAPI';
import './ImageGenerator.css';

const ImageGenerator = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1); 
  const [error, setError] = useState('');
  const UNSPLASH_ACCESS_KEY = '';


const handleSearch = async (isNewSearch = true) => {
  if (!query) return;
  setIsSearching(true);
  setError('');
  
  const currentPage = isNewSearch ? 1 : page + 1;

  // API Call
  const result = await fetchUnsplashImages(query, currentPage);

  if (result.success) {
    if (isNewSearch) {
      setImages(result.data);
      setPage(1);
    } else {
      setImages(prev => [...prev, ...result.data]);
      setPage(currentPage);
    }
  } else {
    setError(result.msg);
  }
  setIsSearching(false);
};

  const downloadImage = async (imgUrl, downloadLocation, id) => {
    try {
      await fetch(`${downloadLocation}&client_id=${UNSPLASH_ACCESS_KEY}`);
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Unsplash_${id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      window.open(imgUrl, '_blank');
    }
  };

  return (
    <div className="main-container">
      <div className="main-header">
        <button onClick={() => navigate('/')} className="back-btn">← Back to Dashboard</button>
        <button onClick={() => {setQuery(''); setImages([]);}} className="refresh-btn">Clear</button>
      </div>

      <h2 className="title">HD Image Finder</h2>

      <div className="url-box-section art-border">
        <div className="input-wrapper">
          <span className="link-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search high-res images..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        
        <button 
          className={`convert-btn-main ${query ? 'active' : ''}`}
          onClick={() => handleSearch(true)}
          disabled={!query || isSearching}
        >
          {isSearching ? 'Searching...' : 'Search HD Images'}
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="image-grid">
        {images.map((img) => (
          <div key={img.id} className="art-card-modern">
            <div className="art-preview-modern">
              <img src={img.url} alt={img.alt} />
            </div>
            <button 
              onClick={() => downloadImage(img.url, img.downloadUrl, img.id)} 
              className="download-btn-premium"
            >
              📥 Download HD
            </button>
          </div>
        ))}
      </div>

      {/* GENERATE MORE BUTTON */}
      {images.length > 0 && !isSearching && (
        <div className="more-action-area">
          <button className="generate-more-btn" onClick={() => handleSearch(false)}>
            🔄 Load More Images
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;