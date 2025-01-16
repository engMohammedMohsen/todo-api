const mongoose = require("mongoose");
const validator = require("validator");
const userRoles = require("../utils/userRoles");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: { type: String, default: "" },
    mobile: String,
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "filed must be a valid email address"],
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: [userRoles.USER, userRoles.ADMIN, userRoles.MANGER],
    },
  },
  { timestamps: true }
);

userSchema.virtual("fullName").get(() => {
  return this.firstName + " " + this.lastName;
});

module.exports = mongoose.model("User", userSchema);
