const express = require("express");
const {
  getTodo,
  addTodo,
  editTodo,
  deleteTodo,
} = require("../controllers/todo.controller");

const validationExecution = require("../middlewares/validationExecution");
const { todoValidator } = require("../utils/validator/todoValidator");
const {
  getRecentTodo,
  addRecentTodo,
} = require("../controllers/recentTodo.controller");
const router = express.Router();

router
  .route("/")
  .get(getTodo)
  .post(todoValidator(), validationExecution, addTodo);

router.route("/recent").get(getRecentTodo).patch(addRecentTodo);
router.route("/recent/:todoId").patch(addRecentTodo);
router
  .route("/:todoId")
  .get(getTodo)
  .patch(todoValidator(), validationExecution, editTodo)
  .delete(deleteTodo);

module.exports = router;
