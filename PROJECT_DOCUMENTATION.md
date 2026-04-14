# 📘 Employee Promotion Predictor — Project Documentation

> A full-stack AI web application that predicts employee promotion eligibility using Machine Learning (Random Forest), a Python Flask backend, and a React.js frontend with Tailwind CSS.

---

## 📁 Project Structure

```
DS assignment project/
├── synthetic_hr_dataset.csv      ← Raw HR dataset (1000 records)
│
├── backend/
│   ├── train_model.py            ← ML model training script
│   ├── app.py                    ← Flask REST API
│   ├── requirements.txt          ← Python dependencies
│   ├── model.pkl                 ← Saved trained model (auto-generated)
│   └── feature_info.pkl          ← Feature metadata (auto-generated)
│
└── frontend/
    ├── index.html                ← Entry HTML file
    ├── vite.config.js            ← Vite + Tailwind config
    ├── package.json              ← Node dependencies
    └── src/
        ├── main.jsx              ← React entry point
        ├── App.jsx               ← Root component (state + API calls)
        ├── index.css             ← Global styles + animations
        └── components/
            ├── Header.jsx        ← Title, badges, animated icon
            ├── BackgroundOrbs.jsx← Ambient gradient orbs
            ├── PredictionForm.jsx← Main form with validation
            ├── FormSection.jsx   ← Grouped form section wrapper
            ├── SliderField.jsx   ← Custom styled range slider
            └── ResultCard.jsx    ← Animated result display
```

---

## 🛠️ Tech Stack Explained

### Frontend

| Technology | What It Is | Why Used |
|---|---|---|
| **React.js** | JavaScript UI library by Meta | Component-based structure for reactive, state-driven UI |
| **Vite** | Next-gen build tool | Lightning-fast dev server (~4s startup), HMR support |
| **Tailwind CSS v4** | Utility-first CSS framework | Rapid styling with design tokens; v4 uses `@tailwindcss/vite` plugin |
| **Vanilla CSS** | Custom CSS animations & glass effects | Glassmorphism, gradient text, progress bars, sliders |
| **fetch API** | Built-in browser HTTP client | Sends POST request to Flask `/predict` endpoint |

### Backend

| Technology | What It Is | Why Used |
|---|---|---|
| **Python 3** | Programming language | Industry standard for ML/data science |
| **Flask** | Lightweight Python web framework | Simple REST API creation with minimal boilerplate |
| **Flask-CORS** | Flask extension for Cross-Origin requests | Allows React (port 5173) to call Flask (port 5000) |

### Machine Learning

| Library | What It Does |
|---|---|
| **scikit-learn** | Core ML library — provides all algorithms, pipelines, preprocessing |
| **pandas** | Data loading and manipulation (CSV reading, DataFrame operations) |
| **numpy** | Numerical operations underlying scikit-learn |
| **joblib** | Saves/loads the trained model pipeline to/from disk (`.pkl` files) |

---

## 🧠 Machine Learning Deep Dive

### Algorithm: Random Forest Classifier

A **Random Forest** is an ensemble of Decision Trees. Here's how it works:

```
Input Features
     │
     ▼
┌─────────────────────────────────┐
│  Build N Decision Trees         │
│  (each on random subset of data │
│   and random subset of features)│
└─────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│  Each tree votes: 0 or 1        │
│  (Not Promoted / Promoted)      │
└─────────────────────────────────┘
     │
     ▼
 Majority vote = Final Prediction
 Vote fraction  = Probability (predict_proba)
```

**Why Random Forest?**
- Handles missing values gracefully (via imputation pipeline)
- Robust to outliers
- Provides `predict_proba()` for confidence percentages
- Doesn't require feature scaling (unlike Logistic Regression, SVM)
- High accuracy on tabular HR data

**Model Parameters used:**
```python
RandomForestClassifier(
    n_estimators=200,      # 200 trees in the forest
    max_depth=10,          # Limit tree depth to avoid overfitting
    min_samples_split=5,   # Node must have >=5 samples to split
    min_samples_leaf=2,    # Each leaf must have >=2 samples
    class_weight="balanced",  # Handles class imbalance (fewer promotions)
    random_state=42,       # Reproducibility
)
```

---

## 🔄 Data Preprocessing Pipeline

The dataset has **missing values** in Age, Education, Performance_Rating, and Training_Score.

