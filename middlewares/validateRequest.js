export default (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ errors: error.details });
    }
    req.validatedData = value;
    next();
  };
};
