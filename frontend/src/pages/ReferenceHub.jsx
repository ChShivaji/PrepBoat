import React, { useState } from 'react';
import { 
  Search, Play, ExternalLink, Sparkles, BookOpen, 
  Code, Database, Cpu, Network, Globe, Radio, Layers, Brain
} from 'lucide-react';

const Youtube = ({ size = 24, className = '', ...props }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

const getYouTubeThumbnail = (url) => {
  if (!url) return '';
  let videoId = '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    videoId = match[2];
  } else if (url.includes('playlist?list=')) {
    if (url.includes('PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_Key')) videoId = '37E9ckMDdTk'; 
    else if (url.includes('PLot-Xpkr5xuhJ_KVSJK2sAOP3F-Ouy9Sp')) videoId = 'w7D65A2s-lQ'; 
    else if (url.includes('PL_z_8CaSLPWekqgGD1yECcXtVBLn924G1')) videoId = 'nqowUJzG-1o'; 
    else if (url.includes('PLgUwDviBIf0qUlt5y6ysHyrU3SWRqFIPy')) videoId = 'FfXoiwnnqy4'; 
    else if (url.includes('PL08903FB7ACA1C2FB')) videoId = 'N7S1M3WvIHM'; 
    else if (url.includes('PLxCzCOWd7aiGz9donHRrE9I3MwnCoXNBg')) videoId = 'vBURTt97EkA'; 
    else if (url.includes('PLBlnK6fEyqRiVhbXDGLXDk_OQAeuVcp2O')) videoId = 'PKzV80L2hYI'; 
    else if (url.includes('PLrjkTql3jnm-cL8M1D7yF1O12w1u8t-2_')) videoId = 'Hwan-v1Uq04'; 
    else if (url.includes('PLmXKhU9mNh8k0n_b58hJn4X4A434hU4xR')) videoId = 'f1A2a_E2S0s'; 
    else if (url.includes('PLBlnK6fEyqRgMCUAG0XRw78UA8qnv6jEx')) videoId = 'VwN91xQD-Sg'; 
    else if (url.includes('PLxCzCOWd7aiGFBD2-2joCpWOLgFtBEJRI')) videoId = 'JFFy7_1wVdY'; 
    else if (url.includes('PLdo5W4Nhv31bZSiqiOL5ta39vSnBxpOPT')) videoId = '6i3EGqOBRiU'; 
    else if (url.includes('PLsyeobzWxl7poL9JTVyndKe62ieoN-MZ3')) videoId = 'QXeEoD0pB3E'; 
  }
  
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }
  // Fallback abstract layout
  return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop';
};

