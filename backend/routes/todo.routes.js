const express = require("express");
const {
  getTodo,
  addTodo,
  editTodo,
  deleteTodo,
} = require("../controllers/todo.controller");

const validationExecution = require("../middlewares/validationExecution");
const { todoValidator } = require("../utils/validator/addTodoValidator");
const router = express.Router();

router
  .route("/")
  .get(getTodo)
  .post(todoValidator(), validationExecution, addTodo);

router
  .route("/:todoId")
  .get(getTodo)
  .patch(todoValidator(), validationExecution, editTodo)
  .delete(deleteTodo);

module.exports = router;
