import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";

import HttpException from "../utils/classes/http.exception";
import UserRequest from "../utils/interfaces/userRequest.interface";
import UserJwtPayload from "../utils/interfaces/userJwtPayload.interface";


const isUserAuthenticated = (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.cookies?.howruToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return next(
        new HttpException(401, "Unauthorized access. User must be logged in."),
      );
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET,
    ) as UserJwtPayload;

    req.user = { _id: decodedToken.userId };
    next();

  } catch (error) {
    res.status(400).json({ message: "Invalid access.", error });
  }
};


export default isUserAuthenticated;