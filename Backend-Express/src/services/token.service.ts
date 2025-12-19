import jwt, { SignOptions } from "jsonwebtoken";
import authConfig from "../config/auth.config";

export const generateAccessToken = (userId: number) => {
  return jwt.sign(
    { userId },
    authConfig.secret,
    {
      expiresIn: authConfig.expiresIn,
    } as SignOptions
  );
};

export const generateRefreshToken = (userId: number) => {
  return jwt.sign(
    { userId },
    authConfig.refreshSecret,
    {
      expiresIn: authConfig.refreshExpiresIn,
    } as SignOptions
  );
};
