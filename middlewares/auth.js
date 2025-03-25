// middlewares/auth.js
const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).json({ message: "Unauthorized: Admin access required" });
  }
  next();
};

module.exports = { isAuthenticated, isAdmin };