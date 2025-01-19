require("dotenv").config();
const mongoose = require("mongoose");
const Todo = require("../models/todo.model");
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("mongodb server started...");
});
const addRecentField = async () => {
  try {
    await Todo.updateMany(
      {}, // Find documents where `accessDate` is missing
      [
        { $set: { accessedAt: "$updatedAt" } }, // Use the value of `updatedAt` for `accessDate`
      ]
    ).then(() => console.log("Add accessedAT field"));
    await mongoose.connection.close();
  } catch (error) {
    console.error("Error removing 'todo' field:", error);
    mongoose.connection.close();
  }
};

addRecentField();
