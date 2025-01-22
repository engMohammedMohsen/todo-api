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
const {
  getRecentTodo,
  addRecentTodo,
} = require("../controllers/recentTodo.controller");
const router = express.Router();

router
  .route("/")
  .get(getTodo)
  .post(todoValidator(), validationExecution, addTodo);

router.route("/recent").get(getRecentTodo);
router.route("/recent/:todoId").patch(addRecentTodo);
router
  .route("/:todoId")
  .get(getTodo)
  .patch(todoValidatorUpdate(), validationExecution, editTodo)
  .delete(deleteTodo);

module.exports = router;
