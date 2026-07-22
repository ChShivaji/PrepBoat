import { useEffect } from 'react';

const AdSenseScript = () => {
  useEffect(() => {
    // Only load script if not already present
    if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
      const script = document.createElement('script');
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3590874333111849";
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }
  }, []);

  return null;
};

export default AdSenseScript;
