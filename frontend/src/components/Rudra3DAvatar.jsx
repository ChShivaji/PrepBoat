import React from 'react';

const Rudra3DAvatar = ({ size = 24, className = '', active = false }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none ${className}`}
    >
      <defs>
        <linearGradient id="avatarGradIndigo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <filter id="avatarGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Orbit Rings (3D background) */}
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke="url(#avatarGradIndigo)"
        strokeWidth="1.5"
        strokeDasharray="24 16"
        fill="none"
        opacity="0.45"
        className="animate-spin-slow"
      />
      <circle
        cx="50"
        cy="50"
        r="38"
        stroke="url(#avatarGradIndigo)"
        strokeWidth="1"
        strokeDasharray="8 8"
        fill="none"
        opacity="0.25"
        className="animate-spin"
        style={{ animationDuration: '25s', animationDirection: 'reverse' }}
      />

      {/* Glow Backdrop */}
      <circle
        cx="50"
        cy="50"
        r="28"
        fill="url(#avatarGradIndigo)"
        opacity="0.15"
        filter="url(#avatarGlow)"
      />

      {/* Antenna / Communication Pole */}
      <line
        x1="50"
        y1="28"
        x2="50"
        y2="14"
        stroke="url(#avatarGradIndigo)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle
        cx="50"
        cy="12"
        r="4"
        fill={active ? '#10B981' : 'url(#avatarGradIndigo)'}
        className={active ? 'animate-ping' : ''}
        style={{ transformOrigin: '50px 12px' }}
      />
      <circle
        cx="50"
        cy="12"
        r="3"
        fill={active ? '#10B981' : '#EC4899'}
      />

      {/* Left/Right metallic ears */}
      <rect x="15" y="38" width="6" height="24" rx="3" fill="#475569" stroke="#1E293B" strokeWidth="1.5" />
      <rect x="79" y="38" width="6" height="24" rx="3" fill="#475569" stroke="#1E293B" strokeWidth="1.5" />
      
      {/* Ear connections */}
      <rect x="18" y="46" width="10" height="8" fill="#64748B" />
      <rect x="72" y="46" width="10" height="8" fill="#64748B" />

      {/* Main Bot Head Base */}
      <rect
        x="24"
        y="25"
        width="52"
        height="50"
        rx="20"
        fill="#1E293B"
        stroke="url(#avatarGradIndigo)"
        strokeWidth="2.5"
        filter="url(#avatarGlow)"
      />

      {/* Visor shield */}
      <rect
        x="30"
        y="33"
        width="40"
        height="22"
        rx="8"
        fill="#0F172A"
        stroke="url(#avatarGradIndigo)"
        strokeWidth="1.5"
      />

      {/* Glowing Eyes */}
      <g>
        {active ? (
          <>
            <ellipse cx="42" cy="42" rx="6" ry="4" fill="#10B981" />
            <ellipse cx="58" cy="42" rx="6" ry="4" fill="#10B981" />
            <circle cx="42" cy="42" r="1.5" fill="#FFFFFF" />
            <circle cx="58" cy="42" r="1.5" fill="#FFFFFF" />
          </>
        ) : (
          <>
            <ellipse cx="42" cy="44" rx="5" ry="2.5" fill="#38BDF8" className="animate-pulse" />
            <ellipse cx="58" cy="44" rx="5" ry="2.5" fill="#38BDF8" className="animate-pulse" />
          </>
        )}
      </g>

      {/* Audio Wave / Mouth Indicator */}
      {active ? (
        <path
          d="M 40,49 Q 45,53 50,49 Q 55,53 60,49"
          stroke="#10B981"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      ) : (
        <path
          d="M 42,50 Q 50,54 58,50"
          stroke="#8B5CF6"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      )}

      {/* Chest/Collar Plate (Bottom support) */}
      <path
        d="M 36,75 L 64,75 L 58,84 L 42,84 Z"
        fill="#334155"
        stroke="url(#avatarGradIndigo)"
        strokeWidth="1.5"
      />
    </svg>
  );
};

export default Rudra3DAvatar;
