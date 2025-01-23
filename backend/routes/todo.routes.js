const express = require("express");
const {
  getTodo,
  addTodo,
  editTodo,
  deleteTodo,
} = require("../controllers/todo.controller");

const validationExecution = require("../middlewares/validationExecution");
const { todoValidator } = require("../validator/todoValidator");
const { todoValidatorUpdate } = require("../validator/todoValidatorUpdate");
const router = express.Router();
router
  .route("/:todoId?")
  .post(todoValidator(), validationExecution, addTodo)
  .get(getTodo)
  .patch(todoValidatorUpdate(), validationExecution, editTodo)
  .delete(deleteTodo);

module.exports = router;
