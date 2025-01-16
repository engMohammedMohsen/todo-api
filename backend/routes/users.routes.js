const express = require("express");
const path = require("node:path");
const multer = require("multer");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const {
  login,
  register,
  getUser,
  editUser,
  changePassword,
} = require("../controllers/users.controller");
const validationExecution = require("../middlewares/validationExecution");
const { validationUserSchema } = require("../utils/validator/userValidator");
const {
  validationUserChangePassword,
} = require("../utils/validator/userValidatorChangePassword");

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join("public", "users"));
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0];

  if (imageType === "image") {
    return cb(null, true);
  } else {
    return cb(appError.create("file must be an image", 400), false);
  }
};

const upload = multer({
  storage: diskStorage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

router
  .route("/sign-up")
  .post(validationUserSchema(), validationExecution, register);
router.route("/sign-in").post(login);
router
  .route("/reset-password")
  .patch(
    verifyToken,
    validationUserChangePassword(),
    validationExecution,
    changePassword
  );

router
  .route("/")
  .get(verifyToken, getUser)
  .patch(verifyToken, upload.single("avatar"), editUser);
router.route("/:userId").get(verifyToken, getUser);

module.exports = router;
