import React from 'react';
import ToolCard from './ToolCard'; 
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate(); 

  const tools = [
    { id: 'img-convert',  title: 'Img Convert',  active: true  },
    { id: 'img-compress', title: 'Img Compress',  active: true  },
    { id: 'pdf-edit',     title: 'PDF Tools',      active: true  },
    { id: 'make-pdf',       title: 'Make-Pdf',  active: true  },
    { id: 'uuid',         title: 'UUID',          active: true  },
    { id: 'img-bgremove', title: 'Img BgRemove',  active: true  },
    { id: 'qr-gen',       title: 'QR Generator',  active: true  },
    { id: 'empty',        title: 'Empty',         active: false },
  ];

  return (
    <div style={{ width: '100%' }}>
      <div className="tools-grid">
        {tools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => tool.active && navigate(`/${tool.id}`)} 
            style={{ textDecoration: 'none', cursor: 'pointer' }}
          >
            <ToolCard
              id={tool.id}       
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