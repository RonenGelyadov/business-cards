export default (req, res, next) => {
  const { isBusiness } = req.user;

  if (!isBusiness) {
    return res.status(403).send({ message: 'Only business can perform this action' });
  }

  next();
};
