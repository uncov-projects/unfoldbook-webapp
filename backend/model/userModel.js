const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    auth0Id: { type: String, required: true, unique: true }, // Auth0 user ID (e.g. "auth0|65f9a2...")
    name: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true },
    picture: { type: String },
    role: { type: String, default: "user" }, // optional: admin, user, etc.
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
