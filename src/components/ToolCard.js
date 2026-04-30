import React from 'react';

const ToolIcons = {
  'img-convert': (
    <svg viewBox="0 0 34 34" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4-4 4 4 4-8 4 8" />
      <rect x="3" y="3" width="28" height="28" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 3l2 2-2 2M8 3L6 5l2 2" />
    </svg>
  ),

  'img-compress': (
    <svg viewBox="0 0 34 34" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="28" height="28" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v4a2 2 0 01-2 2H3M15 3v4a2 2 0 002 2h4M9 21v-4a2 2 0 00-2-2H3M15 21v-4a2 2 0 012-2h4" />
    </svg>
  ),

  'uuid': (
    <svg viewBox="0 0 34 44" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="7" width="32" height="32" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 11h.01M10 11h.01M14 11h.01M18 11h.01M6 13h4M14 13h4" />
    </svg>
  ),

  'img-bgremove': (
    <svg viewBox="0 0 44 44" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4l6 6m0 0l6 6M10 10L4 16M10 10l6-6" />
      <rect x="3" y="3" width="38" height="38" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
    </svg>
  ),

  'pdf-edit': (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h6M9 8h2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h9l5 5v13a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 3v5h5" />
    </svg>
  ),

'qr-gen': (
  <svg viewBox="0 0 24 2  4" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.6">
    {/* Background Grid Pattern - Subtle */}
    <path d="M3 8h18M3 16h18M8 3v18M16 3v18" strokeOpacity="0.1" strokeLinecap="round" />
    
    {/* The Focus Frame */}
    <path d="M3 8V5a2 2 0 012-2h3m8 0h3a2 2 0 012 2v3m0 8v3a2 2 0 01-2 2h-3m-8 0H5a2 2 0 01-2-2v-3" strokeLinecap="round" />
    
    {/* Generative Pixels (The "AI" part) */}
    <rect x="7" y="7" width="4" height="4" rx="1" fill="#ec4899" stroke="none" />
    <rect x="13" y="7" width="4" height="4" rx="1" fill="#ec4899" fillOpacity="0.4" stroke="none" />
    <rect x="7" y="13" width="4" height="4" rx="1" fill="#ec4899" fillOpacity="0.6" stroke="none" />
    
    {/* Magic Sparkle */}
    <path d="M16 14l.5 1.5L18 16l-1.5.5L16 18l-.5-1.5L14 16l1.5-.5L16 14z" fill="#ec4899" stroke="none" />
  </svg>
),

  'make-pdf': (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.8">
      {/* PDF Page Border */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 3H15L19 7V21C19 21.55 18.55 22 18 22H6C5.45 22 5 21.55 5 21V4C5 3.45 5.45 3 6 3H7Z" />
      {/* Top Folded Corner */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 3V8H19" />
      {/* Plus sign indicating 'Make/Create' */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15H15M12 12V18" />
    </svg>
  ),
  'ResumeBuilder': (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  'VideoConverter': (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="none">
      {/* Background Solid Shape like YouTube Logo */}
      <rect x="2" y="5" width="22" height="14" rx="5" fill="#ef4444" />
      {/* Center Play Button (White) */}
      <path 
        d="M10 9l5 3-5 3V9z" 
        fill="#ffffff" 
      />
    </svg>
  
  ),
  'image-gen': (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.6">
    {/* Modern Image Frame with rounded corners */}
    <rect x="3" y="4" width="18" height="16" rx="3" strokeLinecap="round" />
    
    {/* Mountains inside - Clear Visual clue */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16l5-5 4 4 4-4 5 5" strokeOpacity="0.4" />
    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" fillOpacity="0.2" strokeOpacity="0.4"/>
    
    {/* The Generative AI Wave / Magic Path (Pink Accent) */}
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M2 14l3-3.5a2 2 0 012.8 0L10 13M13 10.5l2.2-2.2a2 2 0 012.8 0L22 12" 
      stroke="#ec4899" 
      strokeWidth="2"
    />
    
    {/* The Glimmer/Sparkle (Processing effect) */}
    <path d="M19 8l.5 1.5L21 10l-1.5.5L19 12l-.5-1.5L17 10l1.5-.5L19 8z" fill="#ec4899" stroke="none" />
  </svg>
)
};


const ToolColors = {
  'img-convert':  { bg: '#eff6ff', icon: '#3b82f6', border: '#7e04f7' },
  'img-compress': { bg: '#f0fdf4', icon: '#22c55e', border: '#22c55e' },
  'image-gen': { bg: '#fdf2f8', icon: '#ec4899', border: '#fbcfe8' },
  'img-bgremove': { bg: '#fff7ed', icon: '#f97316', border: '#f76801' },
  'uuid':         { bg: '#fdf4ff', icon: '#800bee', border: '#7e2d41' },
  'pdf-edit':     { bg: '#fef2f2', icon: '#ef4444', border: '#8f6f6f' },
  'qr-gen':       { bg: '#f0fdfa', icon: '#76ffef', border: '#04ffe2db' },
  'VideoConverter': { bg: '#fff1f2', icon: '#f10707', border: '#fb0000' },
  'make-pdf':  { bg: '#fff1f2', icon: '#0d2bd3', border: '#1fd543' },
  
};

const ToolCard = ({ id, title, isActive }) => {
  if (!isActive) {
    return (
     <div className="tool-card empty" style={{ cursor: 'not-allowed' }}>
      
        <div className="dev-badge">DEV</div>
        
        <div className="empty-content">
          <div className="card-icon gear-animate">
             <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
             </svg>
          </div>
          <h3>Coming Soon</h3>
          <span className="status-tag">Under Development</span>
        </div>
      </div>
    );
  }

  const color = ToolColors[id] || { bg: '#f1f5f9', icon: '#64748b', border: '#64748b' };
  const icon  = ToolIcons[id];

  return (
    <div className="tool-card active-card" style={{ '--accent-color': color.border }}>
      
      {/* ICON FIX */}
      <div
        className="card-icon"
        style={{
          backgroundColor: color.bg,
          color: color.icon,
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{ width: '26px', height: '26px' }}>
          {icon}
        </div>
      </div>

      <h3>{title}</h3>
    </div>
  );
};

export default ToolCard;