import React from 'react';

export default function Header() {
  return (
    <header className="text-center pt-6 pb-2">
      {/* Icon + badge */}
      <div className="flex justify-center mb-5">
        <div
          className="animate-float animate-pulse-glow relative"
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
          }}
        >
          🧠
          {/* AI badge */}
          <span
            className="absolute -top-2 -right-2 text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              background: 'linear-gradient(90deg, #10b981, #34d399)',
              color: '#0a0a1a',
              fontSize: '10px',
              letterSpacing: '0.5px',
            }}
          >
            AI
          </span>
        </div>
      </div>

      {/* Title */}
      <h1
        className="neon-text font-black mb-3"
        style={{
          fontFamily: "'Outfit', 'Inter', sans-serif",
          fontSize: 'clamp(26px, 5vw, 48px)',
          letterSpacing: '-0.5px',
          lineHeight: 1.1,
        }}
      >
        Employee Promotion
        <br />
        <span style={{ fontSize: '0.7em', opacity: 0.9 }}>Predictor</span>
      </h1>

      {/* Subtitle */}
      <p className="text-sm sm:text-base font-medium mb-4" style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '480px', margin: '0 auto 16px' }}>
        Enter employee details below and our AI model will predict promotion
        eligibility with confidence probability.
      </p>

      {/* Stat pills */}
      <div className="flex flex-wrap justify-center gap-3">
        {[
          { icon: '🌲', label: 'Random Forest', color: '#10b981' },
          { icon: '📊', label: '1000+ Records', color: '#3b82f6' },
          { icon: '⚡', label: 'Real-time', color: '#a855f7' },
        ].map(({ icon, label, color }) => (
          <span
            key={label}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: `${color}18`,
              border: `1px solid ${color}40`,
              color: color,
            }}
          >
            {icon} {label}
          </span>
        ))}
      </div>
    </header>
  );
}
