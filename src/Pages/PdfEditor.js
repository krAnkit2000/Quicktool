import React, { useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';

const PdfEditor = ({ setActiveTool }) => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customText, setCustomText] = useState("Edited with MyTools");

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const modifyPdf = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      // 1. File ko arrayBuffer mein convert karein
      const existingPdfBytes = await file.arrayBuffer();

      // 2. PDF load karein
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      
      // 3. Pehla page nikaalein
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      // 4. Page par text add karein
      firstPage.drawText(customText, {
        x: 50,
        y: height - 50,
        size: 20,
        color: rgb(0.23, 0.51, 0.96), // Blue color
      });

      // 5. Modified PDF save karein
      const pdfBytes = await pdfDoc.save();
      
      // 6. Download link banayein
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Edited_${file.name}`;
      link.click();

    } catch (err) {
      console.error("PDF Edit Error:", err);
      alert("PDF process karne mein error aaya.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="converter-container">
      <button onClick={() => setActiveTool('dashboard')} className="back-btn">
        ← Back to Dashboard
      </button>

      <h2 className="converter-title" style={{ textAlign: 'center' }}>AI PDF Editor</h2>

      <div className="upload-box" style={{ minHeight: '150px' }}>
        <input type="file" accept="application/pdf" onChange={handleFileChange} className="upload-input" />
        <p className="upload-text">
          {file ? `Selected: ${file.name}` : "Upload PDF to add text"}
        </p>
      </div>

      {file && (
        <div className="settings-bar" style={{ flexDirection: 'column', gap: '15px' }}>
          <div style={{ width: '100%' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Text to Add:</label>
            <input 
              type="text" 
              value={customText} 
              onChange={(e) => setCustomText(e.target.value)}
              style={{ padding: '10px', width: '100%', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <button className="convert-btn" onClick={modifyPdf} disabled={isProcessing}>
            {isProcessing ? 'Processing PDF...' : 'Add Text & Download'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfEditor;