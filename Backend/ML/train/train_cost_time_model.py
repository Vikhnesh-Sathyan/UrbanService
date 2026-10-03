# =====================================================
# Train ML models to predict service cost and duration
# =====================================================

import pandas as pd
import joblib

from sklearn.compose import ColumnTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor


# =====================================================
# 1. Load training dataset
# =====================================================

data = pd.read_csv("../data/service_training_data.csv")


# =====================================================
# 2. Define input features
# =====================================================

X = data[
    [
        "problem_description",
        "service_name",
        "issue",
        "complexity",
    ]
]


# =====================================================
# 3. Define prediction targets
# =====================================================

y_cost = data["actual_cost"]

y_duration = data["actual_duration_minutes"]


# =====================================================
# 4. Prepare text and categorical features
# =====================================================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "problem_text",
            TfidfVectorizer(),
            "problem_description",
        ),
        (
            "categorical_features",
            OneHotEncoder(handle_unknown="ignore"),
            [
                "service_name",
                "issue",
                "complexity",
            ],
        ),
    ]
)


# =====================================================
# 5. Create cost prediction model
# =====================================================

cost_model = Pipeline(
    [
        ("preprocessor", preprocessor),
        (
            "regressor",
            RandomForestRegressor(
                n_estimators=100,
                random_state=42,
            ),
        ),
    ]
)


# =====================================================
# 6. Train cost model
# =====================================================

cost_model.fit(X, y_cost)


# =====================================================
# 7. Create duration prediction model
# =====================================================

duration_model = Pipeline(
    [
        ("preprocessor", preprocessor),
        (
            "regressor",
            RandomForestRegressor(
                n_estimators=100,
                random_state=42,
            ),
        ),
    ]
)


# =====================================================
# 8. Train duration model
# =====================================================

duration_model.fit(X, y_duration)


# =====================================================
# 9. Save trained models
# =====================================================

joblib.dump(
    cost_model,
    "../models/cost_model.pkl",
)

joblib.dump(
    duration_model,
    "../models/duration_model.pkl",
)


print("Cost model saved successfully.")
print("Duration model saved successfully.")