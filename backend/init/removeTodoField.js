require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user.model");
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("mongodb server started...");
});
const removeTodoField = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL).then(() => {
      console.log("Connected to MongoDB...");
    });

    await User.updateMany({}, { $unset: { todo: "" } }).then(() =>
      console.log("Removed 'todo' field from all users")
    );
    await mongoose.connection.close();
  } catch (error) {
    console.error("Error removing 'todo' field:", error);
    mongoose.connection.close();
  }
};

removeTodoField();
