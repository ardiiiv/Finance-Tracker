import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRESIN,
  });
};
