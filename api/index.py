"""
Employee Promotion Predictor - Flask Backend API
=================================================
Exposes a /predict endpoint that accepts employee data as JSON
and returns {'prediction': ..., 'probability': ...}.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os
import logging

# ──────────────────────────────────────────────
# App setup
# ──────────────────────────────────────────────
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ──────────────────────────────────────────────
# Load trained model
# ──────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
FEATURE_INFO_PATH = os.path.join(BASE_DIR, "feature_info.pkl")

model_pipeline = None
feature_info = None

def load_model():
    global model_pipeline, feature_info
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            f"Model not found at {MODEL_PATH}. "
            "Please run 'python train_model.py' first."
        )
    model_pipeline = joblib.load(MODEL_PATH)
    feature_info = joblib.load(FEATURE_INFO_PATH)
    logger.info("Model loaded successfully.")

try:
    load_model()
except FileNotFoundError as e:
    logger.warning(str(e))

# ──────────────────────────────────────────────
# Routes
# ──────────────────────────────────────────────
@app.route("/", methods=["GET"])
def health():
    model_ready = model_pipeline is not None
    return jsonify({
        "status": "running",
        "model_loaded": model_ready,
        "message": "Employee Promotion Predictor API is live 🚀"
    })


@app.route("/api/predict", methods=["POST"])
@app.route("/predict", methods=["POST"])
def predict():
    if model_pipeline is None:
        return jsonify({"error": "Model not loaded. Run train_model.py first."}), 503

    data = request.get_json(force=True)
    if not data:
        return jsonify({"error": "No JSON body provided."}), 400

    # Required fields
    required = [
        "Age", "Experience_Years", "Gender", "Education",
        "Department", "Performance_Rating", "Training_Score",
        "Attendance_Percentage", "Projects_Completed"
    ]
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {missing}"}), 400

    # Build DataFrame
    try:
        input_df = pd.DataFrame([{
            "Age": float(data["Age"]),
            "Experience_Years": float(data["Experience_Years"]),
            "Gender": str(data["Gender"]),
            "Education": str(data["Education"]),
            "Department": str(data["Department"]),
            "Performance_Rating": float(data["Performance_Rating"]),
            "Training_Score": float(data["Training_Score"]),
            "Attendance_Percentage": float(data["Attendance_Percentage"]),
            "Projects_Completed": float(data["Projects_Completed"]),
        }])
    except (ValueError, TypeError) as e:
        return jsonify({"error": f"Invalid value: {str(e)}"}), 400

    # Predict
    try:
        prediction = int(model_pipeline.predict(input_df)[0])
        proba = model_pipeline.predict_proba(input_df)[0]
        # proba[1] = probability of being promoted
        promo_probability = round(float(proba[1]) * 100, 2)
        not_promo_probability = round(float(proba[0]) * 100, 2)

        label = "Eligible for Promotion" if prediction == 1 else "Not Eligible for Promotion"

        logger.info(f"Prediction: {label} ({promo_probability}%)")

        return jsonify({
            "prediction": prediction,
            "label": label,
            "probability": promo_probability,
            "not_promoted_probability": not_promo_probability,
            "eligible": prediction == 1,
        })

    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return jsonify({"error": "Prediction failed. Check server logs."}), 500


@app.route("/api/feature-info", methods=["GET"])
@app.route("/feature-info", methods=["GET"])
def get_feature_info():
    if feature_info is None:
        return jsonify({"error": "Feature info not loaded."}), 503
    return jsonify(feature_info)


# ──────────────────────────────────────────────
# Run
# ──────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
