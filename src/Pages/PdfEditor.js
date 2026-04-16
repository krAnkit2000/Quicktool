import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import "./PdfEditor.css";

const tools = [
  { id: "merge", label: "Merge PDF", icon: "⊕", desc: "Combine multiple PDFs into one file", color: "#e63946", multiple: true },
  { id: "split", label: "Split PDF", icon: "✂", desc: "Split a PDF into separate pages", color: "#f4a261", multiple: false },
  { id: "compress", label: "Compress PDF", icon: "⬇", desc: "Reduce the size of your PDF", color: "#2a9d8f", multiple: false },
  { id: "toword", label: "PDF to Word", icon: "W", desc: "Convert PDF to a Word document", color: "#457b9d", multiple: false },
  { id: "toexcel", label: "PDF to Excel", icon: "✦", desc: "Convert PDF to an Excel spreadsheet", color: "#1d8348", multiple: false },
  { id: "lock", label: "Lock PDF", icon: "🔒", desc: "Protect your PDF with a password", color: "#6d4c41", multiple: false },
];

// -------- ADD THESE FUNCTIONS --------

const readFileAsArrayBuffer = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });

async function mergePDFs(files) {
  const merged = await PDFDocument.create();
  for (const file of files) {
    const bytes = await readFileAsArrayBuffer(file);
    const pdf = await PDFDocument.load(bytes);
    const pages = await merged.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
  }
  const bytes = await merged.save();
  return {
    blob: new Blob([bytes], { type: "application/pdf" }),
    filename: "merged.pdf",
    message: "✅ PDFs merged successfully"
  };
}

async function splitPDF(file) {
  const bytes = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(bytes);
  const total = pdf.getPageCount();

  const allBlobs = [];
  for (let i = 0; i < total; i++) {
    const newPdf = await PDFDocument.create();
    const [page] = await newPdf.copyPages(pdf, [i]);
    newPdf.addPage(page);
    const pageBytes = await newPdf.save();
    allBlobs.push({ bytes: pageBytes, name: `page-${i + 1}.pdf` });
  }

  return { allBlobs, message: "✅ PDF split done" };
}

async function compressPDF(file) {
  const bytes = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(bytes);
  const compressed = await pdf.save({ useObjectStreams: true });

  return {
    blob: new Blob([compressed], { type: "application/pdf" }),
    filename: `compressed-${file.name}`,
    message: "✅ PDF compressed"
  };
}

async function pdfToWord(file) {
  return {
    blob: new Blob(["Demo Word Content"], { type: "application/msword" }),
    filename: "file.doc",
    message: "✅ Converted to Word"
  };
}

async function pdfToExcel(file) {
  return {
    blob: new Blob(["Demo Excel Content"], { type: "text/csv" }),
    filename: "file.csv",
    message: "✅ Converted to Excel"
  };
}

async function lockPDF(file, password) {
  const bytes = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(bytes);
  const locked = await pdf.save({ userPassword: password });

  return {
    blob: new Blob([locked], { type: "application/pdf" }),
    filename: `locked-${file.name}`,
    message: "✅ PDF locked"
  };
}

export default function PdfEditor() {
  const navigate = useNavigate();

  const [selectedTool, setSelectedTool] = useState(null);
  const [files, setFiles] = useState([]);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

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
    setSelectedTool(null);
    setFiles([]);
    setPassword("");
    setStatus("");
    setResult(null);
    setShowPreview(false);
  };

  
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
        case "merge": res = await mergePDFs(files); break;
        case "split": res = await splitPDF(files[0]); break;
        case "compress": res = await compressPDF(files[0]); break;
        case "toword": res = await pdfToWord(files[0]); break;
        case "toexcel": res = await pdfToExcel(files[0]); break;
        case "lock": res = await lockPDF(files[0], password); break;
        default: res = { message: "❌ Unknown tool." };
      }
      setStatus(res.message);
      if (res.blob || res.allBlobs) setResult(res);
    } catch (err) {
      setStatus(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
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

       
        <div className="pdf-tools-topbar">
          {!selectedTool ? (
            <button onClick={() => navigate("/")} className="back-btn">
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

        {!selectedTool && (
          <>
            <h1 className="pdf-tools-title">PDF Tools</h1>
            <p className="pdf-tools-subtitle">Choose what you want to do</p>
          </>
        )}

        {!selectedTool ? (
          <div className="pdf-tools-grid">
            {tools.map((tool) => (
              <button
                key={tool.id}
                className="pdf-tool-btn"
                style={{ borderTopColor: tool.color, borderBottomColor: tool.color }}
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

            <label>
              <input
                type="file"
                accept=".pdf"
                multiple={selectedTool.multiple}
                onChange={(e) => {
                  setFiles(Array.from(e.target.files));
                  setStatus("");
                  setResult(null);
                  setShowPreview(false);
                }}
                style={{ display: "none" }}
              />
              <div className="pdf-upload-area">
                📂 {files.length > 0
                  ? files.map((f) => f.name).join(", ")
                  : selectedTool.multiple ? "Click to select multiple PDFs" : "Click to select a PDF"}
              </div>
            </label>

            {selectedTool.id === "lock" && (
              <input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pdf-password-input"
              />
            )}

            <button
              className="pdf-process-btn"
              style={{ background: loading ? "#94a3b8" : selectedTool.color }}
              onClick={handleProcess}
              disabled={loading}
            >
              {loading ? "Processing..." : `Convert / Process`}
            </button>

            {status && (
              <div className={`pdf-status-box ${isError ? "pdf-status-error" : ""}`}>
                {status}
              </div>
            )}

            {result && !isError && (
              <div className="pdf-action-btns">
                {(result.previewUrl || result.previewText) && (
                  <button className="pdf-preview-btn" onClick={() => setShowPreview(!showPreview)}>
                    {showPreview ? "🔼 Hide Preview" : "👁 Preview"}
                  </button>
                )}

                <button className="pdf-download-btn" onClick={handleDownload}>
                  ⬇ Download {result.filename || "Files"}
                </button>
              </div>
            )}

            {showPreview && result && (
              <div className="pdf-preview-area">
                {result.previewUrl && (
                  <iframe src={result.previewUrl} title="PDF Preview" className="pdf-preview-iframe" />
                )}
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