// const User = require("../models/User");
// const twilio = require("twilio");
// const dotenv = require("dotenv");
// dotenv.config();

// // Twilio credentials from environment variables
// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
// const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// // In-memory OTP store (Use Redis/DB in production)
// const otpStore = new Map();

// const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// const sendOTP = async (mobile, otp) => {
//   try {
//     const formattedMobile = mobile.startsWith("+") ? mobile : `+91${mobile}`;
//     await client.messages.create({
//       body: `Your AgriHub OTP is ${otp}`,
//       from: twilioPhoneNumber,
//       to: formattedMobile,
//     });
//     console.log(`OTP ${otp} sent to ${formattedMobile}`);
//   } catch (error) {
//     console.error("Twilio Error:", error.message);
//     console.log(`Fallback OTP for ${mobile}: ${otp}`);
//   }
// };

// const registerUser = async (req, res) => {
//   try {
//     const { firstName, lastName, mobile } = req.body;
//     if (!/^\d{10}$/.test(mobile)) return res.status(400).json({ error: "Invalid mobile number" });
    
//     if (await User.findOne({ mobile })) return res.status(400).json({ error: "Mobile already registered" });
    
//     const otp = generateOTP();
//     otpStore.set(mobile, { otp, data: { firstName, lastName, mobile } });
//     await sendOTP(mobile, otp);
//     res.status(200).json({ message: "OTP sent. Please verify." });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const verifyRegisterOTP = async (req, res) => {
//   try {
//     const { mobile, otp } = req.body;
//     const stored = otpStore.get(mobile);
//     if (!stored || stored.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });
    