const ReferenceHub = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Seeded dataset with high-quality playlists/videos for key placement subjects
  // Python is placed first. No categories tab. Single column structure.
  const topicsData = [
    {
      category: 'Programming',
      topic: 'Python Programming',
      description: 'Master core Python, control structures, object-oriented concepts, and advanced libraries.',
      icon: Code,
      videos: [
        {
          title: 'Python Tutorial for Beginners (Jenny\'s Lectures)',
          channel: 'Jenny\'s Lectures CS IT',
          url: 'https://www.youtube.com/watch?v=6i3EGqOBRiU&list=PLdo5W4Nhv31bZSiqiOL5ta39vSnBxpOPT',
          duration: 'Complete Playlist',
          recommended: true
        },
        {
          title: 'Python Tutorial for Beginners (Telusko)',
          channel: 'Telusko',
          url: 'https://www.youtube.com/watch?v=QXeEoD0pB3E&list=PLsyeobzWxl7poL9JTVyndKe62ieoN-MZ3',
          duration: 'Complete Playlist',
          recommended: true
        },
        {
          title: 'Python for Beginners - Full Course',
          channel: 'Programming with Mosh',
          url: 'https://www.youtube.com/watch?v=HGOBQPFzWKo',
          duration: '6 Hours',
          recommended: false
        }
      ]
    },
    {
      category: 'SQL',
      topic: 'SQL Database Programming',
      description: 'Master relational databases, SQL queries, joins, aggregates, and schema structures.',
      icon: Database,
      videos: [
        {
          title: 'SQL Full Database Course for Beginners',
          channel: 'freeCodeCamp.org',
          url: 'https://www.youtube.com/watch?v=SSKVgrwhzus&t=13900s',
          duration: '4h 20m Course',
          recommended: true
        },
        {
          title: 'SQL Tutorial for Beginners',
          channel: 'Programming with Mosh',
          url: 'https://www.youtube.com/watch?v=7S_tz1z_5bA',
          duration: '3h Course',
          recommended: true
        },
        {
          title: 'SQL Complete Boot Camp Course',
          channel: 'Alex The Analyst',
          url: 'https://www.youtube.com/watch?v=hlGoQC332VM&t=3019s',
          duration: '4h Course',
          recommended: false
        }
      ]
    },
    {
      category: 'Programming',
      topic: 'Java Programming',
      description: 'Master core Java, object-oriented principles, exception handling, and multithreading.',
      icon: Code,
      videos: [
        {
          title: 'Java Tutorial for Beginners',
          channel: 'Programming with Mosh',
          url: 'https://www.youtube.com/watch?v=xTtL8E4LzTQ',
          duration: '2.5 Hours',
          recommended: true
        },
        {
          title: 'Java Tutorial for Beginners',
          channel: 'Jenny\'s Lectures CS IT',
          url: 'https://www.youtube.com/watch?v=BGTx91t8q50',
          duration: 'Complete Course',
          recommended: true
        },
        {
          title: 'Java Tutorial for Beginners (Playlist)',
          channel: 'Telusko',
          url: 'https://www.youtube.com/watch?v=x1RCEvYRTz0&list=PL9ooVrP1hQOEe9EN119lMdwcBxcrBI1D3',
          duration: 'Complete Playlist',
          recommended: false
        }
      ]
    },
    {
      category: 'Programming',
      topic: 'HTML & CSS Programming',
      description: 'Master web building blocks, styling, responsive layouts, flexbox, grid, and CSS animations.',
      icon: Code,
      videos: [
        {
          title: 'HTML & CSS Full Course - Beginner to Pro',
          channel: 'SuperSimpleDev',
          url: 'https://www.youtube.com/watch?v=G3e-cpL7ofc&t=2205s',
          duration: '6.5h Course',
          recommended: true
        },
        {
          title: 'HTML & CSS Tutorial for Beginners',
          channel: 'Programming with Mosh',
          url: 'https://www.youtube.com/watch?v=HGTJBPNC-Gw',
          duration: '1h Course',
          recommended: true
        },
        {
          title: 'HTML & CSS Tutorial for Beginners',
          channel: 'Dave Gray',
          url: 'https://www.youtube.com/watch?v=qz0aGYrrlhU',
          duration: 'Complete Course',
          recommended: false
        }
      ]
    },
    {
      category: 'Core Subjects',
      topic: 'Operating Systems',
      description: 'Master operating system concepts, processes, threads, memory management, and file systems.',
      icon: Cpu,
      videos: [
        {
          title: 'Operating System Tutorial for Beginners',
          channel: 'Programming with Mosh',
          url: 'https://www.youtube.com/watch?v=yK1uBHPdp30',
          duration: '1h Course',
          recommended: true
        },
        {
          title: 'Operating System Course (Playlist)',
          channel: 'Neso Academy',
          url: 'https://www.youtube.com/watch?v=vBURTt97EkA&list=PLBlnK6fEyqRiVhbXDGLXDk_OQAeuVcp2O',
          duration: 'Complete Playlist',
          recommended: true
        },
        {
          title: 'Operating System for Beginners',
          channel: 'Jenny\'s Lectures CS IT',
          url: 'https://www.youtube.com/watch?v=WpdKyLXa9SU',
          duration: 'Complete Course',
          recommended: false
        }
      ]
    },
    {
      category: 'Aptitude',
      topic: 'Quantitative Aptitude',
      description: 'Master placement aptitude concepts, time & work, profit & loss, number systems, and logical shortcuts.',
      icon: BookOpen,
      videos: [
        {
          title: 'Quantitative Aptitude Lectures',
          channel: 'CareerRide',
          url: 'https://www.youtube.com/watch?v=tnc9ojITRg4&list=PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt',
          duration: 'Complete Playlist',
          recommended: true
        },
        {
          title: 'Aptitude Training for Placements',
          channel: 'Freshersworld.com',
          url: 'https://www.youtube.com/watch?v=w1zwktKXdqA&list=PLvTTv60o7qj_ZT2pXjgXxue0AlgkpH0ZO',
          duration: 'Complete Course',
          recommended: true
        },
        {
          title: 'Aptitude Tricks & Short-cuts',
          channel: 'Feel Free to Learn',
          url: 'https://www.youtube.com/watch?v=hlyal4sR0m8&list=PL8p2I9GklV454LdGfDOw0KkNazKuA-6B2',
          duration: 'Complete Playlist',
          recommended: false
        }
      ]
    },
    {
      category: 'AI & ML',
      topic: 'Artificial Intelligence & Machine Learning',
      description: 'Master core AI concepts, supervised & unsupervised machine learning, deep learning, and neural networks.',
      icon: Brain,
      videos: [
        {
          title: 'Machine Learning Tutorial for Beginners',
          channel: 'Simplilearn',
          url: 'https://www.youtube.com/watch?v=ad79nYk2keg&list=PLEiEAq2VkUULyr_ftxpHB6DumOq1Zz2hq',
          duration: 'Complete Course',
          recommended: true
        },
        {
          title: 'Machine Learning Tutorial',
          channel: 'Codebasics',
          url: 'https://www.youtube.com/watch?v=gmvvaobm7eQ&list=PLeo1K3hjS3uvCeTYTeyfe0-rN5r8zn9rw',
          duration: 'Complete Playlist',
          recommended: true
        },
        {
          title: 'Deep Learning Course - Beginner to Pro',
          channel: 'freeCodeCamp.org',
          url: 'https://www.youtube.com/watch?v=EHBNe31y65s&t=36502s',
          duration: '10 Hours',
          recommended: false
        }
      ]
    },
    {
      category: 'DSA',
      topic: 'Arrays & Hashing',
      description: 'Master fundamental array manipulations, two-pointers, sliding window, and hashing logic.',
      icon: Code,
      videos: [
        {
          title: 'Striver\'s Arrays Playlist (A2Z Sheet)',
          channel: 'takeUforward',
          url: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_Key',
          duration: 'Complete Playlist',
          recommended: true
        },
        {
          title: 'Love Babbar Arrays & Vectors Masterclass',
          channel: 'Code Help',
          url: 'https://www.youtube.com/watch?v=zJu9gD94Jsw',
          duration: '3h 15m',
          recommended: false
        },
        {
          title: 'NeetCode Arrays & Hashing Solutions',
          channel: 'NeetCode',
          url: 'https://www.youtube.com/playlist?list=PLot-Xpkr5xuhJ_KVSJK2sAOP3F-Ouy9Sp',
          duration: 'Problem Walkthroughs',
          recommended: true
        }
      ]
    },
    {
      category: 'DSA',
      topic: 'Dynamic Programming',
      description: 'Learn recursion, memoization, tabulation, and space-optimization strategies.',
      icon: Layers,
      videos: [
        {
          title: 'Aditya Verma DP Master Series',
          channel: 'Aditya Verma',
          url: 'https://www.youtube.com/playlist?list=PL_z_8CaSLPWekqgGD1yECcXtVBLn924G1',
          duration: 'Concept Playlist',
          recommended: true
        },
        {
          title: 'Striver\'s Complete DP Series',
          channel: 'takeUforward',
          url: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0qUlt5y6ysHyrU3SWRqFIPy',
          duration: '50+ Lectures',
          recommended: true
        },
        {
          title: 'FreeCodeCamp Dynamic Programming Tutorial',
          channel: 'freeCodeCamp.org',
          url: 'https://www.youtube.com/watch?v=oBt53Yn9YY0',
          duration: '5h 10m Course',
          recommended: false
        }
      ]
    },
    {
      category: 'Core Subjects',
      topic: 'DBMS - Normalization (1NF to BCNF)',
      description: 'Functional dependencies, lossless joins, dependency preservation, and normal forms.',
      icon: Layers,
      videos: [
        {
          title: 'Gate Smashers Normalization Series',
          channel: 'Gate Smashers',
          url: 'https://www.youtube.com/watch?v=5V9X_C8-w1M',
          duration: 'BCNF & 3NF Made Easy',
          recommended: true
        },
        {
          title: 'Education 4U Database Normalization',
          channel: 'Education 4U',
          url: 'https://www.youtube.com/playlist?list=PLrjkTql3jnm-cL8M1D7yF1O12w1u8t-2_',
          duration: 'Normalization Playlist',
          recommended: false
        },
        {
          title: 'Knowledge Gate DBMS Complete Playlist',
          channel: 'Knowledge Gate',
          url: 'https://www.youtube.com/playlist?list=PLmXKhU9mNh8k0n_b58hJn4X4A434hU4xR',
          duration: 'DBMS Course',
          recommended: true
        }
      ]
    },
    {
      category: 'Core Subjects',
      topic: 'Computer Networks - TCP/IP & OSI Model',
      description: 'Layered architectures, flow control, congestion control, and application layer protocols.',
      icon: Network,
      videos: [
        {
          title: 'Neso Academy Computer Networks',
          channel: 'Neso Academy',
          url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRgMCUAG0XRw78UA8qnv6jEx',
          duration: 'CN Complete Course',
          recommended: true
        },
        {
          title: 'Gate Smashers Computer Networks Playlist',
          channel: 'Gate Smashers',
          url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLgFtBEJRI',
          duration: 'CN Lectures',
          recommended: true
        },
        {
          title: 'PowerCert Animated OSI Model',
          channel: 'PowerCert',
          url: 'https://www.youtube.com/watch?v=HEEnLZV2wHs',
          duration: '16 Minutes',
          recommended: false
        }
      ]
    }
  ];

  // Filter topics based on search query
  const filteredTopics = topicsData.filter(item => {
    return item.topic.toLowerCase().includes(searchTerm.toLowerCase()) || 
           item.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-4 pb-12">
      
      {/* Visual Learning Banner Header */}
      <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-lg p-4 md:p-4 overflow-hidden shadow-2xl border border-indigo-500/10 animate-fadeIn">
        
        {/* Floating tech nodes and connections - Styled SVG / CSS */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 opacity-25 md:opacity-90 pointer-events-none select-none">
          <svg className="w-full h-full" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="blur-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" />
              </filter>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <style>{`
              @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-6px); }
                100% { transform: translateY(0px); }
              }
              @keyframes pulse-glow {
                0%, 100% { opacity: 0.15; }
                50% { opacity: 0.4; }
              }
              .floating-node {
                animation: float 5s ease-in-out infinite;
              }
              .floating-node-delayed {
                animation: float 5s ease-in-out infinite;
                animation-delay: 2.5s;
              }
              .glow-pulse {
                animation: pulse-glow 3s ease-in-out infinite;
              }
            `}</style>

            {/* Connection curved paths */}
            <path d="M 200,160 Q 80,100 70,85" stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
            <path d="M 200,160 Q 100,160 65,150" stroke="#818cf8" strokeWidth="1.5" opacity="0.6" />
            <path d="M 200,160 Q 100,220 75,230" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
            <path d="M 200,160 Q 200,70 200,50" stroke="#facc15" strokeWidth="1.5" opacity="0.6" />
            <path d="M 200,160 Q 300,80 310,60" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
            <path d="M 200,160 Q 300,140 330,130" stroke="#3b82f6" strokeWidth="1.5" opacity="0.6" />
            <path d="M 200,160 Q 300,190 320,200" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
            <path d="M 200,160 Q 270,250 290,260" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />

            {/* Laptop Base Shadow */}
            <ellipse cx="200" cy="205" rx="75" ry="8" fill="#000000" opacity="0.5" filter="url(#blur-shadow)" />

            {/* Laptop Screen Body */}
            <rect x="145" y="115" width="110" height="74" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2.5" />
            <rect x="151" y="121" width="98" height="58" rx="4" fill="#0f172a" />
            
            {/* Play Button on screen */}
            <circle cx="200" cy="148" r="14" fill="#ef4444" className="cursor-pointer" />
            <polygon points="196,141 196,155 208,148" fill="#ffffff" />
            
            {/* Red youtube-like seekbar */}
            <rect x="156" y="170" width="88" height="2" rx="1" fill="#334155" />
            <rect x="156" y="170" width="54" height="2" rx="1" fill="#ef4444" />
            <circle cx="210" cy="171" r="2" fill="#ef4444" />

            {/* Keyboard base */}
            <polygon points="130,188 270,188 285,198 115,198" fill="#334155" stroke="#475569" strokeWidth="1" />
            {/* Touchpad / Base highlight */}
            <rect x="185" y="194" width="30" height="3" rx="1.5" fill="#1e293b" />
            <line x1="115" y1="198" x2="285" y2="198" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />

            {/* Floating Tech Logos */}
            {/* JS Node */}
            <g className="floating-node">
              <rect x="182" y="32" width="36" height="36" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <rect x="189" y="39" width="22" height="22" rx="3" fill="#eab308" />
              <text x="206" y="54" fill="#000000" fontSize="9" fontWeight="900" fontFamily="sans-serif" textAnchor="end">JS</text>
            </g>

            {/* React Node */}
            <g className="floating-node-delayed">
              <rect x="292" y="42" width="36" height="36" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <ellipse cx="310" cy="60" rx="12" ry="4" stroke="#22d3ee" strokeWidth="1.2" fill="none" transform="rotate(30 310 60)" />
              <ellipse cx="310" cy="60" rx="12" ry="4" stroke="#22d3ee" strokeWidth="1.2" fill="none" transform="rotate(90 310 60)" />
              <ellipse cx="310" cy="60" rx="12" ry="4" stroke="#22d3ee" strokeWidth="1.2" fill="none" transform="rotate(150 310 60)" />
              <circle cx="310" cy="60" r="2.5" fill="#22d3ee" />
            </g>

            {/* Python Node */}
            <g className="floating-node">
              <rect x="312" y="112" width="36" height="36" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <path d="M328 120c-2 0-3.5 1.5-3.5 3.5v2.5h4v1h-5.5c-2 0-3.5 1.5-3.5 3.5s1.5 3.5 3.5 3.5h2v-2.5c0-1.5 1.2-2.5 2.5-2.5h6v-3.5c0-2-1.5-3.5-3.5-3.5h-2zm-1 2a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6z" fill="#38bdf8" />
              <path d="M332 136c2 0 3.5-1.5 3.5-3.5v-2.5h-4v-1h5.5c2 0 3.5-1.5 3.5-3.5s-1.5-3.5-3.5-3.5h-2v2.5c0 1.5-1.2 2.5-2.5 2.5h-6v3.5c0 2 1.5 3.5 3.5 3.5h2zm1-2a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6z" fill="#facc15" />
            </g>

            {/* AWS Node */}
            <g className="floating-node-delayed">
              <rect x="302" y="182" width="36" height="36" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <text x="320" y="200" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">aws</text>
              <path d="M312 203c2.5 1.5 9 2.5 15 0" stroke="#f97316" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              <path d="M327 203l-2-.3l.3-1.5z" fill="#f97316" />
            </g>

            {/* Google Cloud Node */}
            <g className="floating-node">
              <rect x="272" y="242" width="36" height="36" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <path d="M282 258c0-2 1.5-3.5 3.5-3.5c.8 0 1.5.3 2 1c.8-1.2 2-2 3.5-2c2.5 0 4.5 2 4.5 4.5c0 .3 0 .5-.1.8c1.2.4 2.1 1.5 2.1 3c0 1.8-1.5 3.2-3.2 3.2h-10.3c-1.8 0-3.2-1.5-3.2-3.2c0-1.5 1.2-2.8 2.8-3.2z" fill="#3b82f6" opacity="0.9" />
              <path d="M285.5 254.5a3.5 3.5 0 0 1 3.5 3.5" stroke="#ea4335" strokeWidth="1.2" fill="none" />
              <path d="M291 253.5a4.5 4.5 0 0 1 4.5 4.5" stroke="#facc15" strokeWidth="1.2" fill="none" />
              <path d="M295.5 260c0 1.8-1.5 3.2-3.2 3.2h-4" stroke="#34a853" strokeWidth="1.2" fill="none" />
            </g>

            {/* Docker Node */}
            <g className="floating-node-delayed">
              <rect x="57" y="212" width="36" height="36" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <path d="M63 226h3v2.2h-3zm3.5 0h3v2.2h-3zm3.5 0h3v2.2h-3zm-7-3h3v2.2h-3zm3.5 0h3v2.2h-3zm3.5 0h3v2.2h-3z" fill="#38bdf8"/>
              <path d="M60 231c.8 1.5 3 3 7 3c4.5 0 7-3 7-5.2c0-1.8 1-2.2 1.5-2.2c-.8 0-1.8.3-2.2 1.5c0-2.2-1.8-3.2-4-3.2c-3.2 0-5.5 2.5-8.5 2.5v3.6z" fill="#38bdf8" opacity="0.8"/>
            </g>

            {/* Database Node */}
            <g className="floating-node">
              <rect x="42" y="132" width="36" height="36" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <path d="M50 144c0-1.8 4.5-3 10-3s10 1.2 10 3v3c0 1.8-4.5 3-10 3s-10-1.2-10-3v-3z" fill="#a78bfa" opacity="0.3"/>
              <path d="M50 144c0 1.8 4.5 3 10 3s10-1.2 10-3M50 149c0 1.8 4.5 3 10 3s10-1.2 10-3M50 154c0 1.8 4.5 3 10 3s10-1.2 10-3" stroke="#c084fc" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
              <path d="M50 144v10c0 1.8 4.5 3 10 3s10-1.2 10-3V144" stroke="#c084fc" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
            </g>

            {/* Code </> Node */}
            <g className="floating-node-delayed">
              <rect x="52" y="57" width="36" height="36" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <path d="M 62,75 L 66,71 M 62,75 L 66,79 M 74,75 L 70,71 M 74,75 L 70,79 M 71,70 L 65,80" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/25 text-indigo-400 text-xs font-semibold">
            <Sparkles size={12} fill="currentColor" />
            <span>Recommended Playlist Library</span>
          </div>
          <h1 className="text-lg md:text-lg font-extrabold text-white tracking-tight leading-tight">
            Placement Reference Hub
          </h1>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-md">
            Skip the clutter. Discover curated, high-quality YouTube lectures and playlists recommended by top educators to crack your tech assessments.
          </p>

          {/* Quick Search */}
          <div className="pt-2 max-w-md">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search topics (e.g. OS, Arrays, SQL)..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
              />
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Search size={15} />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Topics & Playlists Grid (Single vertical column of topics, no category tabs) */}
      <div className="space-y-14">
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topicItem, idx) => {
            const TopicIcon = topicItem.icon;
            return (
              <div key={idx} className="space-y-4">
                
                {/* Topic Heading block */}
                <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                  <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
                    <TopicIcon size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800">{topicItem.topic}</h3>
                    <p className="text-[11px] text-slate-600">{topicItem.description}</p>
                  </div>
                </div>

                {/* 3 Playlists Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {topicItem.videos.map((vid, vIdx) => {
                    const thumbUrl = getYouTubeThumbnail(vid.url);
                    return (
                      <a 
                        key={vIdx}
                        href={vid.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-panel hover:border-indigo-400/50 hover:shadow-xl rounded-lg overflow-hidden flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1.5 cursor-pointer bg-white border border-slate-200 block text-left"
                      >
                        <div>
                          {/* 16:9 Thumbnail Image Container */}
                          <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                            <img 
                              src={thumbUrl} 
                              alt={vid.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                            {/* Hover YouTube Play Button Overlay */}
                            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                <Play size={20} fill="currentColor" className="ml-1" />
                              </div>
                            </div>
                            
                            {/* YouTube Brand Icon Badge */}
                            <div className="absolute top-3 right-3 p-1.5 bg-black/60 backdrop-blur-md rounded-lg text-white">
                              <Youtube size={14} className="text-red-500 fill-red-500" />
                            </div>

                            {/* Recommended Tag */}
                            {vid.recommended && (
                              <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
                                Recommended
                              </span>
                            )}
                          </div>

                          {/* Info details */}
                          <div className="p-4 space-y-3">
                            <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-relaxed group-hover:text-indigo-600 transition-colors">
                              {vid.title}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                              <span className="font-semibold">{vid.channel}</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer Link */}
                        <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] text-slate-600 font-mono bg-slate-100 px-2 py-0.5 rounded">{vid.duration}</span>
                          <div
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 group-hover:bg-indigo-600 text-slate-700 group-hover:text-white transition-all text-[10px] font-bold group-hover:shadow-md"
                          >
                            <span>Watch video</span>
                            <ExternalLink size={10} />
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          /* Empty Search results */
          <div className="glass-panel p-16 rounded-lg text-center space-y-4 border border-slate-200 max-w-md mx-auto">
            <BookOpen size={48} className="text-slate-400 mx-auto animate-pulse" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-800">No Reference Topics Found</h3>
              <p className="text-xs text-slate-600 leading-normal">
                We couldn't find any resources matching "{searchTerm}". Try checking your spelling.
              </p>
            </div>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-indigo-600/10"
              >
                Clear Search Query
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default ReferenceHub;
