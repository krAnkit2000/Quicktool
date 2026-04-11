import React, { useState } from 'react';
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
  // 1. Ye state hona zaroori hai
  const [activeTool, setActiveTool] = useState('dashboard'); 

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* 2. Navbar mein pass kariye */}
      <Navbar setActiveTool={setActiveTool} /> 
      
      <div className="container mx-auto px-4 py-8">
        
        {/* 3. YAHAN Dashboard mein pass karna sabse zaroori hai */}
        {activeTool === 'dashboard' && (
          <Dashboard setActiveTool={setActiveTool} /> 
        )}
        
        {/* 4. ImgConvert mein bhi pass kariye (Back button ke liye) */}
        {activeTool === 'img-convert' && (
          <ImgConvert setActiveTool={setActiveTool} /> 
        )}
        {activeTool === 'img-compress' && <ImgCompress setActiveTool={setActiveTool} />}
       {activeTool === 'uuid' && <UuidGen setActiveTool={setActiveTool} />}
        

        {/* 5. Background Remover Page */}
        {activeTool === 'img-bgremove' && (
          <ImgBgRemove setActiveTool={setActiveTool} /> 
        )}

        {/* 6.PDF Editor Tool */}
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