const { body } = require("express-validator");

const validationUserSchema = () => {
  return [
    body("firstName")
      .notEmpty()
      .withMessage("Fist Name is required")
      .isLength({ max: 20 })
      .withMessage("First Name is to long"),
    body("lastName")
      .notEmpty()
      .withMessage("Last Name is required")
      .isLength({ max: 20 })
      .withMessage("Last Name is to long"),
    body("password")
      .notEmpty()
      .withMessage("password is required")
      .isLength({ min: 8 })
      .withMessage("password must be al least 8 character")
      .isLength({ max: 80 })
      .withMessage("password is to long"),
    body("mobile").isMobilePhone("ar-EG").withMessage("Not a phone number"),
  ];
};
module.exports = {
  validationUserSchema,
};
