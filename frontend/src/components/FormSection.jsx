import React from 'react';

export default function FormSection({ title, children }) {
  return (
    <div
      className="mb-6 rounded-2xl p-4 sm:p-5"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <p
        className="text-xs font-bold uppercase tracking-widest mb-4"
        style={{ color: 'rgba(168,85,247,0.8)' }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}
