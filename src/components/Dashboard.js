import React from 'react';
import ToolCard from './ToolCard'; 

const Dashboard = ({ setActiveTool }) => {
  const tools = [
    { id: 'img-convert', title: 'Img Convert', active: true },
    { id: 'img-compress', title: 'Img Compress', active: true },
    { id: 'uuid', title: 'UUID', active: true },
    { id: 'img-bgremove', title: 'Img BgRemove', active: true },
    { id: 'pdf-edit', title: 'PDF Edit', active: true },
      { id: 'qr-gen', title: 'QR Generator', active: true },
    { id: 'empty', title: 'Empty', active: false },
  
    
  ];

  return (
    <div style={{ width: '100%' }}>
      <h1 className="dashboard-title" style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#1e293b' }}>
        Dashboard Tools
      </h1>
      
      {/* Yahi class boxes banati hai */}
      <div className="tools-grid">
        {tools.map((tool) => (
          <div 
            key={tool.id} 
            onClick={() => tool.active && setActiveTool(tool.id)}
            style={{ textDecoration: 'none' }}
          >
            <ToolCard 
              title={tool.title} 
              isActive={tool.active} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;