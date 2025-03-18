// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const session = require("express-session");
// const bodyParser = require("body-parser");
// const userRoutes = require("./routes/userRoutes");
// const vendorRoutes = require("./routes/vendor");
// const productRoutes = require("./routes/productRoutes");
// const categoryRoutes = require("./routes/category");
// const orderRoutes = require("./routes/orderRoutes");
// const dashboardRoutes = require("./routes/dashboardRoutes");
// const serviceRoutes = require("./routes/serviceRoutes");
// const bookingRoutes = require("./routes/bookingRoutes");
// const reviewRoutes = require('./routes/reviewRoutes');
// const laborRoutes = require('./routes/laborRoutes')
// // const chatRoutes = require('./routes/chatRoutes');
// // const cropPlanRoutes = require("./routes/cropPlanRoutes");
// // ✅ Add this

// // Routes


// const path = require("path");

// const app = express();
// const PORT = process.env.PORT || 5000;
// const MONGO_URI = "mongodb://localhost:27017/ai";

// // Middleware
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// app.use(bodyParser.json());
// app.use(express.json());
// app.use(session({
//   secret: "charvin1121",
//   resave: false,
//   saveUninitialized: false,
//   cookie: { secure: false, httpOnly: true, sameSite: "lax",maxAge: 24 * 60 * 60 * 1000, },
// }));
// app.use(cors({
//   origin: "http://localhost:3000", // ✅ Must match frontend
//   credentials: true, // ✅ Allows session cookies
// }));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Routes
// // app.use(cors({ origin: "http://localhost:5000", credentials: true }));
// app.use("/api/users", userRoutes);
// app.use("/api/vendor", vendorRoutes);
// app.use("/api/product", productRoutes);
// app.use("/api/category", categoryRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/bills", require("./routes/billRoutes"));
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/labors", require("./routes/laborRoutes"));
// app.use("/api", require("./routes/bookingRoutes"));
// app.use("/api/services",serviceRoutes);// ✅ New route for d
// app.use("/api/bookings",bookingRoutes);
// app.use('/api/review', reviewRoutes);
// app.use('/api/labor', laborRoutes);
// // app.use('/api', chatRoutes);
// // app.use("/api", cropPlanRoutes);

// // ashboard analytics
// app.get("/api/check-session", (req, res) => {
//   console.log("🔍 Session data:", req.session);
//   res.json({ sessionData: req.session });
// });
// // Connect to MongoDB and start server
// mongoose
//   .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch((error) => console.log(error.message));
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const session = require("express-session");
// const bodyParser = require("body-parser");
// const path = require("path");
//  // To use .env variables

// const userRoutes = require("./routes/userRoutes");
// const vendorRoutes = require("./routes/vendor");
// const productRoutes = require("./routes/productRoutes");
// const categoryRoutes = require("./routes/category");
// const orderRoutes = require("./routes/orderRoutes");
// const dashboardRoutes = require("./routes/dashboardRoutes");
// const serviceRoutes = require("./routes/serviceRoutes");
// const bookingRoutes = require("./routes/bookingRoutes");
// const reviewRoutes = require('./routes/reviewRoutes');
// const laborRoutes = require('./routes/laborRoutes');

// const app = express();
// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://charvin:jxgrmv4zZTUUnfuP@ai.nw0f5ek.mongodb.net/agrihubdata"; // Use env variable

// // Middleware
// app.use(cors({
//   origin: process.env.CLIENT_URL || "http://localhost:3000", // Set this in .env for Render
//   credentials: true
// }));

// app.use(bodyParser.json());
// app.use(express.json());

// app.use(session({
//   secret: process.env.SESSION_SECRET || "charvin1121",
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: process.env.NODE_ENV === "production", // Set secure true in production
//     httpOnly: true,
//     sameSite: "lax",
//     maxAge: 24 * 60 * 60 * 1000,
//   },
// }));

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Routes
// app.use("/api/users", userRoutes);
// app.use("/api/vendor", vendorRoutes);
// app.use("/api/product", productRoutes);
// app.use("/api/category", categoryRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/bills", require("./routes/billRoutes"));
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/labors", require("./routes/laborRoutes"));
// app.use("/api", require("./routes/bookingRoutes"));
// app.use("/api/services", serviceRoutes);
// app.use("/api/bookings", bookingRoutes);
// app.use('/api/review', reviewRoutes);
// app.use('/api/labor', laborRoutes);

// // Session check route (optional)
// app.get("/api/check-session", (req, res) => {
//   console.log("🔍 Session data:", req.session);
//   res.json({ sessionData: req.session });
// });

// // === Serve frontend in production ===
// if (process.env.NODE_ENV === "production") {
//   const buildPath = path.join(__dirname, "client", "build");
//   app.use(express.static(buildPath));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(buildPath, "index.html"));
//   });
// }

// // Connect to MongoDB and start server
// mongoose
//   .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//   })
//   .catch((error) => console.log("❌ MongoDB Connection Error:", error.message));
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
// require("dotenv").config(); // Load environment variables

// Routes
const userRoutes = require("./routes/userRoutes");
const vendorRoutes = require("./routes/vendor");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/category");
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require('./routes/reviewRoutes');
const laborRoutes = require('./routes/laborRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://charvin:jxgrmv4zZTUUnfuP@ai.nw0f5ek.mongodb.net/agrihubdata";

// Middleware
// app.use(cors({
//   origin: process.env.CLIENT_URL || "http://localhost:3000",
//   credentials: true,
// }));
app.use(cors({
  origin: "https://agrihub-frontend.onrender.com", // Your deployed frontend URL
  credentials: true,
}));

app.use(bodyParser.json());
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || "charvin1121",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/product", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/bills", require("./routes/billRoutes"));
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/labors", laborRoutes);
app.use("/api", bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/labor", laborRoutes);

// ✅ Root route response
app.get("/", (req, res) => {
  res.send("🚀 Backend API is running...");
});

// ✅ Session check route (optional)
app.get("/api/check-session", (req, res) => {
  console.log("🔍 Session data:", req.session);
  res.json({ sessionData: req.session });
});

// MongoDB Connection & Server Start
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => console.log("❌ MongoDB Connection Error:", error.message));
