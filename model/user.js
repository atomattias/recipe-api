const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  _recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  email: { type: String, unique: true },
  is_admin: { type: Boolean, default: false },
  password: { type: String },
  token: { type: String },
});

userSchema.methods.deleteToken = async function (token, cb) {
  var user = this;

  await user.updateOne({ $unset: { token: 1 } }, function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

module.exports = mongoose.model("user", userSchema);
