import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ fullPage = false, message = 'Loading PrepBoat...' }) => {
  const containerClass = fullPage 
    ? 'min-h-screen w-full flex flex-col items-center justify-center bg-darkBg text-slate-900' 
    : 'w-full py-16 flex flex-col items-center justify-center';

  return (
    <div className={containerClass}>
      <div className="relative flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={fullPage ? 48 : 36} />
        <div className="absolute w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
      </div>
      <p className="text-xs text-slate-600 font-medium tracking-widest uppercase mt-4 animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
