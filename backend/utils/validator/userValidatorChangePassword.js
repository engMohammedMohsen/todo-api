const { body } = require("express-validator");

const validationUserChangePassword = () => {
  return [
    body("newPassword")
      .notEmpty()
      .withMessage("password is required")
      .isLength({ min: 8 })
      .withMessage("password must be al least 8 character")
      .isLength({ max: 80 })
      .withMessage("password is to long"),
    body("repeatedNewPassword")
      .notEmpty()
      .withMessage("repeated password is required")
      .custom((value, { req }) => value === req.body.newPassword)
      .withMessage("not the same password"),
  ];
};
module.exports = {
  validationUserChangePassword,
};
