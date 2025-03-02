const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");


// exports.registerUser = async (req, res) => {
//     try {
//         const { firstName, lastName, email, mobile } = req.body;
//         const username = `CUST-${uuidv4().slice(0, 8).toUpperCase()}`;
//         const password = mobile;

//         const newUser = new User({ firstName, lastName, email, mobile, username, password, isAdmin: false });
//         await newUser.save();

//         res.status(201).json({ message: "User registered successfully", username });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, mobile, securityQuestion, securityAnswer } = req.body;

    // Generate username and use mobile as password
    const username = `CUST-${uuidv4().slice(0, 8).toUpperCase()}`;
    const password = mobile;

    const newUser = new User({
      firstName,
      lastName,
      mobile,
      username,
      password,
      securityQuestion,
      securityAnswer,
      isAdmin: false,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        req.session.user = { id: user._id, username: user.username, isAdmin: user.isAdmin };
        res.status(200).json({ message: "Login successful", user: req.session.user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// exports.logoutUser = (req, res) => {
//   req.session.destroy((err) => {
//       if (err) {
//           return res.status(500).json({ message: "Logout failed" });
//       }
//       res.clearCookie("connect.sid"); // Clear session cookie
//       res.status(200).json({ message: "Logged out successfully" });
//   });
// };
// exports.logoutUser = async (req, res) => {
//   try {
//     // Clear session or token logic here (if applicable)
//     res.clearCookie("connect.sid"); // Example for session-based auth
//     res.status(200).json({ message: "Logged out successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Logout failed" });
//   }
// };

exports.logoutUser = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res.status(500).json({ error: "Logout failed" });
      }
      res.clearCookie("connect.sid", {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS in production
        sameSite: "lax",
      });
      res.status(200).json({ message: "Logged out successfully" });
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
};

exports.getUserProfile = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }
    try {
        const user = await User.findById(req.session.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getUserDetails = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.json(req.session.user);
};
exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
      const user = await User.findById(req.user._id); // Assuming user is set by auth middleware
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Verify current password (plain text comparison)
      if (currentPassword !== user.password) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
  
      // Update password directly
      user.password = newPassword;
      await user.save();
  
      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  exports.forgotPassword = async (req, res) => {
    const { mobile, securityQuestion, securityAnswer, newPassword } = req.body;
  
    try {
      const user = await User.findOne({ mobile });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      if (
        user.securityQuestion !== securityQuestion ||
        user.securityAnswer !== securityAnswer
      ) {
        return res.status(400).json({ error: "Incorrect security question or answer" });
      }
  
      // Update password (assuming plain text for now as per your setup)
      user.password = newPassword;
      await user.save();
  
      res.json({ message: "Password reset successful! Please login with your new password." });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };