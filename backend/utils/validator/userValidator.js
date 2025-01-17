const { body } = require("express-validator");

const validationUserSchema = () => {
  return [
    body("firstName")
      .notEmpty()
      .withMessage("Fist Name is required")
      .isLength({ min: 3 })
      .withMessage("First Name is too short")
      .isLength({ max: 20 })
      .withMessage("First Name is too long"),
    body("lastName")
      .notEmpty()
      .withMessage("Last Name is required")
      .isLength({ min: 3 })
      .withMessage("Last Name is too short")
      .isLength({ max: 20 })
      .withMessage("Last Name is too long"),
    body("password")
      .notEmpty()
      .withMessage("password is required")
      .isLength({ min: 8 })
      .withMessage("password must be at least 8 character")
      .isLength({ max: 80 })
      .withMessage("password is to long"),
    body("email").isEmail().withMessage("Enter a valid email"),
    body("mobile").isMobilePhone("ar-EG").withMessage("Not a phone number"),
  ];
};
module.exports = {
  validationUserSchema,
};
