import ApiError from "../utils/ApiError.util.js";

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const error = result.error.issues[0].message;
    return next(new ApiError(error, 400));
  }
  req.body = result.data;
  next();
};

export default validate;
