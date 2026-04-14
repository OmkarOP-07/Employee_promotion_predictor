import React, { useState } from 'react';
import FormSection from './FormSection';
import SliderField from './SliderField';

const INITIAL = {
  Age: '',
  Experience_Years: '',
  Gender: '',
  Education: '',
  Department: '',
  Performance_Rating: 3,
  Training_Score: 70,
  Attendance_Percentage: 85,
  Projects_Completed: '',
};

const ERRORS_INITIAL = {};

function validate(form) {
  const errs = {};
  const age = Number(form.Age);
  const exp = Number(form.Experience_Years);
  const proj = Number(form.Projects_Completed);

  if (!form.Age || isNaN(age) || age < 18 || age > 70) errs.Age = 'Age must be 18–70';
  if (form.Experience_Years === '' || isNaN(exp) || exp < 0 || exp > 45) errs.Experience_Years = 'Experience 0–45 yrs';
  if (!form.Gender) errs.Gender = 'Required';
  if (!form.Education) errs.Education = 'Required';
  if (!form.Department) errs.Department = 'Required';
  if (form.Projects_Completed === '' || isNaN(proj) || proj < 0 || proj > 50) errs.Projects_Completed = 'Projects 0–50';
  return errs;
}

export default function PredictionForm({ onPredict, loading }) {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState(ERRORS_INITIAL);
  const [touched, setTouched] = useState({});

  const set = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const errs = validate({ ...form, [name]: value });
      setErrors(prev => ({ ...prev, [name]: errs[name] }));
    }
  };

  const touch = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const errs = validate(form);
    setErrors(prev => ({ ...prev, [name]: errs[name] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(Object.keys(form).map(k => [k, true]));
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onPredict({
      Age: Number(form.Age),
      Experience_Years: Number(form.Experience_Years),
      Gender: form.Gender,
      Education: form.Education,
      Department: form.Department,
      Performance_Rating: Number(form.Performance_Rating),
      Training_Score: Number(form.Training_Score),
      Attendance_Percentage: Number(form.Attendance_Percentage),
      Projects_Completed: Number(form.Projects_Completed),
    });
  };

  const handleReset = () => {
    setForm(INITIAL);
    setErrors({});
    setTouched({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-strong rounded-3xl p-6 sm:p-8 animate-slide-up"
      style={{
        boxShadow: '0 8px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
      noValidate
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white/90" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Employee Profile
          </h2>
          <p className="text-xs text-white/35 mt-0.5">Fill in all fields for accurate prediction</p>
        </div>
        <span className="text-2xl">👤</span>
      </div>

      {/* ── Section 1: Personal Info ── */}
      <FormSection title="📋 Personal Information" icon="">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Age */}
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Age</label>
            <input
              id="age-input"
              type="number"
              min={18} max={70}
              value={form.Age}
              onChange={e => set('Age', e.target.value)}
              onBlur={() => touch('Age')}
              placeholder="e.g. 32"
              className="input-field"
            />
            {errors.Age && <p className="text-red-400 text-xs mt-1">{errors.Age}</p>}
          </div>

          {/* Experience */}
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Experience (Years)</label>
            <input
              id="experience-input"
              type="number"
              min={0} max={45}
              value={form.Experience_Years}
              onChange={e => set('Experience_Years', e.target.value)}
              onBlur={() => touch('Experience_Years')}
              placeholder="e.g. 8"
              className="input-field"
            />
            {errors.Experience_Years && <p className="text-red-400 text-xs mt-1">{errors.Experience_Years}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Gender</label>
            <select
              id="gender-select"
              value={form.Gender}
              onChange={e => set('Gender', e.target.value)}
              onBlur={() => touch('Gender')}
              className="input-field"
              style={{ cursor: 'pointer' }}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.Gender && <p className="text-red-400 text-xs mt-1">{errors.Gender}</p>}
          </div>

          {/* Education */}
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Education</label>
            <select
              id="education-select"
              value={form.Education}
              onChange={e => set('Education', e.target.value)}
              onBlur={() => touch('Education')}
              className="input-field"
              style={{ cursor: 'pointer' }}
            >
              <option value="">Select Education</option>
              <option value="Bachelors">Bachelors</option>
              <option value="Masters">Masters</option>
              <option value="PhD">PhD</option>
            </select>
            {errors.Education && <p className="text-red-400 text-xs mt-1">{errors.Education}</p>}
          </div>
        </div>
      </FormSection>

      {/* ── Section 2: Work Details ── */}
      <FormSection title="🏢 Work Details" icon="">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Department */}
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Department</label>
            <select
              id="department-select"
              value={form.Department}
              onChange={e => set('Department', e.target.value)}
              onBlur={() => touch('Department')}
              className="input-field"
              style={{ cursor: 'pointer' }}
            >
              <option value="">Select Department</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
            </select>
            {errors.Department && <p className="text-red-400 text-xs mt-1">{errors.Department}</p>}
          </div>

          {/* Projects */}
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Projects Completed</label>
            <input
              id="projects-input"
              type="number"
              min={0} max={50}
              value={form.Projects_Completed}
              onChange={e => set('Projects_Completed', e.target.value)}
              onBlur={() => touch('Projects_Completed')}
              placeholder="e.g. 5"
              className="input-field"
            />
            {errors.Projects_Completed && <p className="text-red-400 text-xs mt-1">{errors.Projects_Completed}</p>}
          </div>
        </div>
      </FormSection>

      {/* ── Section 3: Performance Metrics ── */}
      <FormSection title="📈 Performance Metrics" icon="">
        <div className="space-y-5">
          <SliderField
            id="performance-slider"
            label="Performance Rating"
            value={form.Performance_Rating}
            min={1} max={5} step={1}
            onChange={v => set('Performance_Rating', v)}
            displayValue={`${form.Performance_Rating} / 5`}
            markers={['1', '2', '3', '4', '5']}
            accentColor="#a855f7"
          />
          <SliderField
            id="training-slider"
            label="Training Score"
            value={form.Training_Score}
            min={0} max={100} step={1}
            onChange={v => set('Training_Score', v)}
            displayValue={`${form.Training_Score}%`}
            accentColor="#3b82f6"
          />
          <SliderField
            id="attendance-slider"
            label="Attendance Percentage"
            value={form.Attendance_Percentage}
            min={0} max={100} step={0.1}
            onChange={v => set('Attendance_Percentage', v)}
            displayValue={`${Number(form.Attendance_Percentage).toFixed(1)}%`}
            accentColor="#10b981"
          />
        </div>
      </FormSection>

      {/* ── Actions ── */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          id="predict-btn"
          disabled={loading}
          className="btn-primary flex-1 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <span className="spinner" />
              Analyzing...
            </>
          ) : (
            <>
              <span>🔮</span>
              Predict Promotion
            </>
          )}
        </button>

        <button
          type="button"
          id="reset-btn"
          onClick={handleReset}
          disabled={loading}
          className="px-6 py-4 rounded-2xl text-sm font-semibold text-white/50 transition-all hover:text-white/80 hover:bg-white/5"
          style={{ border: '1px solid rgba(255,255,255,0.1)' }}
        >
          Reset
        </button>
      </div>
    </form>
  );
}
