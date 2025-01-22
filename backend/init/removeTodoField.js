require("dotenv").config({ path: __dirname + "\\..\\.env" });
const mongoose = require("mongoose");
const User = require("../models/user.model");
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("mongodb server started...");
});
const removeTodoField = async () => {
  try {
    await User.updateMany({}, { $unset: { todo: "" } }, { strict: false }).then(
      () => console.log("Removed 'todo' field from all users")
    );
    await mongoose.connection.close();
  } catch (error) {
    console.error("Error removing 'todo' field:", error);
    mongoose.connection.close();
  }
};

removeTodoField();
