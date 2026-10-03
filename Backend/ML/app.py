# =====================================================
# Python API for UrbanService ML predictions
# =====================================================

from flask import Flask, request, jsonify
from flask_cors import CORS

import joblib
import os
import pandas as pd
import json


# =====================================================
# 1. Create Flask application
# =====================================================

app = Flask(__name__)
CORS(app)


# =====================================================
# 2. Get base directory
# =====================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


# =====================================================
# 3. Load possible causes knowledge
# =====================================================

CAUSES_FILE = os.path.join(
    BASE_DIR,
    "data",
    "possible_causes.json"
)

with open(CAUSES_FILE, "r", encoding="utf-8") as file:
    possible_causes = json.load(file)


# =====================================================
# 4. Load trained ML models
# =====================================================

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
# 5. Prediction API
# =====================================================

@app.post("/predict")
def predict_service():

    try:

        # -------------------------------------------------
        # Get customer problem
        # -------------------------------------------------

        data = request.get_json()

        problem_description = data.get(
            "problem_description",
            ""
        ).strip()

        if not problem_description:
            return jsonify({
                "success": False,
                "message": "Problem description is required"
            }), 400


        # -------------------------------------------------
        # Predict recommended service
        # ML predicts the service from the problem
        # -------------------------------------------------

        predicted_service = service_model.predict(
            [problem_description]
        )[0]


        # -------------------------------------------------
        # Detect issue from customer problem
        # Used for possible causes and cost/time prediction
        # -------------------------------------------------

        problem_lower = problem_description.lower()

        issue = "General issue"


        # AC / appliance related issues
        if (
            "leak" in problem_lower
            or "water" in problem_lower
        ):
            issue = "Water leakage"

        elif (
            "not cooling" in problem_lower
            or "cooling slowly" in problem_lower
            or "cooling properly" in problem_lower
        ):
            issue = "Weak cooling"

        elif (
            "not turning on" in problem_lower
            or "not starting" in problem_lower
            or "does not start" in problem_lower
        ):
            issue = "Power issue"


        # TV related issues
        elif (
            "no picture" in problem_lower
            or "black screen" in problem_lower
        ):
            issue = "No display"

        elif "no sound" in problem_lower:
            issue = "Audio issue"


        # Washing machine related issues
        elif "not draining" in problem_lower:
            issue = "Drainage problem"


        # Sofa cleaning related issues
        elif "stain" in problem_lower:
            issue = "Stain removal"

        elif "deep cleaning" in problem_lower:
            issue = "Deep cleaning"

        elif (
            "bad smell" in problem_lower
            or "smell" in problem_lower
            or "odor" in problem_lower
        ):
            issue = "Odor removal"


        # Haircut related issues
        elif (
            "haircut" in problem_lower
            or "hair cut" in problem_lower
        ):
            issue = "Hair cutting"


        # -------------------------------------------------
        # Complexity
        # Default value for current prediction version
        # -------------------------------------------------

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
        # Create cost estimate range
        # -------------------------------------------------

        cost_min = max(
            100,
            round(predicted_cost * 0.85 / 50) * 50
        )

        cost_max = round(
            predicted_cost * 1.15 / 50
        ) * 50


        # -------------------------------------------------
        # Create duration estimate range
        # -------------------------------------------------

        duration_min = max(
            15,
            round(predicted_duration * 0.85 / 15) * 15
        )

        duration_max = round(
            predicted_duration * 1.15 / 15
        ) * 15


        # -------------------------------------------------
        # Get possible causes
        # Controlled knowledge layer
        # These are possible causes, not confirmed diagnosis
        # -------------------------------------------------

        service_causes = possible_causes.get(
            predicted_service,
            {}
        )

        causes = (
            service_causes.get(issue.lower())
            or service_causes.get("general")
            or []
        )


        # -------------------------------------------------
        # Return prediction
        # -------------------------------------------------

        return jsonify({

            "success": True,

            "service": predicted_service,

            "possibleCauses": causes,

            "estimatedCost": (
                f"₹{cost_min} - ₹{cost_max}"
            ),

            "estimatedTime": (
                f"{duration_min} - {duration_max} minutes"
            )

        })


    except Exception as error:

        print(
            "Prediction error:",
            error
        )

        return jsonify({
            "success": False,
            "message": "Failed to generate prediction"
        }), 500


# =====================================================
# 6. Health check API
# =====================================================

@app.get("/")
def health_check():

    return jsonify({
        "success": True,
        "message": "UrbanService ML API is running"
    })


# =====================================================
# 7. Start Flask server
# =====================================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5001,
        debug=True
    )