//     const { firstName, lastName } = stored.data;
//     const newUser = new User({ firstName, lastName, mobile, isAdmin: false });
//     await newUser.save();
//     otpStore.delete(mobile);
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const loginUser = async (req, res) => {
//   try {
//     const { mobile } = req.body;
//     if (!/^\d{10}$/.test(mobile)) return res.status(400).json({ error: "Invalid mobile number" });
    
//     const user = await User.findOne({ mobile });
//     if (!user) return res.status(401).json({ message: "Mobile not registered" });
    
//     const otp = generateOTP();
//     otpStore.set(mobile, { otp, userId: user._id });
//     await sendOTP(mobile, otp);
//     res.status(200).json({ message: "OTP sent. Please verify." });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const verifyLoginOTP = async (req, res) => {
//   try {
//     const { mobile, otp } = req.body;
//     const stored = otpStore.get(mobile);
//     if (!stored || stored.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });
    
//     const user = await User.findById(stored.userId);
//     if (!user) return res.status(404).json({ message: "User not found" });
    
//     req.session.user = { id: user._id, mobile: user.mobile, isAdmin: user.isAdmin };
//     otpStore.delete(mobile);
//     res.status(200).json({ message: "Login successful", user: req.session.user });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const logoutUser = async (req, res) => {
//   try {
//     req.session.destroy((err) => {
//       if (err) return res.status(500).json({ error: "Logout failed" });
//       res.clearCookie("connect.sid").status(200).json({ message: "Logged out successfully" });
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Logout failed" });
//   }
// };

// const getUserProfile = async (req, res) => {
//   if (!req.session.user) return res.status(401).json({ message: "Unauthorized. Please log in." });
//   try {
//     const user = await User.findById(req.session.user.id);
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const getAllCustomers = async (req, res) => {
//   if (!req.session.user?.isAdmin) return res.status(403).json({ message: "Admin access required" });
//   try {
//     res.status(200).json({ message: "Customers retrieved", customers: await User.find({ isAdmin: false }) });
//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// };

// const deleteCustomer = async (req, res) => {
//   if (!req.session.user?.isAdmin) return res.status(403).json({ message: "Admin access required" });
//   try {
//     const customer = await User.findById(req.params.id);
//     if (!customer) return res.status(404).json({ message: "Customer not found" });
//     if (customer.isAdmin) return res.status(403).json({ message: "Cannot delete admin users" });
//     await User.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Customer deleted" });
//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// };

// module.exports = { registerUser, verifyRegisterOTP, loginUser, verifyLoginOTP, logoutUser, getUserProfile, getAllCustomers, deleteCustomer };
// const User = require("../models/User");
// const twilio = require("twilio");

// // Twilio credentials from environment variables
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
// const client = twilio(accountSid, authToken);

// // In-memory OTP store (replace with Redis/database in production)
// const otpStore = new Map();

// const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
// };

// const sendOTP = async (mobile, otp) => {
//   try {
//     const formattedMobile = mobile.startsWith("+") ? mobile : `+91${mobile}`;
//     await client.messages.create({
//       body: `Your AgriHub OTP is ${otp}`,
//       from: twilioPhoneNumber,
//       to: formattedMobile,
//     });
//     console.log(`OTP ${otp} sent to ${formattedMobile} via Twilio`);
//   } catch (error) {
//     console.error("Twilio SMS failed:", error.message);
//     console.log(`Fallback OTP for ${mobile}: ${otp}`);
//   }
// };

// const registerUser = async (req, res) => {
//   try {
//     const { firstName, lastName, mobile } = req.body;

//     if (!/^\d{10}$/.test(mobile)) {
//       return res.status(400).json({ error: "Mobile number must be 10 digits" });
//     }

//     const existingUser = await User.findOne({ mobile });
//     if (existingUser) {
//       return res.status(400).json({ error: "Mobile number already registered" });
//     }

//     const otp = generateOTP();
//     otpStore.set(mobile, { otp, data: { firstName, lastName, mobile } });
//     await sendOTP(mobile, otp);

//     res.status(200).json({ message: "OTP sent to your mobile. Please verify." });
//   } catch (error) {
//     console.error("Error in registerUser:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const verifyRegisterOTP = async (req, res) => {
//   try {
//     const { mobile, otp } = req.body;

//     const stored = otpStore.get(mobile);
//     if (!stored || stored.otp !== otp) {
//       return res.status(400).json({ error: "Invalid OTP" });
//     }

//     const { firstName, lastName } = stored.data;
//     const newUser = new User({
//       firstName,
//       lastName,
//       mobile,
//       isAdmin: false,
//     });
//     await newUser.save();

//     otpStore.delete(mobile);
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     console.error("Error in verifyRegisterOTP:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const loginUser = async (req, res) => {
//   try {
//     const { mobile } = req.body;

//     if (!/^\d{10}$/.test(mobile)) {
//       return res.status(400).json({ error: "Mobile number must be 10 digits" });
//     }

//     const user = await User.findOne({ mobile });
//     if (!user) {
//       return res.status(401).json({ message: "Mobile number not registered" });
//     }

//     const otp = generateOTP();
//     otpStore.set(mobile, { otp, userId: user._id });
//     await sendOTP(mobile, otp);

//     res.status(200).json({ message: "OTP sent to your mobile. Please verify." });
//   } catch (error) {
//     console.error("Error in loginUser:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const verifyLoginOTP = async (req, res) => {
//   try {
//     const { mobile, otp } = req.body;

//     const stored = otpStore.get(mobile);
//     if (!stored || stored.otp !== otp) {
//       return res.status(400).json({ error: "Invalid OTP" });
//     }

//     const user = await User.findById(stored.userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     req.session.user = { id: user._id, mobile: user.mobile, isAdmin: user.isAdmin };
//     otpStore.delete(mobile);
//     res.status(200).json({ message: "Login successful", user: req.session.user });
//   } catch (error) {
//     console.error("Error in verifyLoginOTP:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const logoutUser = async (req, res) => {
//   try {
//     req.session.destroy((err) => {
//       if (err) {
//         console.error("Session destruction error:", err);
//         return res.status(500).json({ error: "Logout failed" });
//       }
//       res.clearCookie("connect.sid", {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "lax",
//       });
//       res.status(200).json({ message: "Logged out successfully" });
//     });
//   } catch (error) {
//     console.error("Logout error:", error);
//     res.status(500).json({ error: "Logout failed" });
//   }
// };

// const getUserProfile = async (req, res) => {
//   if (!req.session.user) {
//     return res.status(401).json({ message: "Unauthorized. Please log in." });
//   }
//   try {
//     const user = await User.findById(req.session.user.id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     console.error("Error in getUserProfile:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const getUserDetails = (req, res) => {
//   if (!req.session.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   res.json(req.session.user);
// };

// const getAllCustomers = async (req, res) => {
//   try {
//     if (!req.session.user || !req.session.user.isAdmin) {
//       return res.status(403).json({ message: "Unauthorized: Admin access required" });
//     }

//     const customers = await User.find({ isAdmin: false });
//     res.status(200).json({
//       message: "Customers retrieved successfully",
//       customers: customers,
//     });
//   } catch (error) {
//     console.error("Error in getAllCustomers:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// const deleteCustomer = async (req, res) => {
//   try {
//     if (!req.session.user || !req.session.user.isAdmin) {
//       return res.status(403).json({ message: "Unauthorized: Admin access required" });
//     }

//     const customerId = req.params.id;
//     const customer = await User.findById(customerId);

//     if (!customer) {
//       return res.status(404).json({ message: "Customer not found" });
//     }

//     if (customer.isAdmin) {
//       return res.status(403).json({ message: "Cannot delete admin users" });
//     }

//     await User.findByIdAndDelete(customerId);
//     res.status(200).json({ message: "Customer deleted successfully" });
//   } catch (error) {
//     console.error("Error in deleteCustomer:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// module.exports = {
//   registerUser,
//   verifyRegisterOTP,
//   loginUser,
//   verifyLoginOTP,
//   logoutUser,
//   getUserProfile,
//   getUserDetails,
//   getAllCustomers,
//   deleteCustomer,
// };
const User = require("../models/User");
const twilio = require("twilio");

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

// In-memory OTP store (replace with Redis/database in production)
const otpStore = new Map();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

const sendOTP = async (mobile, otp) => {
  try {
    const formattedMobile = mobile.startsWith("+") ? mobile : `+91${mobile}`;
    await client.messages.create({
      body: `Your AgriHub OTP is ${otp}`,
      from: twilioPhoneNumber,
      to: formattedMobile,
    });
    console.log(`OTP ${otp} sent to ${formattedMobile} via Twilio`);
  } catch (error) {
    console.error("Twilio SMS failed:", error.message);
    console.log(`Fallback OTP for ${mobile}: ${otp}`);
  }
};

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, mobile } = req.body;

    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ error: "Mobile number must be 10 digits" });
    }

    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({ error: "Mobile number already registered" });
    }

    const otp = generateOTP();
    otpStore.set(mobile, { otp, data: { firstName, lastName, mobile } });
    await sendOTP(mobile, otp);

    res.status(200).json({ message: "OTP sent to your mobile. Please verify." });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ error: error.message });
  }
};

