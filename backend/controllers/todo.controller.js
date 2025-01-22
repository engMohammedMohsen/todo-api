const asyncWrapper = require("../middlewares/asyncWrapper");
const Todo = require("../models/todo.model");
const User = require("../models/user.model");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const userRoles = require("../utils/userRoles");

const getTodo = asyncWrapper(async (req, res, next) => {
  const { todoId } = req.params;
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const userId = req.currentUser.id;
  const user = await User.findById(userId);
  if (!user) {
    const error = appError.create(
      `invalid user ID ${userId}`,
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const todo = await Todo.find(todoId ? { _id: todoId } : { user: userId }, {
    __v: false,
    user: false,
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
  if (todo) {
    return res.json({ status: httpStatusText.SUCCESS, data: todo });
  }
  return next(appError.create("Not found trip", 404, httpStatusText.ERROR));
});

const addTodo = asyncWrapper(async (req, res, next) => {
  const userId = req.currentUser.id;
  const user = await User.findById(userId);
  if (!user) {
    const error = appError.create(
      `invalid user ID ${userId}`,
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const { title, description, status } = req.body;
  const newTodo = new Todo({
    title,
    description,
    status,
    user: userId,
    accessedAt: new Date(),
  });

  await newTodo.save();

  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { todo: newTodo } });
});

const editTodo = asyncWrapper(async (req, res, next) => {
  const { todoId } = req.params;
  const todo = await Todo.findByIdAndUpdate(
    todoId,
    { $set: { ...req.body, accessedAt: new Date() } },
    { new: true }
  );
  if (todo) {
    return res
      .status(200)
      .json({ status: httpStatusText.SUCCESS, data: { todo } });
  } else {
    return next(appError.create("Not Found todo", 404, httpStatusText.ERROR));
  }
});

const deleteTodo = asyncWrapper(async (req, res, next) => {
  const { todoId } = req.params;
  const userId = req.currentUser.id;
  const user = await User.findById(userId);
  if (!user) {
    const error = appError.create(
      `invalid user ID <${userId}>`,
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }
  await Todo.deleteOne({ _id: todoId });
  return res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});

module.exports = {
  getTodo,
  addTodo,
  editTodo,
  deleteTodo,
};
