import { useState } from "react";
import "./PdfEditor.css";

// List of all PDF tools
const tools = [
  { id: "merge",    label: "Merge PDF",    icon: "⊕", desc: "Combine multiple PDFs into one file",   color: "#e63946", multiple: true  },
  { id: "split",    label: "Split PDF",    icon: "✂", desc: "Split a PDF into separate pages",        color: "#f4a261", multiple: false },
  { id: "compress", label: "Compress PDF", icon: "⬇", desc: "Reduce the size of your PDF",            color: "#2a9d8f", multiple: false },
  { id: "toword",   label: "PDF to Word",  icon: "W", desc: "Convert PDF to a Word document",         color: "#457b9d", multiple: false },
  { id: "toexcel",  label: "PDF to Excel", icon: "✦", desc: "Convert PDF to an Excel spreadsheet",   color: "#1d8348", multiple: false },
  { id: "lock",     label: "Lock PDF",     icon: "🔒", desc: "Protect your PDF with a password",     color: "#6d4c41", multiple: false },
];

export default function PDFTools({ setActiveTool }) {
  const [selectedTool, setSelectedTool] = useState(null);
  const [files, setFiles]               = useState([]);
  const [password, setPassword]         = useState("");
  const [status, setStatus]             = useState("");

  const openTool = (tool) => {
    setSelectedTool(tool);
    setFiles([]);
    setPassword("");
    setStatus("");
  };

  // Goes back to 6-tool grid
  const goBack = () => {
    setSelectedTool(null);
    setFiles([]);
    setPassword("");
    setStatus("");
  };

  const handleRefresh = () => {
    setSelectedTool(null);
    setFiles([]);
    setPassword("");
    setStatus("");
  };

  const handleProcess = () => {
    if (files.length === 0) { setStatus("⚠ Please select a file first!"); return; }
    if (selectedTool.id === "lock" && !password) { setStatus("⚠ Please enter a password!"); return; }
    // TODO: Connect backend API here
    setStatus(`✅ "${selectedTool.label}" started! Connect your backend to process.`);
  };

  return (
    <div className="pdf-tools-page">
      <div className="pdf-tools-card">

        {/* Top bar:
            - No tool selected → show "Back to Dashboard"
            - Tool selected    → show "← Back" (hide "Back to Dashboard") */}
        <div className="pdf-tools-topbar">
          {!selectedTool ? (
            // Show Back to Dashboard only on grid view
            <button onClick={() => setActiveTool('dashboard')} className="back-btn">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '18px', marginRight: '5px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          ) : (
            // Show Back (to grid) when a tool is open
            <button className="back-btn" onClick={goBack}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '18px', marginRight: '5px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          )}

          <button className="pdf-tools-refresh-btn" onClick={handleRefresh}>
            ↻ Refresh
          </button>
        </div>

        {/* Title + subtitle — only show on grid view, hide when tool is open */}
        {!selectedTool && (
          <>
            <h1 className="pdf-tools-title">PDF Tools</h1>
            <p className="pdf-tools-subtitle">Choose what you want to do</p>
          </>
        )}

        {/* 6-tool grid OR detail panel */}
        {!selectedTool ? (

          // Grid of 6 tools
          <div className="pdf-tools-grid">
            {tools.map((tool) => (
              <button
                key={tool.id}
                className="pdf-tool-btn"
                style={{ borderTopColor: tool.color }}
                onClick={() => openTool(tool)}
              >
                <div className="pdf-tool-icon" style={{ background: tool.color }}>
                  {tool.icon}
                </div>
                <div className="pdf-tool-label">{tool.label}</div>
                <div className="pdf-tool-desc">{tool.desc}</div>
              </button>
            ))}
          </div>

        ) : (

          // Detail panel — no back button here anymore (moved to topbar)
          <div className="pdf-detail-panel">

            <div className="pdf-detail-icon" style={{ background: selectedTool.color }}>
              {selectedTool.icon}
            </div>

            <h2 className="pdf-detail-title">{selectedTool.label}</h2>
            <p className="pdf-detail-desc">{selectedTool.desc}</p>

            {/* File upload */}
            <label>
              <input
                type="file"
                accept=".pdf"
                multiple={selectedTool.multiple}
                onChange={(e) => { setFiles(Array.from(e.target.files)); setStatus(""); }}
                style={{ display: "none" }}
              />
              <div className="pdf-upload-area">
                <span className="pdf-upload-icon">📂</span>
                <span className="pdf-upload-text">
                  {files.length > 0
                    ? files.map((f) => f.name).join(", ")
                    : selectedTool.multiple
                    ? "Click to select multiple PDFs"
                    : "Click to select a PDF"}
                </span>
              </div>
            </label>

            {/* Password field — only for Lock PDF */}
            {selectedTool.id === "lock" && (
              <input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pdf-password-input"
              />
            )}

            {/* Process button */}
            <button
              className="pdf-process-btn"
              style={{ background: selectedTool.color }}
              onClick={handleProcess}
            >
              {selectedTool.label}
            </button>

            {/* Status message */}
            {status && <div className="pdf-status-box">{status}</div>}

          </div>
        )}

      </div>
    </div>
  );
}