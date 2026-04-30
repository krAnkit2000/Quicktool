import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './ResumeBuilder.css';

const ResumeBuilder = () => {
  const resumeRef = useRef();
  const [template, setTemplate] = useState('classic');
  const [formData, setFormData] = useState({
    name: 'Ankit Kumar',
    email: 'ankitkumar897955@gmail.com',
    phone: '8979558879',
    linkedin: 'linkedin.com/in/krankit2000',
    summary: 'AWS Cloud and DevOps Engineer with over a year of experience...',
    experience: 'Technical Application Engineer | Vensysco Technologies',
    projects: 'Waves OTT App (Prasar Bharati)'
  });

  const downloadPDF = () => {
    const input = resumeRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${formData.name}_Resume.pdf`);
    });
  };

  return (
    <div className="resume-container">
      {/* Sidebar Controls */}
      <div className="controls-panel">
        <h3>Resume Settings</h3>
        <select onChange={(e) => setTemplate(e.target.value)} value={template}>
          <option value="classic">Classic (Default)</option>
          <option value="modern">Modern Pink</option>
          <option value="minimal">Minimalist</option>
        </select>
        
        <div className="input-group">
          <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <textarea placeholder="Summary" value={formData.summary} onChange={(e) => setFormData({...formData, summary: e.target.value})} />
        </div>

        <button className="download-btn-premium" onClick={downloadPDF}>
          📥 Download PDF
        </button>
      </div>

      {/* Resume Preview Area */}
      <div className="preview-panel">
        <div ref={resumeRef} className={`resume-paper ${template}`}>
          <header className="resume-header">
            <h1>{formData.name}</h1>
            <p>{formData.email} | {formData.phone} | {formData.linkedin}</p>
          </header>

          <section className="resume-section">
            <h2 className="section-title">PROFESSIONAL SUMMARY</h2>
            <p className="section-content">{formData.summary}</p>
          </section>

          <section className="resume-section">
            <h2 className="section-title">WORK EXPERIENCE</h2>
            <div className="work-item">
              <strong>{formData.experience}</strong>
              <ul>
                <li>Automated secure file storage using AWS S3.</li>
                <li>Integrated and tested APIs with Postman.</li>
              </ul>
            </div>
          </section>

          <section className="resume-section">
            <h2 className="section-title">PROJECTS</h2>
            <p><strong>{formData.projects}</strong></p>
            <ul>
              <li>Managed ingestion and transformation of raw media assets.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;