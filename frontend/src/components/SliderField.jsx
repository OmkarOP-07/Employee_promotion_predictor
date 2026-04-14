import React from 'react';

export default function SliderField({
  id, label, value, min, max, step,
  onChange, displayValue, markers, accentColor = '#a855f7',
}) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor={id}
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          {label}
        </label>
        <span
          className="text-sm font-bold px-3 py-1 rounded-lg"
          style={{
            background: `${accentColor}20`,
            color: accentColor,
            border: `1px solid ${accentColor}40`,
            minWidth: '60px',
            textAlign: 'center',
          }}
        >
          {displayValue}
        </span>
      </div>

      <div className="relative">
        {/* Track fill */}
        <div
          className="absolute top-1/2 left-0 h-1.5 rounded-full pointer-events-none"
          style={{
            width: `${percent}%`,
            background: `linear-gradient(90deg, ${accentColor}80, ${accentColor})`,
            transform: 'translateY(-50%)',
            zIndex: 1,
          }}
        />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="slider relative"
          style={{ zIndex: 2, position: 'relative' }}
        />
      </div>

      {markers && (
        <div className="flex justify-between mt-1">
          {markers.map(m => (
            <span key={m} className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
              {m}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
