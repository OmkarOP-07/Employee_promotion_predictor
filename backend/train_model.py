"""
Employee Promotion Predictor - Model Training Script
=====================================================
Trains a Random Forest classifier on the HR dataset and saves
the model + preprocessor to disk for use by the Flask API.
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OrdinalEncoder
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

# ──────────────────────────────────────────────
# 1. Load dataset
# ──────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "..", "synthetic_hr_dataset.csv")

df = pd.read_csv(DATA_PATH)
print(f"Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")
print(df.head())
print("\nMissing values:\n", df.isnull().sum())

# ──────────────────────────────────────────────
# 2. Feature engineering
# ──────────────────────────────────────────────
# Drop columns not used in prediction
FEATURES = [
    "Age", "Experience_Years",
    "Gender", "Education", "Department",
    "Performance_Rating", "Training_Score",
    "Attendance_Percentage", "Projects_Completed",
]
TARGET = "Promotion"

df_model = df[FEATURES + [TARGET]].copy()

# Encode target: Yes → 1, No → 0
df_model[TARGET] = (df_model[TARGET] == "Yes").astype(int)

X = df_model[FEATURES]
y = df_model[TARGET]

# ──────────────────────────────────────────────
# 3. Define preprocessing pipelines
# ──────────────────────────────────────────────
numerical_features = ["Age", "Experience_Years", "Performance_Rating",
                      "Training_Score", "Attendance_Percentage", "Projects_Completed"]
categorical_features = ["Gender", "Education", "Department"]

numerical_pipeline = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="median")),
])

categorical_pipeline = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("encoder", OrdinalEncoder(handle_unknown="use_encoded_value", unknown_value=-1)),
])

preprocessor = ColumnTransformer(transformers=[
    ("num", numerical_pipeline, numerical_features),
    ("cat", categorical_pipeline, categorical_features),
])

# ──────────────────────────────────────────────
# 4. Build full pipeline
# ──────────────────────────────────────────────
model_pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("classifier", RandomForestClassifier(
        n_estimators=200,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
    )),
])

# ──────────────────────────────────────────────
# 5. Train / Evaluate
# ──────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model_pipeline.fit(X_train, y_train)
y_pred = model_pipeline.predict(X_test)

print("\n=== Model Evaluation ===")
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=["Not Promoted", "Promoted"]))

# ──────────────────────────────────────────────
# 6. Save model
# ──────────────────────────────────────────────
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
joblib.dump(model_pipeline, MODEL_PATH)
print(f"\nModel saved to: {MODEL_PATH}")

# Also save feature list for validation
FEATURE_INFO = {
    "features": FEATURES,
    "categorical": categorical_features,
    "numerical": numerical_features,
}
joblib.dump(FEATURE_INFO, os.path.join(BASE_DIR, "feature_info.pkl"))
print("Feature info saved.")
