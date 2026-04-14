import React from 'react';

export default function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Large purple orb top-left */}
      <div
        className="absolute bg-orb-1 rounded-full opacity-20 blur-3xl"
        style={{
          width: '600px',
          height: '600px',
          top: '-200px',
          left: '-200px',
          background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
        }}
      />
      {/* Blue orb top-right */}
      <div
        className="absolute bg-orb-2 rounded-full opacity-15 blur-3xl"
        style={{
          width: '500px',
          height: '500px',
          top: '-100px',
          right: '-150px',
          background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
        }}
      />
      {/* Teal orb bottom */}
      <div
        className="absolute rounded-full opacity-10 blur-3xl"
        style={{
          width: '400px',
          height: '400px',
          bottom: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(circle, #10b981 0%, transparent 70%)',
          animation: 'orb-drift-1 18s ease-in-out infinite',
        }}
      />
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(168,85,247,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,85,247,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}
