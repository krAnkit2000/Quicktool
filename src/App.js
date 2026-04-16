import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ImgConvert from './Pages/ImgConvert';
import ImgCompress from './Pages/ImgCompress';
import UuidGen from './Pages/UuidGen';
import ImgBgRemove from './Pages/ImgBgRemove';
import PdfEditor from './Pages/PdfEditor';
import QrGenerator from './Pages/QrGenerator';
import MakePdf from './Pages/MakePdf';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
       
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          <Routes>
            {/* Home/Dashboard Page */}
            <Route path="/" element={<Dashboard />} />
   <Route path="*" element={<Dashboard />} />
           
            <Route path="/img-convert" element={<ImgConvert />} />
            <Route path="/img-compress" element={<ImgCompress />} />
            <Route path="/uuid" element={<UuidGen />} />
            <Route path="/img-bgremove" element={<ImgBgRemove />} />
            <Route path="/pdf-edit" element={<PdfEditor />} />
            <Route path="/qr-gen" element={<QrGenerator />} />
           <Route path="/make-pdf" element={<MakePdf />} />
          
         

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;