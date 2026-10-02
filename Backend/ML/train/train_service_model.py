# =====================================================
# Train ML model to predict the recommended service
# from the customer's problem description
# =====================================================

import pandas as pd
import joblib

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score


# =====================================================
# 1. Load training dataset
# =====================================================

data = pd.read_csv("../data/service_training_data.csv")


# =====================================================
# 2. Separate input and target
# =====================================================

X = data["problem_description"]
y = data["service_name"]


# =====================================================
# 3. Split dataset into training and testing data
# =====================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# =====================================================
# 4. Create text classification pipeline
# =====================================================

model = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("classifier", LogisticRegression(max_iter=1000))
])


# =====================================================
# 5. Train the model
# =====================================================

model.fit(X_train, y_train)


# =====================================================
# 6. Test model accuracy
# =====================================================

predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print(f"Model Accuracy: {accuracy:.2f}")


# =====================================================
# 7. Save trained model
# =====================================================

joblib.dump(
    model,
    "../models/service_model.pkl"
)

print("Service model saved successfully.")