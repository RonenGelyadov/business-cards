export default (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    req.validatedData = value;
    next();
  };
};
