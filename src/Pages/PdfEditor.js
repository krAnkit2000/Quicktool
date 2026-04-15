

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import "./PdfEditor.css";

const tools = [
  { id: "merge",    label: "Merge PDF",    icon: "⊕", desc: "Combine multiple PDFs into one file",   color: "#e63946", multiple: true  },
  { id: "split",    label: "Split PDF",    icon: "✂", desc: "Split a PDF into separate pages",        color: "#f4a261", multiple: false },
  { id: "compress", label: "Compress PDF", icon: "⬇", desc: "Reduce the size of your PDF",            color: "#2a9d8f", multiple: false },
  { id: "toword",   label: "PDF to Word",  icon: "W", desc: "Convert PDF to a Word document",         color: "#457b9d", multiple: false },
  { id: "toexcel",  label: "PDF to Excel", icon: "✦", desc: "Convert PDF to an Excel spreadsheet",   color: "#1d8348", multiple: false },
  { id: "lock",     label: "Lock PDF",     icon: "🔒", desc: "Protect your PDF with a password",     color: "#6d4c41", multiple: false },
];

// Read file as ArrayBuffer
const readFileAsArrayBuffer = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });

// Load PDF.js once
async function loadPdfJs() {
  if (!window.pdfjsLib) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }
}

// TOOL FUNCTIONS — return { blob, filename, message, previewUrl } 

async function mergePDFs(files) {
  const merged = await PDFDocument.create();
  for (const file of files) {
    const bytes = await readFileAsArrayBuffer(file);
    const pdf = await PDFDocument.load(bytes);
    const pages = await merged.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
  }
  const bytes = await merged.save();
  const blob = new Blob([bytes], { type: "application/pdf" });
  const previewUrl = URL.createObjectURL(blob);
  return { blob, filename: "merged.pdf", previewUrl, message: `✅ ${files.length} PDFs merged successfully!` };
}

async function splitPDF(file) {
  const bytes = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(bytes);
  const total = pdf.getPageCount();

  // For preview, show first page only
  const firstPdf = await PDFDocument.create();
  const [firstPage] = await firstPdf.copyPages(pdf, [0]);
  firstPdf.addPage(firstPage);
  const firstBytes = await firstPdf.save();
  const previewBlob = new Blob([firstBytes], { type: "application/pdf" });
  const previewUrl = URL.createObjectURL(previewBlob);

  // Store all pages for download
  const allBlobs = [];
  for (let i = 0; i < total; i++) {
    const newPdf = await PDFDocument.create();
    const [page] = await newPdf.copyPages(pdf, [i]);
    newPdf.addPage(page);
    const pageBytes = await newPdf.save();
    allBlobs.push({ bytes: pageBytes, name: `page-${i + 1}.pdf` });
  }

  return {
    blob: null,
    filename: null,
    allBlobs,
    previewUrl,
    message: `✅ PDF split into ${total} pages! Click Download to save all pages.`,
  };
}

async function compressPDF(file) {
  const bytes = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(bytes, { updateMetadata: false });
  pdf.setTitle(""); pdf.setAuthor(""); pdf.setSubject("");
  pdf.setKeywords([]); pdf.setProducer(""); pdf.setCreator("");
  const compressed = await pdf.save({ useObjectStreams: true });
  const saved = file.size - compressed.byteLength;
  const percent = ((saved / file.size) * 100).toFixed(1);
  const blob = new Blob([compressed], { type: "application/pdf" });
  const previewUrl = URL.createObjectURL(blob);
  const msg = saved > 0
    ? `✅ Compressed! Size reduced by ${percent}% (${(saved / 1024).toFixed(1)} KB saved)`
    : `✅ File processed. (PDF was already optimized)`;
  return { blob, filename: `compressed-${file.name}`, previewUrl, message: msg };
}

async function pdfToWord(file) {
  await loadPdfJs();
  const bytes = await readFileAsArrayBuffer(file);
  try {
    const pdfDoc = await window.pdfjsLib.getDocument({ data: bytes }).promise;
    let fullText = `Document: ${file.name}\n${"=".repeat(50)}\n\n`;
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      fullText += `--- Page ${i} ---\n${pageText}\n\n`;
    }
    const blob = new Blob([fullText], { type: "application/msword" });
    // Text preview
    const previewText = fullText.slice(0, 1000) + (fullText.length > 1000 ? "\n..." : "");
    return { blob, filename: `${file.name.replace(".pdf", "")}.doc`, previewText, message: "✅ PDF converted to Word document!" };
  } catch {
    return { blob: null, message: "❌ Could not extract text. PDF may be image-based." };
  }
}

