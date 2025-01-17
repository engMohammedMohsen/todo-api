const { body } = require("express-validator");

const validationAddTodo = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("title is required")
      .isLength({ max: 80 })
      .withMessage("title is too long"),
    body("description")
      .isLength({ max: 1000 })
      .withMessage("Description is too long"),
  ];
};
module.exports = {
  validationAddTodo,
};
