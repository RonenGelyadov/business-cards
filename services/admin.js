export default (req, res, next) => {
  const { isAdmin } = req.user;

  if (!isAdmin) {
    return res
      .status(403)
      .send({ message: 'You do not have permission to perform this action' });
  }

  next();
};
