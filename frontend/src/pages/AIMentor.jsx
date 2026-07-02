import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { 
  Bot, Send, Ship, Sparkles, User, AlertCircle, RefreshCw, 
  Mic, MicOff, Volume2, VolumeX, PhoneOff, Play, Square 
} from 'lucide-react';
import Rudra3DAvatar from '../components/Rudra3DAvatar';


const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
const isSpeechSupported = !!SpeechRecognition;

const AIMentor = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '**Welcome to PrepBoat AI Mentor!** I am Rudra, your placement preparation mentor.\n\nI can help you with:\n- Explaining core coding concepts (Recursion, DP, Graphs)\n- Analyzing complexity analysis ($O(N)$ space and time)\n- Preparing for HR and behavioral questions\n- Guiding you on SQL queries and operating system core concepts\n- Providing mock interviews and evaluating your answers\n\nAsk me anything or click **Live Voice Mode** to talk with me hands-free!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Voice states
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [voiceState, setVoiceState] = useState('idle'); // 'idle', 'listening', 'thinking', 'speaking'
  const [interimTranscript, setInterimTranscript] = useState('');
  const [lastUserVoiceInput, setLastUserVoiceInput] = useState('');
  const [lastAiVoiceOutput, setLastAiVoiceOutput] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState('');

  const chatEndRef = useRef(null);
  
  // Refs to manage SpeechRecognition and SpeechSynthesis callback state
  const recognitionRef = useRef(null);
  const voiceStateRef = useRef(voiceState);
  const isVoiceModeRef = useRef(isVoiceMode);
  const isMutedRef = useRef(isMuted);
  const speakTimeoutRef = useRef(null);
  const speechChunksRef = useRef([]);
  const currentChunkIdxRef = useRef(0);

  // Sync refs to avoid stale closures in browser event handlers
  useEffect(() => { voiceStateRef.current = voiceState; }, [voiceState]);
  useEffect(() => { isVoiceModeRef.current = isVoiceMode; }, [isVoiceMode]);
  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);

  // Load system voices for customization
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // Filter English voices
      const engVoices = voices.filter(v => v.lang.startsWith('en'));
      setAvailableVoices(engVoices);
      
      // Select preferred voice on initial load
      if (engVoices.length > 0) {
        const preferred = engVoices.find(v => 
          v.lang.includes('en-US') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Zira'))
        ) || engVoices[0];
        setSelectedVoiceName(preferred.name);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const templates = [
    "Mock interview me for a Software Engineer role",
    "Explain Sliding Window vs Two Pointers",
    "Explain normal forms in DBMS (1NF, 2NF, 3NF)",
    "Write an SQL query to find duplicates in a table"
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Clean Markdown & code symbols for text-to-speech reading
  const cleanTextForSpeech = (text) => {
    let cleaned = text;
    // Replace code blocks with a short note so they aren't read syntactically
    cleaned = cleaned.replace(/```[\s\S]*?```/g, ' [Code block omitted in speech. You can view the code snippet in the text log below.] ');
    
    cleaned = cleaned
      .replace(/\*\*([^*]+)\*\*/g, '$1') // remove bold asterisks
      .replace(/\*([^*]+)\*/g, '$1')     // remove italic asterisks
      .replace(/#+\s+/g, '')              // remove headers
      .replace(/`([^`]+)`/g, '$1')        // remove code ticks
      .replace(/[-*]\s+/g, '')            // remove bullet points
      .replace(/\n+/g, ' ')               // convert newlines to spaces
      .replace(/\$[^$]+\$/g, '')          // remove latex style math expressions like $O(N)$
      .trim();
      
    return cleaned;
  };

  // Initialize Speech Recognition
  useEffect(() => {
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setVoiceState('listening');
      setInterimTranscript('');
      setError('');
    };

    rec.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      if (interim) {
        setInterimTranscript(interim);
      }
      if (final) {
        setInterimTranscript('');
        setLastUserVoiceInput(final);
        handleVoiceSend(final);
      }
    };

    rec.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      if (event.error === 'not-allowed') {
        setError("Microphone permission denied. Enable microphone access in browser settings.");
        setIsVoiceMode(false);
        setVoiceState('idle');
      } else if (event.error === 'network') {
        setError("Speech Recognition network issue. Reconnecting...");
        setVoiceState('idle');
      }
    };

    rec.onend = () => {
      // Loop-restart SpeechRecognition when in voice mode, listening state, and not muted
      // Wrap in a 150ms timeout to avoid restart collisions in Chrome
      if (isVoiceModeRef.current && !isMutedRef.current && voiceStateRef.current === 'listening') {
        setTimeout(() => {
          if (isVoiceModeRef.current && !isMutedRef.current && voiceStateRef.current === 'listening') {
            try {
              rec.start();
            } catch (e) {
              console.warn("SpeechRecognition auto-restart ignored:", e);
            }
          }
        }, 150);
      }
    };

    recognitionRef.current = rec;

    // Retrieve voices to cache them in browser memory
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (speakTimeoutRef.current) {
        clearTimeout(speakTimeoutRef.current);
      }
      try {
        rec.abort();
      } catch (e) {}
    };
  }, []);

  // Synchronize SpeechRecognition lifecycle with voice assistant state
  useEffect(() => {
    if (!recognitionRef.current) return;

    if (isVoiceMode && voiceState === 'listening' && !isMuted) {
      try {
        recognitionRef.current.start();
      } catch (e) {}
    } else {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  }, [isVoiceMode, voiceState, isMuted]);

  // Handle standard text submit
  const handleSend = async (messageText) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    setError('');
    const userMsg = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const res = await api.post('/api/ai/mentor/chat', {
        message: textToSend,
        history: historyPayload
      });

      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch (err) {
      console.error("AI Mentor Chat Error: ", err);
      setError("Unable to retrieve AI reply. Verify server or Gemini configuration.");
    } finally {
      setLoading(false);
    }
  };

  // Handle voice-to-voice query submit
  const handleVoiceSend = async (textToSend) => {
    if (!textToSend.trim()) return;

    setError('');
    const userMsg = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setVoiceState('thinking');

    try {
      const historyPayload = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const res = await api.post('/api/ai/mentor/chat', {
        message: textToSend,
        history: historyPayload
      });

      const replyText = res.data.response;
      setMessages(prev => [...prev, { role: 'assistant', content: replyText }]);
      
      // Trigger voice speaker
      speakText(replyText);
    } catch (err) {
      console.error("AI Voice Chat Error: ", err);
      setError("Failed to retrieve response from Rudra. Reconnecting voice...");
      setVoiceState('listening');
    }
  };

  // Speech Synthesis speaker (reads text sentence by sentence)
  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume(); // Unlock Chrome's speech synthesis engine
    } catch (e) {
      console.warn("SpeechSynthesis cancel/resume warning:", e);
    }

    const clean = cleanTextForSpeech(text);
    if (!clean) {
      setVoiceState('listening');
      return;
    }

    // Split text into individual sentences to avoid browser memory hang issues
    const chunks = clean.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [clean];
    speechChunksRef.current = chunks;
    currentChunkIdxRef.current = 0;

    const speakNextChunk = () => {
      // Clear any pending safety timeout
      if (speakTimeoutRef.current) {
        clearTimeout(speakTimeoutRef.current);
        speakTimeoutRef.current = null;
      }

      // Check if user exited voice mode or muted mid-speech
      if (!isVoiceModeRef.current || isMutedRef.current) {
        setVoiceState('idle');
        return;
      }

      if (currentChunkIdxRef.current >= speechChunksRef.current.length) {
        setVoiceState('listening');
        return;
      }

      const chunkText = speechChunksRef.current[currentChunkIdxRef.current].trim();
      if (!chunkText) {
        currentChunkIdxRef.current++;
        speakNextChunk();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunkText);
      utterance.volume = 1;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      // Select English speaking voice (user preference preferred)
      const voices = window.speechSynthesis.getVoices();
      if (selectedVoiceName) {
        const selected = voices.find(v => v.name === selectedVoiceName);
        if (selected) {
          utterance.voice = selected;
        }
      } else {
        const preferredVoice = voices.find(v => 
          v.lang.includes('en-US') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Zira'))
        ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }

      // Safety timeout: Chrome sometimes hangs on utterances without firing onend.
      // Force next sentence if it takes more than (length * 80ms) + 4000ms.
      const timeoutMs = (chunkText.length * 80) + 4000;
      speakTimeoutRef.current = setTimeout(() => {
        console.warn("Speech Synthesis hung. Forcing next chunk...");
        try {
          window.speechSynthesis.cancel();
        } catch (e) {}
        currentChunkIdxRef.current++;
        speakNextChunk();
      }, timeoutMs);

      utterance.onstart = () => {
        setVoiceState('speaking');
        setLastAiVoiceOutput(chunkText);
      };

      utterance.onend = () => {
        if (speakTimeoutRef.current) {
          clearTimeout(speakTimeoutRef.current);
          speakTimeoutRef.current = null;
        }
        currentChunkIdxRef.current++;
        speakNextChunk();
      };

      utterance.onerror = (e) => {
        console.error("Speech Synthesis Error:", e);
        if (speakTimeoutRef.current) {
          clearTimeout(speakTimeoutRef.current);
          speakTimeoutRef.current = null;
        }
        currentChunkIdxRef.current++;
        speakNextChunk();
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNextChunk();
  };

  const startVoiceMode = () => {
    if (!isSpeechSupported) {
      alert("Speech recognition is not fully supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }
    setIsVoiceMode(true);
    setIsMuted(false);
    setVoiceState('speaking');
    
    // Initial welcome greeting
    speakText("Hello! I am Rudra, your AI Placement Mentor. Let's prepare for your interviews. You can ask me questions about coding, mock interview you, or review your answers. What topic shall we discuss?");
  };

  const stopVoiceMode = () => {
    setIsVoiceMode(false);
    setVoiceState('idle');
    setInterimTranscript('');
    setLastUserVoiceInput('');
    setLastAiVoiceOutput('');
    speechChunksRef.current = [];
    currentChunkIdxRef.current = 0;
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVoiceState('listening');
    } else {
      setIsMuted(true);
      setVoiceState('idle');
      speechChunksRef.current = [];
      currentChunkIdxRef.current = 0;
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    }
  };

  const interruptSpeech = () => {
    speechChunksRef.current = [];
    currentChunkIdxRef.current = 0;
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsMuted(true);
    setVoiceState('idle');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  };

  const handleOrbClick = () => {
    if (voiceState === 'speaking') {
      interruptSpeech();
    } else {
      toggleMute();
    }
  };

  const clearChat = () => {
    if (window.confirm("Reset conversation history?")) {
      setMessages([
        {
          role: 'assistant',
          content: 'Chat history reset. Ask me a question to begin a new discussion!'
        }
      ]);
      setError('');
      stopVoiceMode();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] overflow-hidden space-y-4 w-full page-mount-transition">
      
      <style>{`
        @keyframes orb-breath-green {
          0%, 100% { transform: scale(1); box-shadow: 0 0 50px 10px rgba(16, 185, 129, 0.4); border-color: rgba(16, 185, 129, 0.6); }
          50% { transform: scale(1.06); box-shadow: 0 0 75px 25px rgba(16, 185, 129, 0.75); border-color: rgba(52, 211, 153, 0.9); }
        }
        @keyframes orb-breath-pink {
          0%, 100% { transform: scale(1.02); box-shadow: 0 0 55px 15px rgba(236, 72, 153, 0.5); border-color: rgba(236, 72, 153, 0.6); }
          50% { transform: scale(1.16); box-shadow: 0 0 90px 40px rgba(236, 72, 153, 0.85); border-color: rgba(244, 114, 182, 0.9); }
        }
        @keyframes orb-breath-purple {
          0%, 100% { transform: scale(1); box-shadow: 0 0 45px 10px rgba(168, 85, 247, 0.4); border-color: rgba(168, 85, 247, 0.5); }
          50% { transform: scale(1.04); box-shadow: 0 0 70px 20px rgba(168, 85, 247, 0.65); border-color: rgba(192, 132, 252, 0.8); }
        }
        @keyframes float-ambient {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.2; }
          50% { transform: translateY(-10px) scale(1.08); opacity: 0.35; }
        }
        @keyframes wave-bar {
          0% { height: 12px; transform: scaleY(1); }
          100% { height: 55px; transform: scaleY(1.4); }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-orb-breath-green {
          animation: orb-breath-green 3.0s ease-in-out infinite;
        }
        .animate-orb-breath-pink {
          animation: orb-breath-pink 1.2s ease-in-out infinite;
        }
        .animate-orb-breath-purple {
          animation: orb-breath-purple 2.0s ease-in-out infinite;
        }
        .animate-float-ambient {
          animation: float-ambient 5s ease-in-out infinite alternate;
        }
        .animate-spin-slow {
          animation: spin-slow 4.0s linear infinite;
        }
      `}</style>

      {/* Mentor Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
            <Bot size={20} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Rudra - AI Mentor</h3>
            <p className="text-xs text-slate-500">Placement Preparation, Mock Interviews & Concept Reviews</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Live Voice Mode Toggle */}
          {isSpeechSupported && !isVoiceMode && (
            <button
              onClick={startVoiceMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/10 transition-all hover:scale-105"
            >
              <Mic size={13} className="animate-pulse" />
              <span>Live Voice Mode</span>
            </button>
          )}

          <button
            onClick={clearChat}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-850 hover:bg-slate-50 transition-all text-xs font-semibold"
          >
            <RefreshCw size={12} />
            <span>Reset Chat</span>
          </button>
        </div>
      </div>

      {/* Chat scroll viewport or Voice Assist Visualizer Overlay */}
      <div className="flex-1 overflow-y-auto glass-panel p-4 rounded-lg border border-slate-200 space-y-4 flex flex-col justify-between min-h-0 bg-white shadow-sm">
        
        {isVoiceMode ? (
          /* ==============================================
             PREMIUM VOICE ASSISTANT INTERFACE (GEMINI LIVE STYLE)
             ============================================== */
          <div className={`flex-1 flex flex-col justify-between items-center py-6 px-4 rounded-lg relative transition-all duration-500 overflow-hidden ${
            voiceState === 'listening' ? 'bg-emerald-950/20 shadow-[inset_0_0_80px_rgba(16,185,129,0.12)] border border-emerald-500/20' :
            voiceState === 'thinking' ? 'bg-purple-950/20 shadow-[inset_0_0_80px_rgba(168,85,247,0.12)] border border-purple-500/20' :
            voiceState === 'speaking' ? 'bg-pink-950/20 shadow-[inset_0_0_80px_rgba(236,72,153,0.12)] border border-pink-500/20' :
            'bg-slate-900/10 border border-darkBorder'
          }`}>
            
            {/* Premium ambient background glow blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              <div className={`absolute top-1/4 left-1/4 w-72 h-72 rounded-full mix-blend-screen filter blur-[80px] opacity-25 transition-all duration-1000 animate-float-ambient ${
                voiceState === 'listening' ? 'bg-emerald-500/20' :
                voiceState === 'thinking' ? 'bg-purple-500/20' :
                voiceState === 'speaking' ? 'bg-pink-500/20' :
                'bg-slate-500/10'
              }`} />
              <div className={`absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full mix-blend-screen filter blur-[80px] opacity-20 transition-all duration-1000 animate-float-ambient ${
                voiceState === 'listening' ? 'bg-teal-500/15' :
                voiceState === 'thinking' ? 'bg-indigo-500/15' :
                voiceState === 'speaking' ? 'bg-rose-500/15' :
                'bg-slate-500/5'
              }`} style={{ animationDelay: '2.5s' }} />
            </div>
            
            {/* Visual Status Indicator & Guidance (Top) */}
            <div className="w-full flex flex-col items-center text-center space-y-2.5 z-10">
              
              {/* Dynamic Status Pill */}
              <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase border shadow-md ${
                voiceState === 'listening' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 animate-pulse' :
                voiceState === 'thinking' ? 'bg-purple-500/15 border-purple-500/30 text-purple-400' :
                voiceState === 'speaking' ? 'bg-pink-500/15 border-pink-500/30 text-pink-400 animate-pulse' :
                'bg-slate-800/60 border-slate-700/80 text-slate-400'
              }`}>
                <span className={`h-2.5 w-2.5 rounded-full ${
                  voiceState === 'listening' ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' :
                  voiceState === 'thinking' ? 'bg-purple-400 animate-ping' :
                  voiceState === 'speaking' ? 'bg-pink-400 shadow-[0_0_8px_#ec4899]' :
                  'bg-slate-500'
                }`} />
                <span>
                  {voiceState === 'listening' && "Active: Listening for your voice"}
                  {voiceState === 'thinking' && "Processing: Generating reply..."}
                  {voiceState === 'speaking' && "AI Speaking: Read / Listen"}
                  {voiceState === 'idle' && (isMuted ? "Microphone Muted" : "Voice Paused")}
                </span>
              </div>

              {/* Status Header & Action Tip */}
              <h2 className="text-lg font-extrabold text-white tracking-tight">
                {voiceState === 'listening' && "Speak clearly now..."}
                {voiceState === 'thinking' && "Rudra is formulating preparation tips..."}
                {voiceState === 'speaking' && "Rudra is speaking..."}
                {voiceState === 'idle' && (isMuted ? "Microphone is muted" : "Session Paused")}
              </h2>
              
              <p className="text-xs text-slate-400 max-w-md">
                {voiceState === 'listening' && "Rudra is listening. Ask: 'Mock interview me' or 'Explain recursion'. When you pause, Rudra will reply."}
                {voiceState === 'thinking' && "Connecting to Gemini 2.5 Flash. Processing technical prep evaluation..."}
                {voiceState === 'speaking' && "Tap the center orb or click the Stop Speaking button below to pause speech."}
                {voiceState === 'idle' && (isMuted ? "Click the center orb or microphone button below to start talking." : "Session is currently paused.")}
              </p>
            </div>

            {/* Live Subtitles / Transcripts (Middle-Top) */}
            <div className="w-full flex flex-col items-center space-y-3 px-4 min-h-[4rem] justify-end z-10">
              {interimTranscript && (
                <div className="text-xs text-emerald-300 italic max-w-md text-center bg-emerald-950/30 px-4 py-2 rounded-lg border border-emerald-500/20 animate-pulse">
                  "{interimTranscript}..."
                </div>
              )}
              {!interimTranscript && lastUserVoiceInput && (
                <div className="text-xs text-slate-300 max-w-md text-center bg-slate-900/60 px-4 py-2 rounded-lg border border-darkBorder/40">
                  <span className="font-bold text-slate-500 text-[10px] uppercase block mb-0.5">Your Voice Input</span>
                  "{lastUserVoiceInput}"
                </div>
              )}
            </div>

            {/* Glowing Interactive Voice Orb (Center) */}
            <div className="flex flex-col items-center justify-center my-4 z-10">
              <div 
                onClick={handleOrbClick}
                title={
                  voiceState === 'speaking' ? 'Click to stop speaking' :
                  voiceState === 'listening' ? 'Click to mute' : 'Click to start listening'
                }
                className={`relative w-40 h-40 flex flex-col items-center justify-center rounded-full cursor-pointer select-none transition-all duration-350 ${
                  voiceState === 'listening' 
                    ? 'bg-emerald-950/40 border-2 border-emerald-500/40 hover:scale-105 shadow-[0_0_40px_rgba(16,185,129,0.3)] animate-orb-breath-green' 
                    : voiceState === 'thinking'
                    ? 'bg-purple-950/40 border-2 border-purple-500/40 shadow-[0_0_40px_rgba(168,85,247,0.3)] animate-orb-breath-purple'
                    : voiceState === 'speaking'
                    ? 'bg-pink-950/40 border-2 border-pink-500/40 hover:scale-105 shadow-[0_0_50px_rgba(236,72,153,0.4)] animate-orb-breath-pink'
                    : 'bg-slate-900/40 border-2 border-slate-700/50 hover:scale-105'
                }`}
              >
                {/* Voice Orb States */}
                {voiceState === 'listening' && (
                  <>
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-orb-breath-green" />
                    <div className="w-14 h-14 rounded-full bg-emerald-500/90 shadow-[0_0_20px_rgba(16,185,129,0.6)] flex items-center justify-center text-white">
                      <Mic size={22} className="animate-pulse" />
                    </div>
                  </>
                )}

                {voiceState === 'thinking' && (
                  <>
                    <div className="w-20 h-20 absolute rounded-full border-2 border-dashed border-purple-500/40 animate-spin-slow" />
                    <div className="w-14 h-14 rounded-full bg-purple-600/90 shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center justify-center text-white">
                      <Sparkles size={20} className="animate-pulse" />
                    </div>
                  </>
                )}

                {voiceState === 'speaking' && (
                  <>
                    <div className="absolute inset-0 rounded-full border-2 border-pink-500/20 animate-orb-breath-pink" />
                    <div className="w-14 h-14 rounded-full bg-pink-600/90 shadow-[0_0_25px_rgba(236,72,153,0.7)] flex items-center justify-center text-white">
                      <Volume2 size={22} />
                    </div>
                  </>
                )}

                {voiceState === 'idle' && (
                  <>
                    <div className="absolute inset-0 rounded-full border border-slate-700/30" />
                    <div className="w-14 h-14 rounded-full bg-slate-800/90 flex items-center justify-center text-slate-400 shadow-md transition-all hover:bg-slate-700">
                      <MicOff size={22} />
                    </div>
                  </>
                )}
              </div>

              {/* Dynamic soundwave display (speaking / active listening) */}
              {(voiceState === 'speaking' || (voiceState === 'listening' && interimTranscript)) && (
                <div className="flex items-center justify-center gap-1.5 h-16 mt-6 select-none bg-slate-950/45 px-6 py-2 rounded-full border border-darkBorder/30 shadow-inner">
                  {[...Array(9)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1 rounded-full transition-all duration-300 ${
                        voiceState === 'listening' 
                          ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' 
                          : 'bg-pink-500 shadow-[0_0_10px_rgba(244,114,182,0.5)]'
                      }`}
                      style={{
                        animation: `wave-bar ${0.6 + (i % 3) * 0.25}s ease-in-out infinite alternate`,
                        animationDelay: `${i * 0.08}s`,
                        height: '15px'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Spoken Output Subtitles & Quick Stop Button (Bottom) */}
            <div className="w-full max-w-xl px-6 min-h-[6.5rem] flex flex-col items-center justify-center gap-3.5 z-10">
              {voiceState === 'speaking' && lastAiVoiceOutput && (
                <div className="w-full flex flex-col items-center gap-3 animate-fade-in">
                  <div className="bg-slate-950/85 border border-darkBorder/80 px-4 py-3 rounded-lg shadow-xl w-full max-h-24 overflow-y-auto backdrop-blur-md">
                    <span className="font-bold text-pink-400 text-[10px] uppercase block mb-1">Rudra's Response</span>
                    <p className="text-xs text-slate-200 text-center leading-relaxed font-medium">
                      {lastAiVoiceOutput}
                    </p>
                  </div>
                  
                  {/* Dedicated Quick-stop button */}
                  <button
                    onClick={interruptSpeech}
                    className="px-4 py-2 rounded-full bg-pink-600 hover:bg-pink-500 text-white font-black text-[11px] shadow-lg shadow-pink-600/35 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-pink-400/20"
                  >
                    <VolumeX size={13} />
                    <span>Stop Speaking</span>
                  </button>
                </div>
              )}
            </div>

            {/* Voice Customization Dropdown Selector */}
            {availableVoices.length > 0 && (
              <div className="flex flex-col items-center gap-1.5 mt-2 z-10 w-full max-w-xs">
                <label className="text-[9px] uppercase font-black text-slate-500 tracking-widest">
                  AI Mentor Voice Select
                </label>
                <select
                  value={selectedVoiceName}
                  onChange={(e) => setSelectedVoiceName(e.target.value)}
                  className="w-full bg-slate-950/80 text-[11px] text-slate-300 px-3 py-1.5 rounded-lg border border-darkBorder focus:outline-none focus:border-brandPurple focus:ring-1 focus:ring-brandPurple cursor-pointer hover:bg-slate-900 transition-all font-medium"
                >
                  {availableVoices.map(voice => (
                    <option key={voice.name} value={voice.name} className="bg-slate-950 text-slate-300 text-xs">
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Voice Controls Bar */}
            <div className="flex items-center gap-4 mt-4 z-10">
              {/* Mute/Unmute */}
              <button
                onClick={toggleMute}
                className={`p-3 rounded-full border transition-all hover:scale-110 active:scale-95 ${
                  isMuted 
                    ? 'bg-rose-500/20 border-rose-500/30 text-rose-400 hover:bg-rose-500/30 shadow-lg shadow-rose-500/10' 
                    : 'bg-slate-800 border-slate-700 text-emerald-400 hover:bg-slate-700'
                }`}
                title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
              >
                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              {/* End Session Button */}
              <button
                onClick={stopVoiceMode}
                className="p-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 hover:scale-115 active:scale-95 transition-all flex items-center justify-center border border-rose-500/10"
                title="End Live Session"
              >
                <PhoneOff size={22} />
              </button>

              {/* Interrupt / Repeat */}
              <button
                onClick={interruptSpeech}
                disabled={voiceState !== 'speaking'}
                className="p-3 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 disabled:cursor-not-allowed transition-all hover:scale-110 active:scale-95"
                title="Interrupt AI Speaking"
              >
                <VolumeX size={18} />
              </button>
            </div>

          </div>
        ) : (
          /* ==============================================
             STANDARD TEXT CHAT INTERFACE
             ============================================== */
          <>
            {/* Messages Stream */}
            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
              {messages.map((msg, idx) => {
                const isAI = msg.role === 'assistant';
                return (
                  <div 
                    key={idx} 
                    className={`flex gap-3 text-xs max-w-2xl ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                  >
                    {/* Avatar bubble */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                      isAI 
                        ? 'bg-indigo-600 border-indigo-700 text-white' 
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>
                      {isAI ? <Bot size={15} /> : <User size={15} />}
                    </div>

                    {/* Message Text bubble */}
                    <div className={`p-4 rounded-lg leading-relaxed whitespace-pre-line border ${
                      isAI 
                        ? 'bg-slate-50 border-slate-200 text-slate-800' 
                        : 'bg-indigo-600 border-indigo-700 text-white shadow-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                );
              })}

              {/* Loader bubble */}
              {loading && (
                <div className="flex gap-3 text-xs mr-auto items-center">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center border bg-indigo-50 border-indigo-200 text-indigo-600">
                    <Bot size={15} className="animate-spin" />
                  </div>
                  <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 italic">
                    Rudra is typing...
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-xs flex items-center gap-2 max-w-sm mx-auto animate-bounce">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Templates prompt selector (visible only on empty chats) */}
            {messages.length <= 1 && !loading && (
              <div className="space-y-2.5 pt-4 border-t border-slate-200 mt-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles size={11} className="text-amber-400" />
                  <span>Select Interview Prep Prompts to begin</span>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {templates.map(prompt => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      className="p-3 rounded-lg border border-slate-250 bg-slate-50 text-slate-700 text-left hover:bg-slate-100 hover:border-indigo-300 transition-all font-medium text-xs leading-tight"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

      </div>

      {/* Input row (only visible in text chat mode) */}
      {!isVoiceMode && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-3 text-xs shrink-0"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Rudra anything about coding, SQL or behaviorals..."
            className="flex-grow px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all hover:shadow-brand shrink-0 flex items-center justify-center disabled:opacity-50"
          >
            <Send size={15} />
          </button>
        </form>
      )}

    </div>
  );
};

export default AIMentor;