```
Raw Input Data
      │
      ▼
┌─────────────────────────────────────────┐
│  ColumnTransformer                       │
│                                          │
│  Numerical Columns:                      │
│    Age, Experience_Years,                │
│    Performance_Rating, Training_Score,   │
│    Attendance_Percentage,               │
│    Projects_Completed                    │
│    → SimpleImputer(strategy="median")   │
│                                          │
│  Categorical Columns:                    │
│    Gender, Education, Department         │
│    → SimpleImputer(strategy="most_freq")│
│    → OrdinalEncoder                     │
└─────────────────────────────────────────┘
      │
      ▼
  RandomForestClassifier
      │
      ▼
  predict()       → Class label (0=No, 1=Yes)
  predict_proba() → [P(No), P(Yes)]
```

### Encoding Categorical Variables

| Variable | Values | Encoded As |
|---|---|---|
| Gender | Male, Female | 0, 1 |
| Education | Bachelors, Masters, PhD | 0, 1, 2 |
| Department | Finance, HR, IT, Marketing, Sales | 0, 1, 2, 3, 4 |

**OrdinalEncoder** assigns integer codes. `handle_unknown="use_encoded_value"` with `unknown_value=-1` means unseen categories at prediction time won't crash the model.

---

## 🌐 API Reference

### `GET /`
Health check endpoint.

**Response:**
```json
{
  "status": "running",
  "model_loaded": true,
  "message": "Employee Promotion Predictor API is live 🚀"
}
```

---

### `POST /predict`
Main prediction endpoint.

**Request Body (JSON):**
```json
{
  "Age": 35,
  "Experience_Years": 8,
  "Gender": "Male",
  "Education": "Masters",
  "Department": "IT",
  "Performance_Rating": 4,
  "Training_Score": 80,
  "Attendance_Percentage": 90.5,
  "Projects_Completed": 7
}
```

**Response (JSON):**
```json
{
  "prediction": 1,
  "label": "Eligible for Promotion",
  "probability": 78.5,
  "not_promoted_probability": 21.5,
  "eligible": true
}
```

| Field | Type | Description |
|---|---|---|
| `prediction` | `int` | `1` = Promoted, `0` = Not Promoted |
| `label` | `string` | Human-readable result |
| `probability` | `float` | % chance of promotion |
| `not_promoted_probability` | `float` | % chance of no promotion |
| `eligible` | `bool` | `true` if promotion predicted |

---

## ⚛️ React Component Architecture

```
App.jsx
├── BackgroundOrbs.jsx    (ambient gradient orbs — decorative)
├── Header.jsx            (title, feature badges, animated icon)
├── PredictionForm.jsx    (main form)
│   ├── FormSection.jsx   (section wrapper — Personal Info, Work, Metrics)
│   └── SliderField.jsx   (range slider with fill track + value badge)
└── ResultCard.jsx        (animated output — conic dial, progress bar, insight)
```

### Key React Concepts Used

| Concept | Where Used |
|---|---|
| `useState` | Form state, result, loading, errors |
| `useEffect` | Progress bar animation trigger, animated number counter |
| `useRef` | Smooth scroll to result card after prediction |
| `props` | Passing `onPredict`, `loading`, `result` between components |
| Controlled Inputs | All `<input>`, `<select>`, `<range>` elements have value + onChange |
| Conditional Rendering | Result card only renders after a prediction; error banner on failure |

---

## 🎨 UI Design System

### Color Coding for Results

