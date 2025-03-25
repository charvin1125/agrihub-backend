// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const session = require("express-session");
// const MongoStore = require("connect-mongo");
// const path = require("path");
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
// const laborRoutes = require('./routes/laborRoutes');


// const app = express();
// const PORT = process.env.PORT || 5000;
// const MONGO_URI = "mongodb+srv://charvin:jxgrmv4zZTUUnfuP@ai.nw0f5ek.mongodb.net/agrihubdata";

// // Middleware
// app.use(cors({
//    origin: "http://localhost:3000", 
//    credentials: true 
// }));
// app.use(bodyParser.json());
// app.use(express.json());


// app.use(session({
//   secret: "charvin1121",
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({ mongoUrl: MONGO_URI }),
//   cookie: { 
//     secure: false, 
//     httpOnly: true, 
//     sameSite: "lax",
//     maxAge: 24 * 60 * 60 * 1000, 
//   },
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
// app.use("/api/services",serviceRoutes);// ✅ New route for d
// app.use("/api/bookings",bookingRoutes);
// app.use('/api/review', reviewRoutes);
// app.use('/api/labor', laborRoutes);
// // app.use('/api', chatRoutes);
// // app.use("/api", cropPlanRoutes);
// app.get("/", (req, res) => {
//   res.send("🚀 Backend API is running...");
// });
// // ashboard analytics
// app.get("/api/check-session", (req, res) => {
//   console.log("🔍 Session data:", req.session);
//   res.json({ sessionData: req.session });
// });
// // Connect to MongoDB and start server
// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//   })
//   .catch((error) => console.log("❌ MongoDB Connection Error:", error.message));
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config(); // Load environment variables from .env

const userRoutes = require("./routes/userRoutes");
const vendorRoutes = require("./routes/vendor");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/category");
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const laborRoutes = require("./routes/laborRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://charvin:jxgrmv4zZTUUnfuP@ai.nw0f5ek.mongodb.net/agrihubdata"; // Use env or fallback
const FRONTEND_URL = process.env.FRONTEND_URL || "https://agrihub-frontend.onrender.com"; // Use env or fallback

// Middleware
app.use(
  cors({
    origin: FRONTEND_URL, // Allow requests from the deployed frontend
    credentials: true, // Support cookies/sessions
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly allow methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
  })
);
app.use(bodyParser.json());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "charvin1121", // Use env or fallback
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URI }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // Secure in production
      httpOnly: true,
      sameSite: "lax", // Adjust to "none" if cross-origin issues persist
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/product", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/bills", require("./routes/billRoutes"));
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/labors", require("./routes/laborRoutes"));
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/labor", laborRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Backend API is running...");
});

app.get("/api/check-session", (req, res) => {
  console.log("🔍 Session data:", req.session);
  res.json({ sessionData: req.session });
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => console.log("❌ MongoDB Connection Error:", error.message));