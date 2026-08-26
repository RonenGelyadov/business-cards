export default (req, res, next) => {
  const { isBusiness } = req.user;

  if (!isBusiness) {
    return res
      .status(403)
      .send({ message: 'You do not have permission to perform this action' });
  }

  next();
};
