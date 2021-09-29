const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  category: {
    type: String,
    enum: ["breakfast", "lunch", "dinner", ""],
    default: "breakfast",
  },
  description: { type: String, default: null, required: true },
  likes: { type: Number, default: 0 },
  spices: { type: [String], default: [] },
  ingredients: { type: [String], default: [] },
  images: { type: [String], default: [] },
});

module.exports = mongoose.model("Recipe", recipeSchema);