async function pdfToExcel(file) {
  await loadPdfJs();
  const bytes = await readFileAsArrayBuffer(file);
  try {
    const pdfDoc = await window.pdfjsLib.getDocument({ data: bytes }).promise;
    let csvContent = "";
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const content = await page.getTextContent();
      const rows = {};
      content.items.forEach((item) => {
        const y = Math.round(item.transform[5]);
        if (!rows[y]) rows[y] = [];
        rows[y].push(item.str.trim());
      });
      csvContent += `Page ${i}\n`;
      Object.keys(rows).sort((a, b) => b - a).forEach((y) => {
        csvContent += rows[y].join(",") + "\n";
      });
      csvContent += "\n";
    }
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const previewText = csvContent.slice(0, 1000) + (csvContent.length > 1000 ? "\n..." : "");
    return { blob, filename: `${file.name.replace(".pdf", "")}.csv`, previewText, message: "✅ PDF converted to Excel (CSV)! Open in Excel." };
  } catch {
    return { blob: null, message: "❌ Could not extract data. PDF may be image-based." };
  }
}

async function lockPDF(file, password) {
  const bytes = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(bytes);
  const locked = await pdf.save({
    userPassword: password,
    ownerPassword: password + "_owner",
    permissions: {
      printing: "lowResolution",
      modifying: false,
      copying: false,
      annotating: false,
      fillingForms: false,
      contentAccessibility: true,
      documentAssembly: false,
    },
  });
  const blob = new Blob([locked], { type: "application/pdf" });
  const previewUrl = URL.createObjectURL(blob);
  return { blob, filename: `locked-${file.name}`, previewUrl, message: "✅ PDF locked with password successfully!" };
}

// ── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function PdfEditor({ setActiveTool }) {
  const [selectedTool, setSelectedTool] = useState(null);
  const [files, setFiles]               = useState([]);
  const [password, setPassword]         = useState("");
  const [status, setStatus]             = useState("");
  const [loading, setLoading]           = useState(false);
  const [result, setResult]             = useState(null);   
  const [showPreview, setShowPreview]   = useState(false);

  const openTool = (tool) => {
    setSelectedTool(tool);
    setFiles([]); setPassword(""); setStatus("");
    setResult(null); setShowPreview(false);
  };

  const goBack = () => {
    setSelectedTool(null);
    setFiles([]); setPassword(""); setStatus("");
    setResult(null); setShowPreview(false);
  };

