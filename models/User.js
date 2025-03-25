// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   mobile: { type: String, required: true, unique: true },
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   securityQuestion: { type: String, required: true },
//   securityAnswer: { type: String, required: true },
//   isAdmin: { type: Boolean, default: false },
//   // wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
// });

// module.exports = mongoose.model("User", userSchema);
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  isAdmin: { type: Boolean, default: false },
  // wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

module.exports = mongoose.model("User", userSchema);