const verifyRegisterOTP = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    const stored = otpStore.get(mobile);
    if (!stored || stored.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const { firstName, lastName } = stored.data;
    const newUser = new User({
      firstName,
      lastName,
      mobile,
      isAdmin: false,
    });
    await newUser.save();

    otpStore.delete(mobile);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in verifyRegisterOTP:", error);
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ error: "Mobile number must be 10 digits" });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(401).json({ message: "Mobile number not registered" });
    }

    const otp = generateOTP();
    otpStore.set(mobile, { otp, userId: user._id });
    await sendOTP(mobile, otp);

    res.status(200).json({ message: "OTP sent to your mobile. Please verify." });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ error: error.message });
  }
};

const verifyLoginOTP = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    const stored = otpStore.get(mobile);
    if (!stored || stored.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const user = await User.findById(stored.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.session.user = { id: user._id, mobile: user.mobile, isAdmin: user.isAdmin };
    console.log("Session set in verifyLoginOTP:", req.session); // Debug log
    console.log("Session ID:", req.sessionID); // Debug log
    otpStore.delete(mobile);
    res.status(200).json({ message: "Login successful", user: req.session.user });
  } catch (error) {
    console.error("Error in verifyLoginOTP:", error);
    res.status(500).json({ error: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res.status(500).json({ error: "Logout failed" });
      }
      res.clearCookie("connect.sid", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
      });
      res.status(200).json({ message: "Logged out successfully" });
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
};
const getUserProfile = async (req, res) => {
  console.log("getUserProfile session:", req.session); // Debug log
  console.log("getUserProfile session ID:", req.sessionID); // Debug log
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }
  try {
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    res.status(500).json({ error: error.message });
  }
};

const getUserDetails = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.json(req.session.user);
};

const getAllCustomers = async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized: Admin access required" });
    }

    const customers = await User.find({ isAdmin: false });
    res.status(200).json({
      message: "Customers retrieved successfully",
      customers: customers,
    });
  } catch (error) {
    console.error("Error in getAllCustomers:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized: Admin access required" });
    }

    const customerId = req.params.id;
    const customer = await User.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (customer.isAdmin) {
      return res.status(403).json({ message: "Cannot delete admin users" });
    }

    await User.findByIdAndDelete(customerId);
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error in deleteCustomer:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  registerUser,
  verifyRegisterOTP,
  loginUser,
  verifyLoginOTP,
  logoutUser,
  getUserProfile,
  getUserDetails,
  getAllCustomers,
  deleteCustomer,
};