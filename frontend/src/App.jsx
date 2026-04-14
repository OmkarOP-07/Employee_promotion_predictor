import React, { useState, useRef } from 'react';
import Header from './components/Header';
import PredictionForm from './components/PredictionForm';
import ResultCard from './components/ResultCard';
import BackgroundOrbs from './components/BackgroundOrbs';
import './index.css';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const resultRef = useRef(null);

  const handlePredict = async (formData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Prediction failed. Please try again.');
      }

      setResult(data);
      // Smooth scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Ambient background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: 'radial-gradient(ellipse at 20% 50%, rgba(120,40,200,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.12) 0%, transparent 60%), #0a0a1a',
        }}
      />
      <BackgroundOrbs />

      <div className="relative z-10 min-h-screen py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <Header />

          <main className="mt-8 space-y-6">
            <PredictionForm onPredict={handlePredict} loading={loading} />

            {error && (
              <div
                className="glass rounded-2xl p-4 border border-red-500/30 bg-red-500/10 animate-slide-up"
                style={{ animationDelay: '0.1s' }}
              >
                <p className="text-red-400 text-sm font-medium flex items-center gap-2">
                  <span>⚠️</span> {error}
                </p>
              </div>
            )}

            <div ref={resultRef}>
              {result && <ResultCard result={result} />}
            </div>
          </main>

          <footer className="mt-16 pb-8 text-center">
            <p className="text-xs text-white/20">
              Employee Promotion Predictor · Powered by Random Forest ML · Built with React &amp; Flask
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
