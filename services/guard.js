import jwt from 'jsonwebtoken';
import config from 'config';

const JWT_SECRET = config.get('JWT_SECRET');

export default (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res
      .status(401)
      .send({ message: 'Authentication required to access this resource' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Invalid or expired token',
    });
  }
};
