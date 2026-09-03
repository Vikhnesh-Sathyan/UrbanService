const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user comes from authMiddleware
    if (!req.user) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    // Check whether user's role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You are not authorized to perform this action",
      });
    }

    next();
  };
};

module.exports = roleMiddleware;