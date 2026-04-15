import React from 'react';
import './Navbar.css';

const Navbar = ({ setActiveTool }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => setActiveTool('dashboard')}>
          <div className="logo-icon">⚡</div>
          <div className="logo-text">
            <span className="my-text">My</span>
            <span className="tools-text">Tools</span>
          </div>
        </div>
        
        <div className="nav-links">
          <button className="nav-item" onClick={() => setActiveTool('dashboard')}>Home</button>
      
        </div>
      </div>
    </nav>
  );
};

export default Navbar;