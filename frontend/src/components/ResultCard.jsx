import React, { useEffect, useState } from 'react';

function getColor(percent) {
  if (percent >= 60) return { bar: 'linear-gradient(90deg, #10b981, #34d399)', text: '#34d399', label: 'High', badge: '#10b98120', border: '#10b98140' };
  if (percent >= 35) return { bar: 'linear-gradient(90deg, #f59e0b, #fbbf24)', text: '#fbbf24', label: 'Medium', badge: '#f59e0b20', border: '#f59e0b40' };
  return { bar: 'linear-gradient(90deg, #ef4444, #f87171)', text: '#f87171', label: 'Low', badge: '#ef444420', border: '#ef444440' };
}

function AnimatedNumber({ target, duration = 1500 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const steps = 60;
    const inc = target / steps;
    const interval = duration / steps;
    const timer = setInterval(() => {
      start += inc;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.round(start * 10) / 10);
    }, interval);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{val.toFixed(1)}</>;
}

export default function ResultCard({ result }) {
  const { eligible, label, probability, not_promoted_probability } = result;
  const colors = getColor(probability);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    // Trigger bar animation after mount
    const t = setTimeout(() => setBarWidth(probability), 50);
    return () => clearTimeout(t);
  }, [probability]);

  const metrics = [
    { label: 'Promotion Chance', value: probability, color: colors, bar: true },
    { label: 'Non-Promotion', value: not_promoted_probability, color: getColor(not_promoted_probability), bar: false },
  ];

  return (
    <div
      className="result-card-enter glass-strong rounded-3xl p-6 sm:p-8"
      style={{
        boxShadow: eligible
          ? '0 8px 60px rgba(16, 185, 129, 0.15), 0 0 0 1px rgba(16,185,129,0.15)'
          : '0 8px 60px rgba(239,68,68,0.12), 0 0 0 1px rgba(239,68,68,0.12)',
      }}
    >
      {/* Top Result Banner */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pb-6 mb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Big emoji */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
          style={{
            background: eligible
              ? 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(52,211,153,0.1))'
              : 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(248,113,113,0.1))',
            border: eligible ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)',
          }}
        >
          {eligible ? '✅' : '❌'}
        </div>

        <div className="text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
            AI Prediction Result
          </p>
          <h2
            className="text-xl sm:text-2xl font-black"
            style={{
              fontFamily: "'Outfit', sans-serif",
              color: eligible ? '#34d399' : '#f87171',
            }}
          >
            {label}
          </h2>
        </div>

        {/* Probability badge */}
        <div className="sm:ml-auto text-center">
          <div
            className="w-20 h-20 rounded-full flex flex-col items-center justify-center"
            style={{
              background: `conic-gradient(${colors.text} ${probability * 3.6}deg, rgba(255,255,255,0.06) 0deg)`,
              padding: '3px',
            }}
          >
            <div
              className="w-full h-full rounded-full flex flex-col items-center justify-center"
              style={{ background: '#0d0d20' }}
            >
              <span
                className="text-lg font-black leading-none"
                style={{ color: colors.text, fontFamily: "'Outfit', sans-serif" }}
              >
                <AnimatedNumber target={probability} />%
              </span>
              <span className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                chance
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Promotion Probability
          </span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: colors.badge, color: colors.text, border: `1px solid ${colors.border}` }}
          >
            {colors.label} Confidence
          </span>
        </div>

        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{
              width: `${barWidth}%`,
              background: colors.bar,
            }}
          />
        </div>

        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>0%</span>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>50%</span>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>100%</span>
        </div>
      </div>

      {/* Two probability cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { label: '✅ Promotion', value: probability, eligible: true },
          { label: '❌ No Promotion', value: not_promoted_probability, eligible: false },
        ].map(({ label: l, value, eligible: e }) => {
          const c = getColor(value);
          return (
            <div
              key={l}
              className="rounded-2xl p-4 text-center"
              style={{
                background: `${e ? '#10b981' : '#ef4444'}0a`,
                border: `1px solid ${e ? '#10b981' : '#ef4444'}20`,
              }}
            >
              <p className="text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{l}</p>
              <p
                className="text-2xl font-black"
                style={{ color: e ? '#34d399' : '#f87171', fontFamily: "'Outfit', sans-serif" }}
              >
                <AnimatedNumber target={value} /><span className="text-base">%</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Insight footer */}
      <div
        className="rounded-2xl p-4 flex items-start gap-3"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        <span className="text-xl">💡</span>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
          {eligible
            ? `This employee shows strong indicators for promotion with ${probability.toFixed(1)}% confidence. Key positive factors likely include performance, training, and project history.`
            : `Current indicators suggest promotion is unlikely at ${probability.toFixed(1)}% probability. Improving performance rating, training scores, and project completion may increase chances.`}
        </p>
      </div>
    </div>
  );
}
