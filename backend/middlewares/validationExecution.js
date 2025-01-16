const { validationResult } = require("express-validator");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");

function validationExecution(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsMsg = errors.array().map((ele) => ele.msg);
    const error = appError.create(errorsMsg, 400, httpStatusText.FAIL);
    return next(error);
  }
  next();
}

module.exports = validationExecution;
