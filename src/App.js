import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ImgConvert from './Pages/ImgConvert';
import ImgCompress from './Pages/ImgCompress';
import UuidGen from './Pages/UuidGen';
import ImgBgRemove from './Pages/ImgBgRemove';
import PdfEditor from './Pages/PdfEditor';
import QrGenerator from './Pages/QrGenerator';
import './App.css';

function App() {
  const [activeTool, setActiveTool] = useState('dashboard');

  // Jab bhi activeTool change ho — browser history mein push karo
  useEffect(() => {
    window.history.pushState({ tool: activeTool }, '', window.location.pathname);
  }, [activeTool]);

  // Browser back/forward button press hone par — state update karo
  useEffect(() => {
    const handlePopState = (e) => {
      if (e.state && e.state.tool) {
        setActiveTool(e.state.tool);
      } else {
        setActiveTool('dashboard');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar setActiveTool={setActiveTool} />

      <div className="container mx-auto px-4 py-8">

        {activeTool === 'dashboard' && (
          <Dashboard setActiveTool={setActiveTool} />
        )}

        {activeTool === 'img-convert' && (
          <ImgConvert setActiveTool={setActiveTool} />
        )}

        {activeTool === 'img-compress' && (
          <ImgCompress setActiveTool={setActiveTool} />
        )}

        {activeTool === 'uuid' && (
          <UuidGen setActiveTool={setActiveTool} />
        )}

        {activeTool === 'img-bgremove' && (
          <ImgBgRemove setActiveTool={setActiveTool} />
        )}

        {activeTool === 'pdf-edit' && (
          <PdfEditor setActiveTool={setActiveTool} />
        )}

        {activeTool === 'qr-gen' && (
          <QrGenerator setActiveTool={setActiveTool} />
        )}

      </div>
    </div>
  );
}

export default App;