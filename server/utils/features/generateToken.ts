import jwt from "jsonwebtoken";
import { CookieOptions, Response } from "express";

import { UserDocument } from "../../models/user.model";
import UserJwtPayload from "../../utils/interfaces/userJwtPayload.interface";


export const cookieOptions: CookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "strict",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" ? true : false,
};

const sendToken = (
  res: Response,
  user: UserDocument,
  code: number,
  message: string,
) => {

  const payload: UserJwtPayload = { userId: user._id };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
    algorithm: "HS256",
  });

  return res.status(code).cookie("howruToken", token, cookieOptions).json({
    success: true,
    message,
  });
};


export default sendToken;