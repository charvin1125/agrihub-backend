// const isAuthenticated = (req, res, next) => {
//   console.log("Checking session:", req.session); // Debugging

//   if (!req.session.user) {
//     return res.status(401).json({ message: "Unauthorized. Please log in." });
//   }
//   req.user = req.session.user; // ✅ Attach user data
//   next();
// };

// const isAdmin = (req, res, next) => {
//   if (!req.session.user || !req.session.user.isAdmin) {
//       return res.status(403).json({ message: "Access denied. Admins only." });
//   }
//   next();
// };

// module.exports = { isAuthenticated, isAdmin };
const isAuthenticated = (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log("Checking session:", req.session); // Debugging
  }

  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }
  req.user = req.session.user; // Attach user data to req.user
  next();
};

const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

module.exports = { isAuthenticated, isAdmin };
