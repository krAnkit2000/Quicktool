import React, { useState } from 'react';
import { BG_CONFIG } from '../bgAPI'; 

const ImgBgRemove = ({ setActiveTool }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [removedBgUrl, setRemovedBgUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setError('');
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setRemovedBgUrl(null);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }
  };

  // NAYA: Badi image ko resize karne ka function
  const resizeImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Agar image 2000px se badi hai toh use chota karo (API limit fix)
          const MAX_WIDTH = 2000;
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/jpeg', 0.8); // 80% quality compress
        };
      };
    });
  };

  const removeBackground = async () => {
    if (!file) return;
    setIsLoading(true);
    setError('');

    try {
      // 1. Image ko pehle compress/resize karo
      const processedBlob = await resizeImage(file);

      const formData = new FormData();
      formData.append('image_file', processedBlob, "image.jpg");
      formData.append('size', 'auto');

      // 2. API Call
      const response = await fetch(BG_CONFIG.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'X-Api-Key': BG_CONFIG.API_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors[0].title || 'API Error');
      }

      const blob = await response.blob();
      const resultUrl = URL.createObjectURL(blob);
      setRemovedBgUrl(resultUrl);
      setPreviewUrl(resultUrl);

    } catch (err) {
      setError(err.message || 'Error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="converter-container">
      <button onClick={() => setActiveTool('dashboard')} className="back-btn">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width:'20px', marginRight:'5px'}}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </button>

      <h2 className="converter-title" style={{textAlign:'center'}}>AI Background Remover</h2>

      {error && (
        <div style={{backgroundColor:'#fee2e2', color:'#ef4444', padding:'10px', borderRadius:'8px', marginBottom:'15px', textAlign:'center'}}>
          {error} (Try a smaller image if resizing fails)
        </div>
      )}

      <div className="upload-box" style={{ minHeight: '250px', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <input type="file" accept="image/*" onChange={handleFileChange} className="upload-input" />
        
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" style={{ 
              maxHeight: '220px', 
              maxWidth: '100%', 
              objectFit: 'contain',
              backgroundImage: 'conic-gradient(#f1f5f9 90deg, #ffffff 90deg 180deg, #f1f5f9 180deg 270deg, #ffffff 270deg)',
              backgroundSize: '20px 20px',
              borderRadius: '8px'
          }} />
        ) : (
          <p className="upload-text">Click to upload portrait</p>
        )}
      </div>

      <div className="settings-bar" style={{ justifyContent: 'center', marginTop: '20px' }}>
        {removedBgUrl ? (
          <a href={removedBgUrl} download="removed_bg.png" className="convert-btn" style={{ backgroundColor: '#10b981' }}>
            Download Result
          </a>
        ) : (
          <button className="convert-btn" onClick={removeBackground} disabled={!file || isLoading}>
            {isLoading ? 'Processing (Compressing & Removing)...' : 'Remove Background'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ImgBgRemove;