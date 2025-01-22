const express = require("express");
const cors = require("cors");
const httpStatusText = require("./utils/httpStatusText");
const mongoose = require("mongoose");
const usersRouter = require("./routes/users.routes");
const todosRouter = require("./routes/todo.routes");
const path = require("node:path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const verifyToken = require("./middlewares/verifyToken");
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("mongodb server started...");
});

const app = express();
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(cors());
const buildPath = path.normalize(
  path.join(__dirname, "../frontend/todoUi/dist")
);
app.use(express.static(buildPath));
app.use(express.json());
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/todos", verifyToken, todosRouter);

app.all("*", (req, res, next) => {
  return res.status(404).json({
    status: httpStatusText.ERROR,
    message: "this resource is not available",
  });
});
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error?.statusText || httpStatusText.ERROR,
    message: error?.message,
    code: error?.statusCode || 500,
    data: null,
  });
});

app.listen(3000, () => {
  console.log("starting app...");
});
