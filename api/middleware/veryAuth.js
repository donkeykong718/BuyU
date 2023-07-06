import jwt from "jsonwebtoken";

const TOKEN_KEY = process.env.TOKEN_KEY;

export default async function verifyAuth(req, res, next) {
  // extract token from headers
  const token = req.headers.authorization;
  // If token doesn't exist, we can return an error
  if (!token) {
    return res.status(401).json({
      message: "You must signin first",
    });
  }

  // verify token and extra the user's info
  const data = jwt.verify(token, TOKEN_KEY);

  req.id = data.id;
  next();
}
