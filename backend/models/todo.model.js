const mongoose = require("mongoose");
const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: String,
    status: { type: Boolean, default: false },
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    accessedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Todo", todoSchema);
