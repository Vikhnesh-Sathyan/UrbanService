import React, { useState } from "react";
import { predictService } from "../../../Services/mlService";
import { useNavigate } from "react-router-dom";

import "../../../styles/SmartServiceAssistant.css";

// =====================================================
// SMART SERVICE ASSISTANT
// Customer enters a problem and gets an ML prediction
// =====================================================

const SmartServiceAssistant = () => {
    const navigate = useNavigate();
  const [problem, setProblem] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // Analyze customer problem
  // =====================================================

  const handleAnalyze = async () => {
    if (!problem.trim()) {
      setError("Please describe your problem.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setPrediction(null);

      const result = await predictService(problem);

      if (result.success) {
        setPrediction(result);
      } else {
        setError(
          result.message || "Unable to analyze problem."
        );
      }
    } catch (error) {
      console.error(
        "Smart assistant error:",
        error
      );

      setError(
        "Unable to connect to Smart Service Assistant."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="smart-assistant-page">

      {/* =================================================
          HEADER
          ================================================= */}

      <div className="smart-assistant-header">

        <span className="smart-assistant-badge">
          🧠 SMART SERVICE ASSISTANT
        </span>

        <h1>
          Tell us what problem you're facing
        </h1>

        <p>
          Describe your problem in simple words and we'll
          recommend a suitable service.
        </p>

      </div>


      {/* =================================================
          PROBLEM INPUT
          ================================================= */}

      <div className="smart-assistant-card">

        <label>
          Describe your problem
        </label>

        <textarea
          value={problem}
          onChange={(e) =>
            setProblem(e.target.value)
          }
          placeholder="Example: My AC is running but not cooling and water is leaking..."
          rows="6"
        />

        {error && (
          <p className="smart-assistant-error">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading
            ? "Analyzing..."
            : "Analyze Problem"}
        </button>

      </div>


      {/* =================================================
          AI RESULT
          ================================================= */}

      {prediction && (

        <div className="smart-result-card">

          {/* Result heading */}

          <div className="result-heading">

            <span>🧠</span>

            <div>
              <h2>
                We analyzed your problem
              </h2>

              <p>
                Here is an estimated recommendation.
              </p>
            </div>

          </div>


          {/* Recommended service */}

          <div className="result-item">

            <span>
              🎯 Recommended Service
            </span>

            <strong>
              {prediction.service}
            </strong>

          </div>


          {/* =================================================
              POSSIBLE CAUSES
              ================================================= */}

          {prediction.possibleCauses?.length > 0 && (

            <div className="possible-causes-section">

              <div className="possible-causes-heading">

                <span>🔍</span>

                <div>
                  <h3>
                    Possible Causes
                  </h3>

                  <p>
                    These are possible causes based on
                    the problem description.
                  </p>
                </div>

              </div>


              <div className="possible-causes-list">

                {prediction.possibleCauses.map(
                  (cause, index) => (

                    <div
                      className="possible-cause-item"
                      key={index}
                    >

                      <span>•</span>

                      <p>
                        {cause}
                      </p>

                    </div>

                  )
                )}

              </div>

            </div>

          )}


          {/* Estimated cost */}

          <div className="result-item">

            <span>
              💰 Estimated Cost
            </span>

            <strong>
              {prediction.estimatedCost}
            </strong>

          </div>


          {/* Estimated duration */}

          <div className="result-item">

            <span>
              ⏱️ Estimated Time
            </span>

            <strong>
              {prediction.estimatedTime}
            </strong>

          </div>


          {/* Disclaimer */}

          <div className="estimate-note">

            ⚠️ Estimate only. Final cost and duration may
            vary after provider inspection.

          </div>

          {/* =================================================
    BOOK SERVICE
    ================================================= */}

<button
  type="button"
  className="smart-book-service-button"
  onClick={() => {
    navigate("/user/services", {
      state: {
        recommendedService: prediction.service,
      },
    });
  }}
>
  🏠 Book This Service
  <span>→</span>
</button>

        </div>

      )}

    </div>
  );
};

export default SmartServiceAssistant;