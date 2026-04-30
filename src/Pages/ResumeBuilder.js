import { useState, useRef } from "react";
import "./ResumeBuilder.css";

// ── SKILLS PARSER ────────────────────────────────────────────────────────────
// Supports two formats:
// 1. "Frontend: React, Vue | Backend: Node.js"  → category groups
// 2. "React, Node.js, Python"                   → plain list
function parseSkills(raw) {
  if (!raw.trim()) return [];
  // Check if pipe-separated categories exist
  if (raw.includes('|') || raw.includes(':')) {
    const groups = raw.split('|').map(g => g.trim()).filter(Boolean);
    return groups.map(g => {
      const colonIdx = g.indexOf(':');
      if (colonIdx === -1) return { category: null, items: g.split(',').map(s => s.trim()).filter(Boolean) };
      return {
        category: g.slice(0, colonIdx).trim(),
        items: g.slice(colonIdx + 1).split(',').map(s => s.trim()).filter(Boolean),
      };
    });
  }
  // Plain comma list
  return [{ category: null, items: raw.split(',').map(s => s.trim()).filter(Boolean) }];
}

// ── TEMPLATES ────────────────────────────────────────────────────────────────
const TEMPLATES = [
  { id: "classic",  label: "Classic",  accent: "#1e3a5f" },
  { id: "modern",   label: "Modern",   accent: "#0f766e" },
  { id: "bold",     label: "Bold",     accent: "#7c3aed" },
  { id: "minimal",  label: "Minimal",  accent: "#111111" },
];

// ── DEFAULT FORM DATA ────────────────────────────────────────────────────────
const DEFAULT = {
  name:       "",
  title:      "",
  email:      "",
  phone:      "",
  location:   "",
  linkedin:   "",
  summary:    "",
  experience: [{ company: "", role: "", duration: "", points: "" }],
  education:  [{ school: "", degree: "", year: "" }],
  skills:     "",
  projects:   [{ name: "", desc: "" }],
};

// ── SMALL HELPERS ────────────────────────────────────────────────────────────
const Input = ({ label, value, onChange, placeholder, textarea }) =>
  textarea ? (
    <div className="rb-field">
      <label className="rb-label">{label}</label>
      <textarea className="rb-input rb-textarea" value={value} onChange={onChange} placeholder={placeholder} rows={3} />
    </div>
  ) : (
    <div className="rb-field">
      <label className="rb-label">{label}</label>
      <input className="rb-input" value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );

// ── RESUME PREVIEW TEMPLATES ─────────────────────────────────────────────────

