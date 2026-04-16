import React, { useState } from 'react';
import JSZip from 'jszip'; 
import { useNavigate } from 'react-router-dom'; // ✅ added

const ImgConvert = () => {
  const navigate = useNavigate(); // ✅ added

  const [selectedFormat, setSelectedFormat] = useState('JPG'); 
  const [files, setFiles] = useState([]); 
  const [convertedFiles, setConvertedFiles] = useState([]); 
  const [isConverting, setIsConverting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleReset = () => {
    setFiles([]);
    setConvertedFiles([]);
    setErrorMsg('');
    setIsConverting(false);
  };

  const handleFileChange = (e) => {
    setErrorMsg('');
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const heavyFormats = ['psd', 'tif', 'tiff', 'raw', 'heic'];
      
      const validFiles = selectedFiles.filter(f => {
        const ext = f.name.split('.').pop().toLowerCase();
        return !heavyFormats.includes(ext);
      });

      if (validFiles.length < selectedFiles.length) {
        setErrorMsg("Some files are unsupported and were skipped.");
      }

      setFiles(validFiles);
      setConvertedFiles([]); 
    }
  };

  const handleConvertAll = async () => {
    if (files.length === 0) return;
    setIsConverting(true);
    const results = [];

    for (const file of files) {
      try {
        const dataUrl = await convertSingleFile(file, selectedFormat);
        results.push({ name: file.name, dataUrl });
      } catch (err) {
        console.error("Conversion failed for:", file.name);
      }
    }

    setConvertedFiles(results);
    setIsConverting(false);
  };

  const convertSingleFile = (file, format) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (format === 'JPG' || format === 'JPEG') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0);
          const mimeType = format === 'PNG' ? 'image/png' : format === 'WEBP' ? 'image/webp' : 'image/jpeg';
          resolve(canvas.toDataURL(mimeType, 0.9));
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDownload = async () => {
    if (convertedFiles.length === 0) return;

    if (convertedFiles.length === 1) {
      const file = convertedFiles[0];
      const link = document.createElement('a');
      link.href = file.dataUrl;
      const fileName = file.name.split('.')[0] + `.${selectedFormat.toLowerCase()}`;
      link.download = fileName;
      link.click();
    } else {
      const zip = new JSZip();
      convertedFiles.forEach((file) => {
        const base64Data = file.dataUrl.split(',')[1];
        const fileName = file.name.split('.')[0] + `.${selectedFormat.toLowerCase()}`;
        zip.file(fileName, base64Data, { base64: true });
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = "converted_images.zip";
      link.click();
    }
  };

  return (
    <div className="converter-container">
      {/* Header with Back and Refresh buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        
        {/* ✅ ONLY CHANGE HERE */}
        <button onClick={() => navigate('/')} className="back-btn">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width:'18px', marginRight:'5px'}}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>

        {files.length > 0 && (
          <button 
            onClick={handleReset}
            style={{ 
              background: '#fee2e2', 
              color: '#dc2626', 
              border: '1px solid #fecaca', 
              padding: '5px 12px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <svg style={{width:'14px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        )}
      </div>

      <h2 className="converter-title" style={{ textAlign: 'center' }}>Bulk Image Converter</h2>

      {errorMsg && <div className="error-box" style={{color:'red', textAlign:'center', marginBottom: '10px'}}>{errorMsg}</div>}

      <div className="upload-box" style={{ minHeight: '120px' }}>
        <input 
          type="file" 
          multiple 
          accept="image/*"
          onChange={handleFileChange}
          className="upload-input" 
        />
        <div style={{zIndex: 1, textAlign:'center'}}>
           <p className="upload-text">
             {files.length > 0 ? `${files.length} files selected` : "Click to Bulk Upload Images"}
           </p>
        </div>
      </div>

      {files.length > 0 && (
        <div style={{maxHeight:'100px', overflowY:'auto', margin:'10px 0', fontSize:'0.8rem', color:'#64748b', border: '1px solid #eee', padding: '10px', borderRadius: '8px'}}>
            {files.map((f, i) => <div key={i}>✅ {f.name}</div>)}
        </div>
      )}

      <div className="settings-bar" style={{justifyContent: 'center', gap: '15px', marginTop: '15px'}}>
        <div className="format-selector">
          <label>Format:</label>
          <select value={selectedFormat} onChange={(e) => {setSelectedFormat(e.target.value); setConvertedFiles([]);}} className="format-select">
            <option value="JPG">JPG</option>
            <option value="PNG">PNG</option>
            <option value="WEBP">WEBP</option>
          </select>
        </div>

        {convertedFiles.length > 0 ? (
          <button className="convert-btn" onClick={handleDownload} style={{backgroundColor: '#10b981'}}>
            {convertedFiles.length === 1 ? `Download ${selectedFormat}` : 'Download All (ZIP)'}
          </button>
        ) : (
          <button className="convert-btn" onClick={handleConvertAll} disabled={files.length === 0 || isConverting}>
            {isConverting ? 'Converting...' : `Convert ${files.length} Image${files.length > 1 ? 's' : ''}`}
          </button>
        )}
      </div>
    </div>
  );
};

export default ImgConvert;