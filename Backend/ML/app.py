# =====================================================
# Python API for UrbanService ML predictions
# =====================================================

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

import pandas as pd


# =====================================================
# 1. Create Flask application
# =====================================================

app = Flask(__name__)
CORS(app)


# =====================================================
# 2. Load trained ML models
# =====================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

service_model = joblib.load(
    os.path.join(BASE_DIR, "models", "service_model.pkl")
)

cost_model = joblib.load(
    os.path.join(BASE_DIR, "models", "cost_model.pkl")
)

duration_model = joblib.load(
    os.path.join(BASE_DIR, "models", "duration_model.pkl")
)


# =====================================================
# 3. Prediction API
# =====================================================

@app.post("/predict")
def predict_service():

    try:
        data = request.get_json()

        problem_description = data.get("problem_description", "").strip()

        if not problem_description:
            return jsonify({
                "success": False,
                "message": "Problem description is required"
            }), 400


        # -------------------------------------------------
        # Predict recommended service
        # -------------------------------------------------

        predicted_service = service_model.predict(
            [problem_description]
        )[0]


        # -------------------------------------------------
        # Find issue and complexity from training data
        # -------------------------------------------------

        # Default values used for the first prediction version
        issue = "General issue"
        complexity = "Medium"


        # -------------------------------------------------
        # Prepare input for cost and duration models
        # Pandas DataFrame is required because the models
        # were trained with named columns.
        # -------------------------------------------------


        prediction_input = pd.DataFrame([
            {
            "problem_description": problem_description,
            "service_name": predicted_service,
            "issue": issue,
            "complexity": complexity
            }
        ])


        # -------------------------------------------------
        # Predict cost
        # -------------------------------------------------

        predicted_cost = cost_model.predict(
            prediction_input
        )[0]


        # -------------------------------------------------
        # Predict duration
        # -------------------------------------------------

        predicted_duration = duration_model.predict(
            prediction_input
        )[0]


        # -------------------------------------------------
        # Create a simple estimate range
        # -------------------------------------------------

        cost_min = max(100, round(predicted_cost * 0.85 / 50) * 50)
        cost_max = round(predicted_cost * 1.15 / 50) * 50

        duration_min = max(
            15,
            round(predicted_duration * 0.85 / 15) * 15
        )

        duration_max = round(
            predicted_duration * 1.15 / 15
        ) * 15


        # -------------------------------------------------
        # Return prediction
        # -------------------------------------------------

        return jsonify({
            "success": True,
            "service": predicted_service,
            "estimatedCost": f"₹{cost_min} - ₹{cost_max}",
            "estimatedTime": f"{duration_min} - {duration_max} minutes"
        })


    except Exception as error:

        print("Prediction error:", error)

        return jsonify({
            "success": False,
            "message": "Failed to generate prediction"
        }), 500


# =====================================================
# 4. Health check API
# =====================================================

@app.get("/")
def health_check():

    return jsonify({
        "success": True,
        "message": "UrbanService ML API is running"
    })


# =====================================================
# 5. Start Flask server
# =====================================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5001,
        debug=True
    )