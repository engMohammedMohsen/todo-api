const asyncWrapper = require("../middlewares/asyncWrapper");
const Todo = require("../models/todo.model");
const User = require("../models/user.model");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const userRoles = require("../utils/userRoles");

const getRecentTodo = asyncWrapper(async (req, res, next) => {
  const { query } = req;
  const limit = query.limit;
  const days = query.days;
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
  const time = new Date(); // Current date and time
  time.setDate(time.getDate() - days); // Subtract n days
  time.setHours(0, 0, 0, 0); // Set time to 00:00:00

  const todo = await Todo.find(
    { user: userId, accessedAt: { $gte: days ? time : 0 } },
    {
      __v: false,
      user: false,
    }
  )
    .sort({ accessedAt: -1 })
    .limit(limit);
  if (todo) {
    return res.json({
      status: httpStatusText.SUCCESS,
      data: todo,
    });
  }
  return next(appError.create("Not found todo", 404, httpStatusText.ERROR));
});

const addRecentTodo = asyncWrapper(async (req, res, next) => {
  const { todoId } = req.params;
  const todo = await Todo.findByIdAndUpdate(
    todoId,
    { $set: { accessedAt: new Date() } },
    { new: true }
  ).select({ __v: false });
  if (todo) {
    return res
      .status(200)
      .json({ status: httpStatusText.SUCCESS, data: { todo } });
  } else {
    return next(appError.create("Not Found todo", 404, httpStatusText.ERROR));
  }
});

module.exports = {
  getRecentTodo,
  addRecentTodo,
};
