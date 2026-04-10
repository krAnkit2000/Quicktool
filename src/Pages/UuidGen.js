import React, { useState, useEffect } from 'react';

const UuidGen = ({ setActiveTool }) => {
  // Now using an array to store multiple UUIDs
  const [uuids, setUuids] = useState([]);
  const [count, setCount] = useState(1);
  const [isCopied, setIsCopied] = useState(false);

  // Secure UUID Generator for multiple counts
  const generateUuids = (numberOfUuids) => {
    const newUuids = [];
    const iterations = numberOfUuids || 1;

    for (let i = 0; i < iterations; i++) {
      let id = '';
      if (window.crypto && window.crypto.randomUUID) {
        id = window.crypto.randomUUID();
      } else {
        id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = Math.floor(Math.random() * 16);
          const v = c === 'x' ? r : ((r & 0x3) | 0x8);
          return v.toString(16);
        });
      }
      newUuids.push(id);
    }
    
    setUuids(newUuids);
    setIsCopied(false);
  };

  // Generate default on mount
  useEffect(() => {
    generateUuids(1);
  }, []);

  const handleCountChange = (e) => {
    const val = parseInt(e.target.value);
    // Setting limit between 1 and 50 to prevent performance lag
    if (isNaN(val) || val < 1) setCount(1);
    else if (val > 50) setCount(50);
    else setCount(val);
  };

  const handleCopyAll = async () => {
    if (uuids.length === 0) return;
    const textToCopy = uuids.join('\n');
    
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      alert("Failed to copy. Please try manually.");
    }
  };

  return (
    <div className="converter-container">
      <button onClick={() => setActiveTool('dashboard')} className="back-btn">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </button>

      <h2 className="converter-title" style={{ textAlign: 'center' }}>Bulk UUID Generator</h2>

      {/* Input Section */}
      <div className="settings-bar" style={{ marginBottom: '20px', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontWeight: '900' }}>Number of UUIDs:</label>
          <input 
            type="number" 
            value={count} 
            onChange={handleCountChange}
            className="format-select"
            style={{ width: '80px' }}
            min="1"
            max="100"
          />
        </div>
      </div>

      

      {/* Result Display Area */}
<div 
  className="upload-box" 
  style={{ 
    cursor: 'default', 
    padding: '0.8rem 1.5rem', 
    backgroundColor: '#f8fafc',
    border: '2px solid #e2e8f0',
   fontWeight:900,
    minHeight: '60px', 
    maxHeight: '180px', 
    overflowY: 'auto',
    textAlign: 'left',
    display: 'block',
    width: '100%',
    borderRadius: '12px'
  }}
>
  {uuids.map((id, index) => (
    <div key={index} style={{ 
      fontFamily: 'monospace', 
      fontSize: '1rem', 
      padding: '8px 0',
      borderBottom: index !== uuids.length - 1 ? '1px solid #e2e8f0' : 'none',
      color: '#1e293b',
      lineHeight: '1.4'
    }}>
      <span style={{ color: '#94a3b8', marginRight: '10px', userSelect: 'none' }}>{index + 1}.</span>
      {id}
    </div>
  ))}
</div>

      <div className="settings-bar" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '20px' }}>
        <button 
          className="convert-btn" 
          onClick={handleCopyAll}
          style={{ 
            backgroundColor: isCopied ? '#10b981' : 'white', 
            color: isCopied ? 'white' : '#3b82f6',
            border: '2px solid',
            borderColor: isCopied ? '#10b981' : '#3b82f6',
            minWidth: '140px'
          }}
        >
          {isCopied ? 'UUID Copied!' : 'Copy UUID'}
        </button>

        <button 
          className="convert-btn" 
          onClick={() => generateUuids(count)}
        >
          Generate
        </button>
      </div>
    </div>
  );
};

export default UuidGen;