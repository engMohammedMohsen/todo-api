const asyncWrapper = require("../middlewares/asyncWrapper");
const Todo = require("../models/todo.model");
const User = require("../models/user.model");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const userRoles = require("../utils/userRoles");

const getTodo = asyncWrapper(async (req, res, next) => {
  const { todoId } = req.params;
  const query = req.query;
  const limit = query.limit;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const order = query.order || -1;
  let sort = query.sort || "add";
  const days = query.days;
  const time = new Date(); // Current date and time
  time.setDate(time.getDate() - days); // Subtract n days
  time.setHours(0, 0, 0, 0); // Set time to 00:00:00
  switch (sort) {
    case "add":
      sort = "createdAt";
      break;
    case "update":
      sort = "updatedAt";
      break;
    case "access":
      sort = "accessedAt";
      break;
    default:
      sort = "createdAt";
      break;
  }

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
  const filter = { user: userId };

  filter[sort] = { $gte: days ? time : 0 };
  const todo = await Todo.find(todoId ? { _id: todoId } : filter, {
    __v: false,
    user: false,
  })
    .sort({ sort: order })
    .limit(limit)
    .skip(skip);
  if (todo) {
    let tasks = 0,
      complete = 0;
    await todo.forEach((ele) => {
      tasks++;
      if (ele.status) {
        complete++;
      }
    });
    return res.json({
      status: httpStatusText.SUCCESS,
      data: { todos: todo, status: { tasks, complete } },
    });
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
  if (todoId) {
    await Todo.deleteOne({ _id: todoId });
  } else {
    await Todo.deleteMany({ user: userId });
  }
  return res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});

module.exports = {
  getTodo,
  addTodo,
  editTodo,
  deleteTodo,
};
