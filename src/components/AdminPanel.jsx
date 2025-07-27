import React, { useState } from 'react';

import Dashboard from './Dashboard';
import Header from './Header';
import Sidebar from './Sidebar';

const AdminPanel = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className='flex h-screen'>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Content */}
      <div className='flex flex-1 flex-col'>
        {/* Header */}
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <Dashboard />
      </div>
    </div>
  );
};

export default AdminPanel;
