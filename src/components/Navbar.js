import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar" style={{ padding: '0.8rem 2rem' }}>
      <div className="nav-brand">
        <a href="/" style={{ 
          textDecoration: 'none', 
          display: 'flex', 
          alignItems: 'baseline' 
        }}>
          <span className="my-text">My</span>
          <span className="tools-text">Tools</span>
        </a>
      </div>
      
      <div className="nav-links">
        {/* Your buttons here */}
      </div>
    </nav>
  );
};

export default Navbar;