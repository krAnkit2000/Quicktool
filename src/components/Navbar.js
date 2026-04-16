import React from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate(); 

  return (
    <nav className="navbar">
      <div className="nav-container">
        
        <div className="nav-brand" onClick={() => navigate('/')}>
          <div className="logo-icon">⚡</div>
          <div className="logo-text">
            <span className="my-text">My</span>
            <span className="tools-text">Tools</span>
          </div>
        </div>
        
        <div className="nav-links">
          <button className="nav-item" onClick={() => navigate('/')}>
            Home
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;