| Probability | Color | Meaning |
|---|---|---|
| >= 60% | Green (#10b981) | High confidence — Likely promoted |
| 35–59% | Yellow (#f59e0b) | Medium confidence |
| < 35% | Red (#ef4444) | Low probability — Not likely promoted |

### Design Techniques

| Technique | Description |
|---|---|
| **Glassmorphism** | `backdrop-filter: blur()` + semi-transparent background |
| **Gradient text** | `background-clip: text` on linear-gradient for neon titles |
| **Conic gradient** | CSS `conic-gradient()` for the circular probability dial |
| **Animated counter** | `useEffect` + `setInterval` to count up to the probability value |
| **Progress bar animation** | CSS `transition: width 1.5s` triggered by `useEffect` |
| **Float animation** | `@keyframes float` for the header brain icon |
| **Shimmer effect** | `@keyframes shimmer` on the progress bar fill |

---

## 🚀 How to Run the Project

### Prerequisites

- **Python 3.9+** installed
- **Node.js 18+** and **npm** installed

---

### Step 1 — Install Python Dependencies

```bash
cd backend
pip install flask flask-cors scikit-learn pandas numpy joblib
```

---

### Step 2 — Train the ML Model

```bash
cd backend
python train_model.py
```

This will:
- Load `synthetic_hr_dataset.csv`
- Preprocess + train the Random Forest model
- Print accuracy and classification report
- Save `model.pkl` and `feature_info.pkl`

**Expected output:**
```
Accuracy: 0.9550
Classification Report:
              precision    recall  f1-score
Not Promoted       0.96      0.99      0.97
    Promoted       0.95      0.84      0.89
```

---

### Step 3 — Start the Flask Backend

```bash
cd backend
python app.py
```

> Backend runs at: **http://localhost:5000**

---

### Step 4 — Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

### Step 5 — Start the React Frontend

```bash
cd frontend
npm run dev
```

> Open **http://localhost:5173** in your browser.

The Vite proxy automatically forwards `/predict` calls to Flask at port 5000 — no CORS issues.

---

## 📊 Dataset Overview

| Column | Type | Description |
|---|---|---|
| `Employee_ID` | int | Unique identifier (not used in model) |
| `Age` | float | Employee age (18–65) |
| `Experience_Years` | int | Years of work experience (0–19) |
| `Department` | string | IT, HR, Sales, Finance, Marketing |
| `Education` | string | Bachelors, Masters, PhD |
| `Gender` | string | Male, Female |
| `Performance_Rating` | float | Manager rating (1–5) |
| `Training_Score` | float | Training test score (0–100) |
| `Attendance_Percentage` | float | Attendance % (60–100) |
| `Projects_Completed` | int | Number of completed projects |
| `Salary` | int | Current salary (not used in model) |
| `Promotion` | string | **Target** — `Yes` / `No` |

**Missing values handled:** Age, Education, Performance_Rating, Training_Score all have ~10% missing values — filled with median/mode via scikit-learn's `SimpleImputer`.

---

## 🧪 Model Performance Summary

| Metric | Value |
|---|---|
| **Accuracy** | **95.5%** |
| Precision (Not Promoted) | 96% |
| Precision (Promoted) | 95% |
| Recall (Promoted) | 84% |
| F1-Score (overall) | 0.95 |
| Train/Test Split | 80% / 20% |
| Total Records | 1,000 |

---

## 📦 Dependencies Reference

### Python (`backend/requirements.txt`)

| Package | Purpose |
|---|---|
| `flask` | REST API framework |
| `flask-cors` | Enable React → Flask cross-origin requests |
| `scikit-learn` | ML algorithms, pipelines, encoders |
| `pandas` | CSV loading, DataFrame handling |
| `numpy` | Numerical array operations |
| `joblib` | Save/load model with pickle |

### JavaScript (`frontend/package.json`)

| Package | Purpose |
|---|---|
| `react` + `react-dom` | Core UI library |
| `vite` | Build tool and dev server |
| `@tailwindcss/vite` | Tailwind CSS v4 Vite plugin |
| `tailwindcss` | Utility CSS classes |

---

## 💡 Key Concepts Glossary

| Term | Simple Explanation |
|---|---|
| **Classification** | ML task where output is a category (Yes/No) — not a number |
| **Random Forest** | Many decision trees voting together for a more accurate answer |
| **predict()** | Returns the predicted class label (0 or 1) |
| **predict_proba()** | Returns probability of each class — e.g. `[0.22, 0.78]` |
| **Pipeline** | Chains preprocessing + model into one object — avoids data leakage |
| **Imputer** | Fills missing values automatically (mean/median/mode) |
| **OrdinalEncoder** | Converts text categories (Male/Female) to numbers |
| **CORS** | Browser security rule — Flask-CORS allows cross-port API calls |
| **Vite Proxy** | Routes `/predict` from port 5173 → 5000 transparently |
| **Glassmorphism** | Blurred, semi-transparent frosted glass UI effect |
| **Controlled Component** | React input whose value is always tied to state |
| **REST API** | Stateless HTTP interface — frontend sends JSON, backend responds JSON |
