import React, { useState } from 'react';
import { BG_CONFIG } from '../bgAPI'; 

const ImgBgRemove = ({ setActiveTool }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [removedBgUrl, setRemovedBgUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [bgColor, setBgColor] = useState(''); 

  const handleFileChange = (e) => {
    setError('');
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setRemovedBgUrl(null);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const removeBackground = async () => {
    if (!file) return;
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image_file', file); // Sending original file for Max Quality
      formData.append('size', 'auto');
      
      // Agar user ne color choose kiya hai toh API ko bhejein
      if (bgColor) {
        formData.append('bg_color', bgColor);
      }

      const response = await fetch(BG_CONFIG.API_ENDPOINT, {
        method: 'POST',
        headers: { 'X-Api-Key': BG_CONFIG.API_KEY },
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
    } finally {
      setIsLoading(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setPreviewUrl(null);
    setRemovedBgUrl(null);
    setBgColor('');
    setError('');
  };

  return (
    <div className="converter-container" style={{ maxWidth: '600px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <button onClick={() => setActiveTool('dashboard')} className="back-btn">← Back</button>
        <button onClick={resetAll} className="reset-btn" style={{background:'#fee2e2', color:'#dc2626', border:'none', padding:'5px 12px', borderRadius:'6px', cursor:'pointer', fontWeight:'600'}}>Reset</button>
      </div>

      <h2 className="converter-title" style={{textAlign:'center', marginBottom:'15px'}}>AI Background Remover</h2>

      {error && <div style={{backgroundColor:'#fee2e2', color:'#ef4444', padding:'10px', borderRadius:'8px', marginBottom:'15px', textAlign:'center'}}>{error}</div>}

      <div className="upload-box" style={{ 
          minHeight: '250px', 
          display:'flex', 
          alignItems:'center', 
          justifyContent:'center', 
          border:'2px dashed #e2e8f0',
          borderRadius:'12px',
          background: previewUrl ? '#f8fafc' : '#fff'
      }}>
        <input type="file" accept="image/*" onChange={handleFileChange} className="upload-input" />
        
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" style={{ 
              maxHeight: '240px', 
              maxWidth: '90%', 
              objectFit: 'contain',
            
              backgroundImage: !bgColor ? 'conic-gradient(#cbd5e1 90deg, #fff 90deg 180deg, #cbd5e1 180deg 270deg, #fff 270deg)' : 'none',
              backgroundSize: '20px 20px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }} />
        ) : (
          <div style={{textAlign:'center', color:'#64748b'}}>
             <span style={{fontSize:'40px'}}>🖼️</span>
             <p>Click to upload an image</p>
          </div>
        )}
      </div>

      {/* Background Options */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p style={{ fontWeight: '600', marginBottom: '10px', color:'#475569' }}>Select Background Color:</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { label: 'Transparent', color: '' },
            { label: 'White', color: '#FFFFFF' },
            { label: 'Blue', color: '#3B82F6' },
            { label: 'Red', color: '#EF4444' },
            { label: 'Green', color: '#22C55E' },
            { label: 'Black', color: '#000000' }
          ].map((opt) => (
            <button
              key={opt.label}
              onClick={() => { setBgColor(opt.color); setRemovedBgUrl(null); }}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                border: bgColor === opt.color ? '2px solid #8b5cf6' : '1px solid #e2e8f0',
                background: opt.color || '#f1f5f9',
                cursor: 'pointer',
                fontSize: '0.8rem',
                color: opt.color === '#000000' ? '#fff' : '#1e293b'
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-bar" style={{ justifyContent: 'center', marginTop: '25px' }}>
        {removedBgUrl ? (
          <a href={removedBgUrl} download="mytools_removed_bg.png" className="convert-btn" style={{ backgroundColor: '#10b981', textDecoration:'none', textAlign:'center', width:'100%' }}>
            Download 
          </a>
        ) : (
          <button className="convert-btn" onClick={removeBackground} disabled={!file || isLoading} style={{ width: '100%' }}>
            {isLoading ? 'Processing High Quality...' : `Remove & Set ${bgColor ? 'Color' : 'Transparent'}`}
          </button>
        )}
      </div>
    </div>
  );
};

export default ImgBgRemove;