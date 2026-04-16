import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import './MakePdf.css';

const MakePdf = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const details = navigator.userAgent;
      const regexp = /android|iphone|kindle|ipad/i;
      setIsMobile(regexp.test(details));
    };
    checkDevice();
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const generatePDF = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);
    const pdf = new jsPDF();
    for (let i = 0; i < images.length; i++) {
      const img = images[i].url;
      const imgProps = pdf.getImageProperties(img);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      if (i > 0) pdf.addPage();
      pdf.addImage(img, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }
    pdf.save('mytools_converted.pdf');
    setIsGenerating(false);
  };

  return (
    <div className="pdf-container">
      {/* Header with Buttons */}
      <div className="pdf-header">
        <button onClick={() => navigate('/')} className="back-btn">
          <span className="arrow">←</span> Back to Dashboard
        </button>
        <button onClick={() => setImages([])} className="refresh-btn">Refresh</button>
      </div>

      <h2 className="pdf-title">Make PDF</h2>

      {/* Main Upload Box */}
      <div className="upload-box-wrapper">
        <label className="upload-section-main">
          <div className="upload-icon-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
            </svg>
          </div>
          <p>Click to upload images to convert</p>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} hidden />
        </label>
        
        {/* Mobile Camera Option */}
        {isMobile && (
         <label className="camera-label">
    <span>📷</span> Take Photo from Camera
    <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} hidden />
  </label>
        )}
      </div>

      {/* Preview Section (Only shows when images are present) */}
      {images.length > 0 && (
        <div className="preview-container">
          <p className="preview-label">Selected Images ({images.length} Pages)</p>
          <div className="preview-grid-modern">
            {images.map((img, index) => (
              <div key={index} className="preview-card">
                <img src={img.url} alt="preview" />
                <button onClick={() => removeImage(index)} className="del-btn">×</button>
                <div className="page-tag">Page{index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings & Download Box (Like Screenshot) */}
      <div className="settings-box-final">
        <button 
          className={`generate-btn-final ${images.length > 0 ? 'active' : ''}`}
          onClick={generatePDF}
          disabled={images.length === 0 || isGenerating}
        >
          {isGenerating ? 'Processing...' : 'Make PDF Now'}
        </button>
      </div>
    </div>
  );
};

export default MakePdf;