const handleRefresh = () => {
    
    if (selectedTool) {
      setFiles([]); 
      setPassword(""); 
      setStatus("");
      setResult(null); 
      setShowPreview(false);
    } else {
     
      setSelectedTool(null);
      setFiles([]); 
      setPassword(""); 
      setStatus("");
      setResult(null); 
      setShowPreview(false);
    }
  };

  // Process the tool — store result, don't download yet
  const handleProcess = async () => {
    if (files.length === 0) { setStatus("⚠ Please select a file first!"); return; }
    if (selectedTool.id === "lock" && !password) { setStatus("⚠ Please enter a password!"); return; }

    setLoading(true);
    setStatus("⏳ Processing...");
    setResult(null);
    setShowPreview(false);

    try {
      let res;
      switch (selectedTool.id) {
        case "merge":    res = await mergePDFs(files);             break;
        case "split":    res = await splitPDF(files[0]);           break;
        case "compress": res = await compressPDF(files[0]);        break;
        case "toword":   res = await pdfToWord(files[0]);          break;
        case "toexcel":  res = await pdfToExcel(files[0]);         break;
        case "lock":     res = await lockPDF(files[0], password);  break;
        default:         res = { message: "❌ Unknown tool." };
      }
      setStatus(res.message);
      if (res.blob || res.allBlobs) setResult(res);
    } catch (err) {
      setStatus(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Download — called only when user clicks Download
  const handleDownload = () => {
    if (!result) return;
    // Split has multiple files
    if (result.allBlobs) {
      result.allBlobs.forEach(({ bytes, name }) => {
        saveAs(new Blob([bytes], { type: "application/pdf" }), name);
      });
    } else {
      saveAs(result.blob, result.filename);
    }
  };

  const isError = status.startsWith("❌");

  return (
    <div className="pdf-tools-page">
      <div className="pdf-tools-card">

        {/* Top bar */}
        <div className="pdf-tools-topbar">
          {!selectedTool ? (
            <button onClick={() => setActiveTool("dashboard")} className="back-btn">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: "18px", marginRight: "5px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          ) : (
            <button className="back-btn" onClick={goBack}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: "18px", marginRight: "5px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          )}
          <button className="pdf-tools-refresh-btn" onClick={handleRefresh}>↻ Refresh</button>
        </div>

        {/* Title — only on grid */}
        {!selectedTool && (
          <>
            <h1 className="pdf-tools-title">PDF Tools</h1>
            <p className="pdf-tools-subtitle">Choose what you want to do</p>
          </>
        )}

        {/* Grid OR Detail */}
        {!selectedTool ? (
          <div className="pdf-tools-grid">
            {tools.map((tool) => (
              <button
                key={tool.id}
                className="pdf-tool-btn"
              style={{ 
    borderTopColor: tool.color, 
    borderBottomColor: tool.color 
  }}
                onClick={() => openTool(tool)}
              >
                <div className="pdf-tool-icon" style={{ background: tool.color }}>{tool.icon}</div>
                <div className="pdf-tool-label">{tool.label}</div>
                <div className="pdf-tool-desc">{tool.desc}</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="pdf-detail-panel">

            <div className="pdf-detail-icon" style={{ background: selectedTool.color }}>
              {selectedTool.icon}
            </div>
            <h2 className="pdf-detail-title">{selectedTool.label}</h2>
            <p className="pdf-detail-desc">{selectedTool.desc}</p>

            {/* File upload */}
            <label>
              <input
                type="file" accept=".pdf" multiple={selectedTool.multiple}
                onChange={(e) => { setFiles(Array.from(e.target.files)); setStatus(""); setResult(null); setShowPreview(false); }}
                style={{ display: "none" }}
              />
              <div className="pdf-upload-area">
                <span className="pdf-upload-icon">📂</span>
                <span className="pdf-upload-text">
                  {files.length > 0
                    ? files.map((f) => f.name).join(", ")
                    : selectedTool.multiple ? "Click to select multiple PDFs" : "Click to select a PDF"}
                </span>
              </div>
            </label>

            {/* Password — only for Lock */}
            {selectedTool.id === "lock" && (
              <input
                type="password" placeholder="Enter password..."
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="pdf-password-input"
              />
            )}

            {/* Process button */}
            <button
              className="pdf-process-btn"
              style={{ background: loading ? "#94a3b8" : selectedTool.color }}
              onClick={handleProcess}
              disabled={loading}
            >
              {loading ? "Processing..." : `Convert / Process`}
            </button>

            {/* Status message */}
            {status && (
              <div className={`pdf-status-box ${isError ? "pdf-status-error" : ""}`}>
                {status}
              </div>
            )}

            {/* Preview + Download buttons — show after processing */}
            {result && !isError && (
              <div className="pdf-action-btns">

                {/* Preview button — only for PDF and text outputs */}
                {(result.previewUrl || result.previewText) && (
                  <button
                    className="pdf-preview-btn"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? "🔼 Hide Preview" : "👁 Preview"}
                  </button>
                )}

                {/* Download button */}
                <button
                  className="pdf-download-btn"
                  onClick={handleDownload}
                >
                  ⬇ Download {result.filename || "Files"}
                </button>

              </div>
            )}

            {/* Preview area */}
            {showPreview && result && (
              <div className="pdf-preview-area">
                {/* PDF preview — iframe */}
                {result.previewUrl && (
                  <iframe
                    src={result.previewUrl}
                    title="PDF Preview"
                    className="pdf-preview-iframe"
                  />
                )}
                {/* Text preview — for word/excel */}
                {result.previewText && !result.previewUrl && (
                  <pre className="pdf-preview-text">{result.previewText}</pre>
                )}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}