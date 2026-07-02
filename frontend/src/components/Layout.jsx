import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import FloatingChatbot from './FloatingChatbot';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-darkBg text-slate-900">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Panel Viewport */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header />
        
        {/* Child Router Screens */}
        <main className="flex-grow p-5 overflow-y-auto bg-darkBg">
          <div className="w-full space-y-4 page-mount-transition">
            {children}
          </div>
        </main>
      </div>

      {/* Global Floating AI Assistant */}
      <FloatingChatbot />
    </div>
  );
};

export default Layout;
