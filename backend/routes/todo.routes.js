const express = require("express");
const {
  getTodo,
  addTodo,
  editTodo,
  deleteTodo,
} = require("../controllers/todo.controller");
const router = express.Router();

router.route("/").get(getTodo).post(addTodo);

router.route("/:todoId").get(getTodo).patch(editTodo).delete(deleteTodo);

module.exports = router;