// Classic — two-column, navy sidebar
function ClassicResume({ data, accent }) {
  const skillGroups = parseSkills(data.skills);
  return (
    <div className="resume-classic">
      <div className="rc-sidebar" style={{ background: accent }}>
        <div className="rc-name">{data.name || "Your Name"}</div>
        <div className="rc-title">{data.title || "Job Title"}</div>
        <div className="rc-divider" />
        {data.email    && <div className="rc-contact-item">✉ {data.email}</div>}
        {data.phone    && <div className="rc-contact-item">📞 {data.phone}</div>}
        {data.location && <div className="rc-contact-item">📍 {data.location}</div>}
        {data.linkedin && <div className="rc-contact-item">🔗 {data.linkedin}</div>}
        {skillGroups.length > 0 && skillGroups[0].items.length > 0 && (
          <>
            <div className="rc-section-title" style={{ marginTop: 20 }}>Skills</div>
            <div className="rc-divider" />
            {skillGroups.map((grp, gi) => (
              <div key={gi} style={{ marginBottom: 8 }}>
                {grp.category && <div className="rc-skill-category">{grp.category}</div>}
                <div>{grp.items.map((s, i) => <span key={i} className="rc-skill-chip">{s}</span>)}</div>
              </div>
            ))}
          </>
        )}
        {data.education.map((e, i) => e.school && (
          <div key={i} style={{ marginTop: i === 0 ? 20 : 0 }}>
            {i === 0 && <><div className="rc-section-title">Education</div><div className="rc-divider" /></>}
            <div className="rc-edu-school">{e.school}</div>
            <div className="rc-edu-deg">{e.degree}</div>
            <div className="rc-edu-year">{e.year}</div>
          </div>
        ))}
      </div>
      <div className="rc-main">
        {data.summary && (
          <div className="rc-block">
            <div className="rc-main-title" style={{ color: accent }}>Summary</div>
            <div className="rc-main-divider" style={{ background: accent }} />
            <p className="rc-summary">{data.summary}</p>
          </div>
        )}
        {data.experience.some(e => e.company) && (
          <div className="rc-block">
            <div className="rc-main-title" style={{ color: accent }}>Experience</div>
            <div className="rc-main-divider" style={{ background: accent }} />
            {data.experience.map((exp, i) => exp.company && (
              <div key={i} className="rc-exp-item">
                <div className="rc-exp-role">{exp.role}</div>
                <div className="rc-exp-meta">{exp.company} {exp.duration && `· ${exp.duration}`}</div>
                {exp.points && exp.points.split("\n").filter(Boolean).map((pt, j) => (
                  <div key={j} className="rc-exp-point">• {pt}</div>
                ))}
              </div>
            ))}
          </div>
        )}
        {data.projects.some(p => p.name) && (
          <div className="rc-block">
            <div className="rc-main-title" style={{ color: accent }}>Projects</div>
            <div className="rc-main-divider" style={{ background: accent }} />
            {data.projects.map((p, i) => p.name && (
              <div key={i} className="rc-exp-item">
                <div className="rc-exp-role">{p.name}</div>
                <p className="rc-summary">{p.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Modern — header banner, clean sections
function ModernResume({ data, accent }) {
  const skillGroups = parseSkills(data.skills);
  return (
    <div className="resume-modern">
      <div className="rm-header" style={{ borderBottom: `4px solid ${accent}` }}>
        <div className="rm-name">{data.name || "Your Name"}</div>
        <div className="rm-title" style={{ color: accent }}>{data.title || "Job Title"}</div>
        <div className="rm-contacts">
          {data.email    && <span>✉ {data.email}</span>}
          {data.phone    && <span>📞 {data.phone}</span>}
          {data.location && <span>📍 {data.location}</span>}
          {data.linkedin && <span>🔗 {data.linkedin}</span>}
        </div>
      </div>
      <div className="rm-body">
        {data.summary && (
          <div className="rm-section">
            <div className="rm-sec-title" style={{ color: accent }}>About Me</div>
            <p className="rm-text">{data.summary}</p>
          </div>
        )}
        {data.experience.some(e => e.company) && (
          <div className="rm-section">
            <div className="rm-sec-title" style={{ color: accent }}>Experience</div>
            {data.experience.map((exp, i) => exp.company && (
              <div key={i} className="rm-exp">
                <div className="rm-exp-top">
                  <span className="rm-exp-role">{exp.role}</span>
                  <span className="rm-exp-dur">{exp.duration}</span>
                </div>
                <div className="rm-exp-co">{exp.company}</div>
                {exp.points && exp.points.split("\n").filter(Boolean).map((pt, j) => (
                  <div key={j} className="rm-point">▸ {pt}</div>
                ))}
              </div>
            ))}
          </div>
        )}
        <div className="rm-two-col">
          {data.education.some(e => e.school) && (
            <div className="rm-section">
              <div className="rm-sec-title" style={{ color: accent }}>Education</div>
              {data.education.map((e, i) => e.school && (
                <div key={i} className="rm-edu">
                  <div className="rm-edu-deg">{e.degree}</div>
                  <div className="rm-edu-school">{e.school} · {e.year}</div>
                </div>
              ))}
            </div>
          )}
          {skillGroups.length > 0 && skillGroups[0].items.length > 0 && (
            <div className="rm-section">
              <div className="rm-sec-title" style={{ color: accent }}>Skills</div>
              {skillGroups.map((grp, gi) => (
                <div key={gi} className="rm-skill-group">
                  {grp.category && <div className="rm-skill-cat">{grp.category}</div>}
                  <div className="rm-skills">
                    {grp.items.map((s, i) => (
                      <span key={i} className="rm-skill" style={{ borderColor: accent, color: accent }}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {data.projects.some(p => p.name) && (
          <div className="rm-section">
            <div className="rm-sec-title" style={{ color: accent }}>Projects</div>
            {data.projects.map((p, i) => p.name && (
              <div key={i} className="rm-exp">
                <div className="rm-exp-role">{p.name}</div>
                <p className="rm-text">{p.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Bold — full-width accent header, strong typography
function BoldResume({ data, accent }) {
  const skillGroups = parseSkills(data.skills);
  return (
    <div className="resume-bold">
      <div className="rb2-header" style={{ background: accent }}>
        <div className="rb2-name">{data.name || "Your Name"}</div>
        <div className="rb2-title">{data.title || "Job Title"}</div>
        <div className="rb2-contacts">
          {data.email    && <span>{data.email}</span>}
          {data.phone    && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
        </div>
      </div>
      <div className="rb2-body">
        {data.summary && (
          <div className="rb2-section">
            <div className="rb2-sec-label" style={{ background: accent }}>SUMMARY</div>
            <p className="rb2-text">{data.summary}</p>
          </div>
        )}
        {data.experience.some(e => e.company) && (
          <div className="rb2-section">
            <div className="rb2-sec-label" style={{ background: accent }}>EXPERIENCE</div>
            {data.experience.map((exp, i) => exp.company && (
              <div key={i} className="rb2-exp">
                <div className="rb2-exp-role">{exp.role} <span className="rb2-exp-co">@ {exp.company}</span></div>
                {exp.duration && <div className="rb2-exp-dur">{exp.duration}</div>}
                {exp.points && exp.points.split("\n").filter(Boolean).map((pt, j) => (
                  <div key={j} className="rb2-point">— {pt}</div>
                ))}
              </div>
            ))}
          </div>
        )}
        <div className="rb2-two">
          {data.education.some(e => e.school) && (
            <div className="rb2-section">
              <div className="rb2-sec-label" style={{ background: accent }}>EDUCATION</div>
              {data.education.map((e, i) => e.school && (
                <div key={i} className="rb2-edu">
                  <div className="rb2-edu-deg">{e.degree}</div>
                  <div className="rb2-edu-school">{e.school}</div>
                  <div className="rb2-edu-year">{e.year}</div>
                </div>
              ))}
            </div>
          )}
          {skillGroups.length > 0 && skillGroups[0].items.length > 0 && (
            <div className="rb2-section">
              <div className="rb2-sec-label" style={{ background: accent }}>SKILLS</div>
              {skillGroups.map((grp, gi) => (
                <div key={gi} style={{ marginBottom: 8 }}>
                  {grp.category && <div className="rb2-skill-cat">{grp.category}</div>}
                  {grp.items.map((s, i) => <div key={i} className="rb2-skill">▪ {s}</div>)}
                </div>
              ))}
            </div>
          )}
        </div>
        {data.projects.some(p => p.name) && (
          <div className="rb2-section">
            <div className="rb2-sec-label" style={{ background: accent }}>PROJECTS</div>
            {data.projects.map((p, i) => p.name && (
              <div key={i} className="rb2-exp">
                <div className="rb2-exp-role">{p.name}</div>
                <p className="rb2-text">{p.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Minimal — ultra clean, black/white, line separators
function MinimalResume({ data }) {
  const skillGroups = parseSkills(data.skills);
  return (
    <div className="resume-minimal">
      <div className="rmin-top">
        <div className="rmin-name">{data.name || "Your Name"}</div>
        <div className="rmin-title">{data.title || "Job Title"}</div>
        <div className="rmin-contacts">
          {[data.email, data.phone, data.location, data.linkedin].filter(Boolean).join("  ·  ")}
        </div>
      </div>
      <div className="rmin-hr" />
      {data.summary && (
        <>
          <p className="rmin-summary">{data.summary}</p>
          <div className="rmin-hr" />
        </>
      )}
      {data.experience.some(e => e.company) && (
        <div className="rmin-section">
          <div className="rmin-sec-title">Experience</div>
          {data.experience.map((exp, i) => exp.company && (
            <div key={i} className="rmin-exp">
              <div className="rmin-exp-top">
                <span className="rmin-exp-role">{exp.role}, {exp.company}</span>
                <span className="rmin-exp-dur">{exp.duration}</span>
              </div>
              {exp.points && exp.points.split("\n").filter(Boolean).map((pt, j) => (
                <div key={j} className="rmin-point">· {pt}</div>
              ))}
            </div>
          ))}
        </div>
      )}
     
      {skillGroups.length > 0 && skillGroups[0].items.length > 0 && (
        <div className="rmin-section">
          <div className="rmin-sec-title">Skills</div>
          {skillGroups.map((grp, gi) => (
            <div key={gi} style={{ marginBottom: 6 }}>
              {grp.category && <span className="rmin-skill-cat">{grp.category}: </span>}
              <span className="rmin-skills">{grp.items.join("  ·  ")}</span>
            </div>
          ))}
        </div>
      )}
      {data.projects.some(p => p.name) && (
        <div className="rmin-section">
          <div className="rmin-sec-title">Projects</div>
          {data.projects.map((p, i) => p.name && (
            <div key={i} className="rmin-exp">
              <div className="rmin-exp-role">{p.name}</div>
              <p className="rmin-point">{p.desc}</p>
            </div>
          ))}
        </div>
      )}


       {data.education.some(e => e.school) && (
        <div className="rmin-section">
          <div className="rmin-sec-title">Education</div>
          {data.education.map((e, i) => e.school && (
            <div key={i} className="rmin-exp">
              <div className="rmin-exp-top">
                <span className="rmin-exp-role">{e.degree}, {e.school}</span>
                <span className="rmin-exp-dur">{e.year}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function ResumeBuilder({ setActiveTool }) {
  const [data, setData]           = useState(DEFAULT);
  const [template, setTemplate]   = useState("classic");
  const [tab, setTab]             = useState("form");   // form | preview
  const printRef                  = useRef(null);

  const tmpl = TEMPLATES.find(t => t.id === template);

  // Generic field updater
  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }));

  // Array field updater
  const setArr = (key, i, field, val) =>
    setData(prev => {
      const arr = [...prev[key]];
      arr[i] = { ...arr[i], [field]: val };
      return { ...prev, [key]: arr };
    });

  const addExp = () => set("experience", [...data.experience, { company: "", role: "", duration: "", points: "" }]);
  const removeExp = (i) => set("experience", data.experience.filter((_, idx) => idx !== i));

  const addEdu = () => set("education", [...data.education, { school: "", degree: "", year: "" }]);
  const removeEdu = (i) => set("education", data.education.filter((_, idx) => idx !== i));

  const addProj = () => set("projects", [...data.projects, { name: "", desc: "" }]);
  const removeProj = (i) => set("projects", data.projects.filter((_, idx) => idx !== i));

  // Print / Download as PDF — fully inline CSS so preview matches print exactly
  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const css = `/* ============================================================
   ResumeBuilder.css — Resume Builder + 4 Templates
   ============================================================ */

/* ── Page Layout ─────────────────────────────────────────── */
.rb-page {
  min-height: 100vh;
  background: #f1f5f9;
  font-family: 'Segoe UI', sans-serif;
  padding-bottom: 40px;
}

/* Top bar */
.rb-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 14px 24px;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.rb-back {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
}
.rb-back:hover { opacity: 0.7; }

.rb-topbar-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
}

.rb-print-btn {
  background: #1e293b;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s;
}
.rb-print-btn:hover { opacity: 0.85; }

/* Template selector */
.rb-templates {
  display: flex;
  gap: 8px;
  padding: 14px 24px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  flex-wrap: wrap;
}

.rb-tmpl-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 20px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  font-size: 0.83rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s;
}
.rb-tmpl-btn:hover { border-color: #94a3b8; }
.rb-tmpl-btn--active { background: #fff; font-weight: 700; }

.rb-tmpl-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Mobile tab switcher */
.rb-mob-tabs {
  display: none;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
}
.rb-mob-tab {
  flex: 1;
  padding: 12px;
  border: none;
  background: none;
  font-size: 0.88rem;
  font-weight: 600;
  color: #94a3b8;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}
.rb-mob-tab.active { color: #3b82f6; border-bottom-color: #3b82f6; }

/* Main layout — side by side */
.rb-layout {
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 0;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 24px;
  gap: 20px;
}

/* Form panel */
.rb-form-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
  max-height: calc(100vh - 140px);
  padding-right: 4px;
}
.rb-form-panel::-webkit-scrollbar { width: 4px; }
.rb-form-panel::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

/* Section card */
.rb-section-card {
  background: #fff;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.05);
}

.rb-sec-head {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Form fields */
.rb-field {
  margin-bottom: 10px;
}
.rb-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.rb-input {
  width: 100%;
  padding: 9px 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.88rem;
  color: #1e293b;
  background: #f8fafc;
  outline: none;
  transition: border-color 0.15s;
  box-sizing: border-box;
  font-family: inherit;
}
.rb-input:focus { border-color: #3b82f6; background: #fff; }
.rb-textarea { resize: vertical; min-height: 70px; }

/* Repeat blocks */
.rb-repeat-block {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 10px;
  background: #fafafa;
}
.rb-repeat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 10px;
}
.rb-add-btn {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #3b82f6;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
}
.rb-add-btn:hover { background: #dbeafe; }
.rb-remove-btn {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #ef4444;
  font-size: 0.75rem;
  padding: 3px 8px;
  border-radius: 5px;
  cursor: pointer;
}

/* Preview panel */
.rb-preview-panel {
  position: sticky;
  top: 20px;
  height: calc(100vh - 100px);
  overflow-y: auto;
  align-self: start;
}
.rb-preview-scroll {
  background: #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  min-height: 100%;
}
.rb-preview-paper {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
  overflow: hidden;
  min-height: 800px;
}

/* Mobile hidden */
.rb-hidden-mob { display: none; }

/* Hidden only on mobile (used for preview panel toggle) */
@media (max-width: 900px) {
  .rb-mob-hidden { display: none !important; }
}

/* ── TEMPLATE: CLASSIC ───────────────────────────────────── */
.resume-classic {
  display: flex;
  min-height: 800px;
  font-size: 12px;
}

.rc-sidebar {
  width: 220px;
  flex-shrink: 0;
  padding: 28px 18px;
  color: #fff;
}

.rc-name {
  font-size: 20px;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 4px;
  word-break: break-word;
}
.rc-title {
  font-size: 11px;
  opacity: 0.85;
  margin-bottom: 14px;
  letter-spacing: 0.5px;
}
.rc-divider {
  height: 1px;
  background: rgba(255,255,255,0.3);
  margin-bottom: 12px;
}
.rc-contact-item {
  font-size: 10.5px;
  opacity: 0.9;
  margin-bottom: 6px;
  word-break: break-all;
}
.rc-section-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  opacity: 0.7;
  margin-bottom: 6px;
}
.rc-skill-chip {
  background: rgba(255,255,255,0.15);
  border-radius: 3px;
  padding: 3px 8px;
  font-size: 10px;
  margin-bottom: 5px;
  display: inline-block;
  margin-right: 4px;
}
.rc-edu-school { font-weight: 700; font-size: 11px; margin-top: 8px; }
.rc-edu-deg    { font-size: 10px; opacity: 0.85; }
.rc-edu-year   { font-size: 10px; opacity: 0.65; }

.rc-main {
  flex: 1;
  padding: 28px 22px;
}
.rc-block { margin-bottom: 20px; }
.rc-main-title {
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
}
.rc-main-divider { height: 2px; margin-bottom: 10px; }
.rc-summary { font-size: 11px; color: #475569; line-height: 1.6; }
.rc-exp-item { margin-bottom: 12px; }
.rc-exp-role { font-weight: 700; font-size: 12px; color: #1e293b; }
.rc-exp-meta { font-size: 10.5px; color: #64748b; margin-bottom: 4px; }
.rc-exp-point { font-size: 10.5px; color: #475569; margin-bottom: 2px; padding-left: 8px; }

/* ── TEMPLATE: MODERN ───────────────────────────────────── */
.resume-modern {
  font-size: 12px;
  min-height: 800px;
}
.rm-header {
  padding: 24px 28px 16px;
}
.rm-name {
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 2px;
}
.rm-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 10px;
  letter-spacing: 0.3px;
}
.rm-contacts {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 10.5px;
  color: #64748b;
}
.rm-body { padding: 18px 28px; }
.rm-section { margin-bottom: 18px; }
.rm-sec-title {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin-bottom: 8px;
}
.rm-text { font-size: 11px; color: #475569; line-height: 1.6; }
.rm-exp { margin-bottom: 12px; }
.rm-exp-top { display: flex; justify-content: space-between; align-items: baseline; }
.rm-exp-role { font-weight: 700; font-size: 12px; color: #0f172a; }
.rm-exp-dur  { font-size: 10px; color: #94a3b8; }
.rm-exp-co   { font-size: 10.5px; color: #64748b; margin-bottom: 4px; }
.rm-point    { font-size: 10.5px; color: #475569; margin-bottom: 2px; padding-left: 8px; }
.rm-two-col  { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.rm-edu      { margin-bottom: 8px; }
.rm-edu-deg  { font-weight: 600; font-size: 11px; color: #0f172a; }
.rm-edu-school { font-size: 10.5px; color: #64748b; }
.rm-skills   { display: flex; flex-wrap: wrap; gap: 5px; }
.rm-skill {
  border: 1px solid;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 600;
}

/* ── TEMPLATE: BOLD ─────────────────────────────────────── */
.resume-bold { font-size: 12px; min-height: 800px; }
.rb2-header {
  padding: 28px 28px 20px;
  color: #fff;
}
.rb2-name {
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.5px;
  margin-bottom: 4px;
}
.rb2-title {
  font-size: 13px;
  opacity: 0.85;
  font-weight: 500;
  margin-bottom: 10px;
}
.rb2-contacts {
  display: flex;
  gap: 14px;
  font-size: 10.5px;
  opacity: 0.8;
  flex-wrap: wrap;
}
.rb2-body { padding: 18px 28px; }
.rb2-section { margin-bottom: 16px; }
.rb2-sec-label {
  display: inline-block;
  color: #fff;
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 1.5px;
  padding: 2px 10px;
  border-radius: 2px;
  margin-bottom: 10px;
}
.rb2-text { font-size: 11px; color: #475569; line-height: 1.6; }
.rb2-exp  { margin-bottom: 12px; }
.rb2-exp-role { font-size: 12px; font-weight: 700; color: #0f172a; }
.rb2-exp-co   { font-weight: 400; color: #64748b; }
.rb2-exp-dur  { font-size: 10.5px; color: #94a3b8; margin-bottom: 4px; }
.rb2-point    { font-size: 10.5px; color: #475569; margin-bottom: 2px; padding-left: 8px; }
.rb2-two      { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.rb2-edu      { margin-bottom: 8px; }
.rb2-edu-deg  { font-weight: 600; font-size: 11px; color: #0f172a; }
.rb2-edu-school { font-size: 10.5px; color: #64748b; }
.rb2-edu-year { font-size: 10px; color: #94a3b8; }
.rb2-skill    { font-size: 10.5px; color: #334155; margin-bottom: 4px; }

/* ── TEMPLATE: MINIMAL ──────────────────────────────────── */
.resume-minimal {
  font-size: 12px;
  padding: 36px 40px;
  min-height: 800px;
  background: #fff;
  color: #111;
}
.rmin-top { margin-bottom: 16px; }
.rmin-name {
  font-size: 26px;
  font-weight: 900;
  letter-spacing: -0.5px;
  color: #000;
  margin-bottom: 2px;
}
.rmin-title {
  font-size: 13px;
  color: #555;
  margin-bottom: 6px;
  font-weight: 400;
}
.rmin-contacts { font-size: 10.5px; color: #888; }
.rmin-hr {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 14px 0;
}
.rmin-summary { font-size: 11px; color: #444; line-height: 1.7; margin-bottom: 0; }
.rmin-section { margin-bottom: 14px; }
.rmin-sec-title {
  font-size: 9.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #888;
  margin-bottom: 8px;
}
.rmin-exp { margin-bottom: 10px; }
.rmin-exp-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 3px;
}
.rmin-exp-role { font-weight: 700; font-size: 11.5px; color: #111; }
.rmin-exp-dur  { font-size: 10px; color: #999; }
.rmin-point    { font-size: 10.5px; color: #555; margin-bottom: 2px; padding-left: 8px; line-height: 1.5; }
.rmin-skills   { font-size: 11px; color: #444; line-height: 1.8; }

/* ── Responsive ─────────────────────────────────────────── */
@media (max-width: 900px) {
  .rb-layout {
    grid-template-columns: 1fr;
    padding: 12px 14px;
  }
  .rb-form-panel {
    max-height: none;
  }
  .rb-preview-panel {
    position: static;
    height: auto;
  }
  .rb-mob-tabs { display: flex; }
  .rb-hidden-mob { display: none !important; }
  .rb-form-panel:not(.rb-hidden-mob),
  .rb-preview-panel:not(.rb-hidden-mob) { display: flex; flex-direction: column; }
}

@page {
  margin: 0;
  size: A4;
}

@media print {
  .rb-page { background: #fff; padding: 0; }
  .rb-topbar, .rb-templates, .rb-mob-tabs, .rb-form-panel { display: none !important; }
  .rb-layout { grid-template-columns: 1fr; padding: 0; }
  .rb-preview-panel { position: static; height: auto; }
  .rb-preview-scroll { background: none; padding: 0; }
  .rb-preview-paper { box-shadow: none; }
}
`;
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>${data.name || "Resume"}</title>
          <style>
            @page { margin: 0; size: A4; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            ${css}
          </style>
        </head>
        <body style="margin:0;padding:0;">${printContent}</body>
      </html>
    `);
    win.document.close();
    setTimeout(() => { win.print(); win.close(); }, 600);
  };

  const renderPreview = () => {
    switch (template) {
      case "classic": return <ClassicResume data={data} accent={tmpl.accent} />;
      case "modern":  return <ModernResume  data={data} accent={tmpl.accent} />;
      case "bold":    return <BoldResume    data={data} accent={tmpl.accent} />;
      case "minimal": return <MinimalResume data={data} accent={tmpl.accent} />;
      default:        return null;
    }
  };

  return (
    <div className="rb-page">

      {/* Top bar */}
      <div className="rb-topbar">
        <button className="rb-back" onClick={() => setActiveTool("dashboard")}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <div className="rb-topbar-title">📄 Resume Builder</div>
        <button className="rb-print-btn" onClick={handlePrint}>⬇ Download PDF</button>
      </div>

      {/* Template selector */}
      <div className="rb-templates">
        {TEMPLATES.map(t => (
          <button
            key={t.id}
            className={`rb-tmpl-btn ${template === t.id ? "rb-tmpl-btn--active" : ""}`}
            style={template === t.id ? { borderColor: t.accent, color: t.accent } : {}}
            onClick={() => setTemplate(t.id)}
          >
            <span className="rb-tmpl-dot" style={{ background: t.accent }} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Mobile tab switcher */}
      <div className="rb-mob-tabs">
        <button className={`rb-mob-tab ${tab === "form" ? "active" : ""}`} onClick={() => setTab("form")}>✏ Edit</button>
        <button className={`rb-mob-tab ${tab === "preview" ? "active" : ""}`} onClick={() => setTab("preview")}>👁 Preview</button>
      </div>

      {/* Main layout */}
      <div className="rb-layout">

        {/* LEFT — Form */}
        <div className={`rb-form-panel ${tab === "preview" ? "rb-hidden-mob" : ""}`}>

          <div className="rb-section-card">
            <div className="rb-sec-head">Personal Info</div>
            <Input label="Full Name"    value={data.name}     onChange={e => set("name", e.target.value)}     placeholder="Ankit Kumar" />
            <Input label="Job Title"    value={data.title}    onChange={e => set("title", e.target.value)}    placeholder="Frontend Developer" />
            <Input label="Email"        value={data.email}    onChange={e => set("email", e.target.value)}    placeholder="ankit@email.com" />
            <Input label="Phone"        value={data.phone}    onChange={e => set("phone", e.target.value)}    placeholder="+91 98765 43210" />
            <Input label="Location"     value={data.location} onChange={e => set("location", e.target.value)} placeholder="Delhi, India" />
            <Input label="LinkedIn"     value={data.linkedin} onChange={e => set("linkedin", e.target.value)} placeholder="linkedin.com/in/ankit" />
            <Input label="Summary"      value={data.summary}  onChange={e => set("summary", e.target.value)}  placeholder="Brief about yourself..." textarea />
          </div>

          <div className="rb-section-card">
            <div className="rb-sec-head">
              Experience
              <button className="rb-add-btn" onClick={addExp}>+ Add</button>
            </div>
            {data.experience.map((exp, i) => (
              <div key={i} className="rb-repeat-block">
                <div className="rb-repeat-header">
                  <span>Experience {i + 1}</span>
                  {data.experience.length > 1 && (
                    <button className="rb-remove-btn" onClick={() => removeExp(i)}>✕ Remove</button>
                  )}
                </div>
                <Input label="Company"  value={exp.company}  onChange={e => setArr("experience", i, "company", e.target.value)}  placeholder="Google" />
                <Input label="Role"     value={exp.role}     onChange={e => setArr("experience", i, "role", e.target.value)}     placeholder="Software Engineer" />
                <Input label="Duration" value={exp.duration} onChange={e => setArr("experience", i, "duration", e.target.value)} placeholder="Jan 2022 – Present" />
                <Input label="Points (one per line)" value={exp.points} onChange={e => setArr("experience", i, "points", e.target.value)} placeholder={"Built X feature\nImproved Y by 30%"} textarea />
              </div>
            ))}
          </div>

          <div className="rb-section-card">
            <div className="rb-sec-head">
              Education
              <button className="rb-add-btn" onClick={addEdu}>+ Add</button>
            </div>
            {data.education.map((edu, i) => (
              <div key={i} className="rb-repeat-block">
                <div className="rb-repeat-header">
                  <span>Education {i + 1}</span>
                  {data.education.length > 1 && (
                    <button className="rb-remove-btn" onClick={() => removeEdu(i)}>✕ Remove</button>
                  )}
                </div>
                <Input label="School/University" value={edu.school} onChange={e => setArr("education", i, "school", e.target.value)} placeholder="IIT Delhi" />
                <Input label="Degree"            value={edu.degree} onChange={e => setArr("education", i, "degree", e.target.value)} placeholder="B.Tech Computer Science" />
                <Input label="Year"              value={edu.year}   onChange={e => setArr("education", i, "year", e.target.value)}   placeholder="2018 – 2022" />
              </div>
            ))}
          </div>

          <div className="rb-section-card">
            <div className="rb-sec-head">Skills</div>
            <Input label="Skills (e.g. Frontend: React, Vue | Backend: Node.js, Python)" value={data.skills} onChange={e => set("skills", e.target.value)} placeholder="Frontend: React, Vue | Backend: Node.js | Cloud: AWS, GCP" textarea />
          </div>

          <div className="rb-section-card">
            <div className="rb-sec-head">
              Projects
              <button className="rb-add-btn" onClick={addProj}>+ Add</button>
            </div>
            {data.projects.map((proj, i) => (
              <div key={i} className="rb-repeat-block">
                <div className="rb-repeat-header">
                  <span>Project {i + 1}</span>
                  {data.projects.length > 1 && (
                    <button className="rb-remove-btn" onClick={() => removeProj(i)}>✕ Remove</button>
                  )}
                </div>
                <Input label="Project Name"  value={proj.name} onChange={e => setArr("projects", i, "name", e.target.value)} placeholder="MyTools App" />
                <Input label="Description"   value={proj.desc} onChange={e => setArr("projects", i, "desc", e.target.value)} placeholder="A tool to..." textarea />
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT — Preview — always visible on desktop, toggled on mobile */}
        <div className={`rb-preview-panel ${tab === "form" ? "rb-mob-hidden" : ""}`}>
          <div className="rb-preview-scroll">
            <div ref={printRef} className="rb-preview-paper">
              {renderPreview()}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}