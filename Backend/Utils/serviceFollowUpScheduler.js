const {
  processDueServiceFollowUps,
} = require("../Controllers/ServiceFollowUpController");

// =====================================================
// SERVICE FOLLOW-UP SCHEDULER
// Checks for due follow-ups automatically
// =====================================================

const startServiceFollowUpScheduler = () => {
  // Run once when the server starts
  processDueServiceFollowUps();

  // Check every 1 hour
  setInterval(() => {
    processDueServiceFollowUps();
  }, 60 * 60 * 1000);
};

module.exports = startServiceFollowUpScheduler;