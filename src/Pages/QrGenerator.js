import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './QrGenerator.css'; // CSS File Import Karein

const QrGenerator = ({ setActiveTool }) => {
  const [text, setText] = useState(""); 
  const qrRef = useRef();

  const handleRefresh = () => setText("");

  const getSmartFileName = () => {
    if (!text) return "mytools_qr";
    let cleanName = text.trim().replace(/[^\w\s]/gi, '').replace(/\s+/g, '_').toLowerCase();
    return `${cleanName.slice(0, 15) || 'qr'}_mytools`;
  };

  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const image = canvas.toDataURL("image/png");
    const anchor = document.createElement("a");
    anchor.href = image;
    anchor.download = `${getSmartFileName()}.png`;
    anchor.click();
  };

  const shareQRCode = async () => {
    const canvas = qrRef.current.querySelector('canvas');
    canvas.toBlob(async (blob) => {
      const fileName = `${getSmartFileName()}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });
      if (navigator.share) {
        try {
          await navigator.share({
            files: [file],
            title: 'My QR Code',
            text: `QR Code: ${text || "No Data"}`,
          });
        } catch (err) { console.log('Sharing failed', err); }
      } else { alert("Sharing not supported."); }
    });
  };

  return (
    <div className="converter-container qr-container">
      <div className="qr-header">
        <button onClick={() => setActiveTool('dashboard')} className="back-btn">
          ← Back
        </button>
        
        <button onClick={handleRefresh} className="reset-btn">
          <svg style={{width:'16px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset All
        </button>
      </div>

      <h2 className="converter-title">QR Code Generator</h2>

      <div className="qr-input-group">
        <label>Enter URL or Text:</label>
        <input 
          type="text" 
          value={text} 
          onChange={(e) => setText(e.target.value)}
          placeholder="Type here to update QR..."
          className="qr-input"
        />
      </div>

      <div ref={qrRef} className="qr-display-area">
        <QRCodeCanvas 
          value={text || "No Data Found - MyTools"} 
          size={220}
          level={"H"} 
          fgColor="#1e293b"
          bgColor="#ffffff"
        />
      </div>

      <div className="qr-action-buttons">
        <button className="convert-btn" onClick={downloadQRCode}>
          Download PNG
        </button>
        <button className="convert-btn share-btn" onClick={shareQRCode}>
          Share QR
        </button>
      </div>
    </div>
  );
};

export default QrGenerator;