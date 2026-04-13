import React from 'react';

const ToolIcons = {
  'img-convert': (
    <svg fill="none" viewBox="0 0 34 34" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4-4 4 4 4-8 4 8" />
      <rect x="3" y="3" width="28" height="28" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 3l2 2-2 2M8 3L6 5l2 2" />
    </svg>
  ),
  'img-compress': (
    <svg fill="none" viewBox="0 0 34 34" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="28" height="28" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v4a2 2 0 01-2 2H3M15 3v4a2 2 0 002 2h4M9 21v-4a2 2 0 00-2-2H3M15 21v-4a2 2 0 012-2h4" />
    </svg>
  ),
  'uuid': (
    <svg fill="none" viewBox="0 0 44 44" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="7" width="28" height="28" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 11h.01M10 11h.01M14 11h.01M18 11h.01M6 13h4M14 13h4" />
    </svg>
  ),
  'img-bgremove': (
    <svg fill="none" viewBox="0 0 44 44" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4l6 6m0 0l6 6M10 10L4 16M10 10l6-6" />
      <rect x="3" y="3" width="38" height="38" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
    </svg>
  ),
  'pdf-edit': (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h6M9 8h2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h9l5 5v13a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 3v5h5" />
    </svg>
  ),
  'qr-gen': (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z" />
      <rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none" />
      <rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none" />
      <rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none" />
    </svg>
  ),
};

// ─── Tool ke liye accent color ─────────────────────────────────────────────
const ToolColors = {
  'img-convert':  { bg: '#eff6ff', icon: '#3b82f6' },
  'img-compress': { bg: '#f0fdf4', icon: '#22c55e' },
  'uuid':         { bg: '#fdf4ff', icon: '#a855f7' },
  'img-bgremove': { bg: '#fff7ed', icon: '#f97316' },
  'pdf-edit':     { bg: '#fef2f2', icon: '#ef4444' },
  'qr-gen':       { bg: '#f0fdfa', icon: '#14b8a6' },
};

// ─── ToolCard Component ────────────────────────────────────────────────────
const ToolCard = ({ id, title, isActive }) => {

  // Empty / Under Development card
  if (!isActive) {
    return (
      <div className="tool-card empty" style={{ cursor: 'wait', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '10px', right: '-30px',
          background: '#3b82f6', color: 'white', fontSize: '0.6rem',
          padding: '2px 30px', transform: 'rotate(45deg)', fontWeight: 'bold'
        }}>
          DEV
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <svg
            style={{ width: '44px', height: '44px', color: '#e90800', animation: 'spin 3s linear infinite' }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="empty-text" style={{ fontSize: '1.1rem', color: '#ff0101' }}>New Tool</span>
          <span style={{
            fontSize: '0.7rem', color: '#0661f4', backgroundColor: '#f5f5f5',
            padding: '2px 8px', borderRadius: '12px', fontWeight: '600', letterSpacing: '0.5px'
          }}>
            UNDER DEVELOPMENT
          </span>
        </div>
      </div>
    );
  }

  // Active tool card
  const color = ToolColors[id] || { bg: '#f1f5f9', icon: '#64748b' };
  const icon  = ToolIcons[id];

  return (
    <div className="tool-card">
      <div className="card-icon" style={{
        backgroundColor: color.bg,
        color: color.icon,
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
      }}>
        <div style={{ width: '24px', height: '24px' }}>
          {icon}
        </div>
      </div>
      <h3>{title}</h3>
    </div>
  );
};

export default ToolCard;