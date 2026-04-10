import React from 'react';

const ToolCard = ({ title, isActive }) => {
  if (!isActive) {
    return (
      <div className="tool-card empty" style={{ cursor: 'wait', position: 'relative', overflow: 'hidden' }}>
  
  {/* Corner Ribbon (Optional) */}
  <div style={{
    position: 'absolute',
    top: '10px',
    right: '-30px',
    background: '#3b82f6',
    color: 'white',
    fontSize: '0.6rem',
    padding: '2px 30px',
    transform: 'rotate(45deg)',
    fontWeight: 'bold'
  }}>
    DEV
  </div>

  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
    {/* Animated Gear/Settings Icon */}
    <svg 
      className="animate-spin" 
      style={{ width: '24px', height: '24px', color: '#94a3b8', animation: 'spin 3s linear infinite' }} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>

    <span className="empty-text" style={{ fontSize: '1.1rem', color: '#64748b' }}>
      New Tool
    </span>
    
    <span style={{ 
      fontSize: '0.7rem', 
      color: '#3b82f6', 
      backgroundColor: '#eff6ff', 
      padding: '2px 8px', 
      borderRadius: '12px',
      fontWeight: '600',
      letterSpacing: '0.5px'
    }}>
      UNDER DEVELOPMENT
    </span>
  </div>
</div>
    );
  }

  return (
    <div className="tool-card">
      <div className="card-icon">
        {/* Placeholder Icon */}
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
      <h3>{title}</h3>
    </div>
  );
};

export default ToolCard;