import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const headers = req.headers;
  const auth = headers[''];
  console.log(auth);
  return res.end();
};
