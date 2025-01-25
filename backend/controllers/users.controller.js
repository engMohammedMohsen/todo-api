const asyncWrapper = require("../middlewares/asyncWrapper");
const User = require("../models/user.model");
const Todo = require("../models/todo.model");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const generateJWT = require("../utils/generateJWT");
const userRoles = require("../utils/userRoles");
const fs = require("node:fs");
const path = require("node:path");

/*********************************************************/

const getUser = asyncWrapper(async (req, res, next) => {
  const { userId } = req.params;
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const users = await User.find(userId ? { _id: userId } : {}, {
    __v: false,
    password: false,
  })
    .limit(limit)
    .skip(skip);
  if (users) {
    return res.json({ status: httpStatusText.SUCCESS, data: { users } });
  }
  return next(appError.create("User not found", 404, httpStatusText.ERROR));
});

const register = asyncWrapper(async (req, res, next) => {
  console.log("start user register");
  console.log("start add new user:\n", req.body);

  const { firstName, lastName, email, password, mobile } = req.body;

  const oldUser = await User.findOne({ email: email });

  if (oldUser) {
    const error = appError.create(
      "user already exists",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  // password hashing
  const hashedPassword = await bcrypt.hash(String(password), 10);
  role = userRoles.USER;
  const newUser = new User({
    firstName,
    lastName,
    email,
    mobile,
    password: hashedPassword,
    role,
  });

  // generate JWT token
  const token = await generateJWT({
    email: newUser.email,
    id: newUser._id,
    role,
  });
  newUser.token = token;

  await newUser.save();

  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { user: newUser } });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && !password) {
    const error = appError.create(
      "email and password are required",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    const error = appError.create("user not found", 400, httpStatusText.FAIL);
    return next(error);
  }

  const matchedPassword = await bcrypt.compare(String(password), user.password);
  const role = user.role;
  if (user && matchedPassword) {
    const token = await generateJWT({ email: user.email, id: user._id, role });
    return res.json({
      status: httpStatusText.SUCCESS,
      data: {
        token,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.firstName,
          fullName: user.fullName,
          email: user.email,
          mobile: user.mobile,
          avatar: user.avatar,
        },
      },
    });
  } else {
    const error = appError.create(
      "invalid password",
      500,
      httpStatusText.ERROR
    );
    return next(error);
  }
});

const editUser = asyncWrapper(async (req, res, next) => {
  const userId = req.currentUser.id;
  const { body } = req;
  if (body.password) {
    return appError.create("change password not valid");
  }
  const newAvatar = req.file?.path;
  const oldAvatar = (await User.findById(userId)).avatar;
  try {
    if (oldAvatar && newAvatar && fs.existsSync(oldAvatar)) {
      console.log("deleted...");
      fs.unlinkSync(path.join(oldAvatar));
      console.log("deleted Done");
    }
  } catch (err) {
    console.log(err);
  }
  const avatar = newAvatar || oldAvatar;
  const user = await User.findByIdAndUpdate(
    userId,
    {
      ...body,
      avatar,
    },
    { new: true }
  ).select({ __v: false });
  res.status(200).json({ status: "Success", data: { user } });
});

const changePassword = asyncWrapper(async (req, res, next) => {
  const userId = req.currentUser.id;
  const { newPassword } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      password: await bcrypt.hash(String(newPassword), 10),
    },
    { new: true }
  ).select({ __v: false });
  res.status(200).json({ status: "Success", data: { user } });
});

const deleteUser = asyncWrapper(async (req, res, next) => {
  const userId = req.currentUser.id;
  const user = await User.findById(userId);
  if (user) {
    const avatar = user.avatar;
    if (avatar && fs.existsSync(avatar)) {
      console.log("deleted avatar...");
      fs.unlinkSync(path.join(avatar));
      console.log("deleted Done");
    }
    await Todo.deleteMany({ user: userId });
    await User.deleteOne({ _id: userId });
    return res.status(200).json({ status: "Success", data: null });
  } else {
    next(appError.create("invalid user id", 500, httpStatusText.FAIL));
  }
});

module.exports = {
  getUser,
  register,
  login,
  editUser,
  changePassword,
  deleteUser,
};
