import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import FloatingChatbot from './FloatingChatbot';
import api from '../services/api';

const Layout = ({ children }) => {
  // Track active time spent on platform for study time graph
  useEffect(() => {
    let activeSeconds = 0;
    const interval = setInterval(() => {
      // Only count time if the user is active on this browser tab
      if (document.visibilityState === 'visible') {
        activeSeconds += 1;
        
        // Push stats to database every 30 seconds
        if (activeSeconds >= 30) {
          api.post('/api/analytics/track-time', { seconds: 30 })
            .catch(err => console.error("Error logging active study session time:", err));
          activeSeconds = 0;
        }
      }
    }, 1000);

    // Sync remaining active seconds on tab close or navigation unmount
    return () => {
      clearInterval(interval);
      if (activeSeconds > 0) {
        api.post('/api/analytics/track-time', { seconds: activeSeconds })
          .catch(err => console.error("Error logging final session seconds:", err));
      }
    };
  }, []);
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
