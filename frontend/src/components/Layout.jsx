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
        <main className="flex-grow p-5 overflow-y-auto bg-darkBg flex flex-col">
          <div className="w-full space-y-4 page-mount-transition flex-grow">
            {children}
          </div>
          
          {/* Legal Footer for AdSense Compliance */}
          <footer className="mt-8 pt-4 border-t border-slate-800/40 text-center text-xs text-slate-500 space-x-4 shrink-0">
            <span>&copy; {new Date().getFullYear()} PrepBoat AI. All rights reserved.</span>
            <a href="/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="/terms" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
          </footer>
        </main>
      </div>

      {/* Global Floating AI Assistant */}
      <FloatingChatbot />
    </div>
  );
};

export default Layout;
