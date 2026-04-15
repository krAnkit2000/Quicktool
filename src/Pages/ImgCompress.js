import React, { useState, useEffect } from 'react';

const ImgCompress = ({ setActiveTool }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); 
  const [compressedUrl, setCompressedUrl] = useState(null);
  
  // Compression states
  const [quality, setQuality] = useState(70); // Default 70% quality
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);

  // Helper function to display file size in KB/MB.
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setOriginalSize(selectedFile.size);
      
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      setCompressedUrl(null); 
      setCompressedSize(0);
    }
  };

  // Memory clean up
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // If the user changes the slider, then remove the previously compressed file.
  const handleQualityChange = (e) => {
    setQuality(e.target.value);
    setCompressedUrl(null);
  };

  // Asli Compress Logic
  const handleCompress = () => {
    if (!file || !previewUrl) return;
    setIsCompressing(true);

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      // White background fill 
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      //Format the quality between 0.1 and 1.0 (the slider ranges from 1 to 100).
      const compressionRatio = quality / 100;
      
      // Compression works best on JPEG or WEBP.
      const dataUrl = canvas.toDataURL('image/jpeg', compressionRatio);
      
      // Calculate approximate file size from a Base64 string.

      const base64Length = dataUrl.length - 'data:image/jpeg;base64,'.length;
      const sizeInBytes = Math.ceil(base64Length * 0.75);
      
      setCompressedSize(sizeInBytes);
      setCompressedUrl(dataUrl);
      setIsCompressing(false);
    };

    img.src = previewUrl;
  };

  const getDownloadFileName = () => {
    if (!file) return 'compressed_image.jpg';
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    return `${nameWithoutExt}_compressed.jpg`;
  };
  

  return (
    <div className="converter-container">
      {/* Back Button */}
      <button onClick={() => setActiveTool('dashboard')} className="back-btn">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </button>

      <h2 className="converter-title" style={{ textAlign: 'center' }}>Image Compressor</h2>

      {/* Upload Area  */}
      <div className="upload-box" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input 
          type="file" 
          accept=".png, .jpg, .jpeg, .webp, .heic"
          onChange={handleFileChange}
          className="upload-input" 
          title="Click to change image"
        />
        
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt="Preview" 
            style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'contain', marginBottom: '15px', borderRadius: '8px', zIndex: 1 }} 
          />
        ) : (
          <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        )}

        <p className="upload-text" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90%', zIndex: 1 }}>
          {file ? `${file.name} (${formatBytes(originalSize)})` : "Click to upload image to compress"}
        </p>
      </div>

      {/* Settings & Controls */}
      <div className="settings-bar" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '1.5rem' }}>
        
        {/* Quality Slider Section */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label style={{ fontWeight: '600', color: '#334155' }}>Image Quality: {quality}%</label>
            {compressedSize > 0 && (
              <span style={{ color: '#10b981', fontWeight: '600' }}>
                New Size: {formatBytes(compressedSize)}
              </span>
            )}
          </div>
          <input 
            type="range" 
            min="10" 
            max="100" 
            value={quality} 
            onChange={handleQualityChange}
            style={{ width: '100%', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
            <span>Smaller File (Low Quality)</span>
            <span>Larger File (High Quality)</span>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          {compressedUrl ? (
            <a 
              href={compressedUrl} 
              download={getDownloadFileName()} 
              className="convert-btn"
              style={{ textDecoration: 'none', display: 'inline-block', backgroundColor: '#10b981', textAlign: 'center' }} 
            >
              Download Compressed Image
            </a>
          ) : (
            <button 
              className="convert-btn" 
              onClick={handleCompress}
              disabled={!file || isCompressing}
            >
              {isCompressing ? 'Compressing...' : 'Compress Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImgCompress;