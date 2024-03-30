import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/user.model";
import sendToken, { cookieOptions } from "../utils/features/generateToken";
import isPasswordCorrect from "../utils/features/verifyPassword";
import HttpException from "../utils/exceptions/http.exception";
import asyncTryCatchHandler from "./../utils/asyncTryCatchHandler";
import UserRequest from "utils/interfaces/userRequest.interface";


// Register a new user
const register = asyncTryCatchHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, username, password, bio } = req.body;
    // console.log(req.body);

    const avatar = {
      public_id: "bdqw98h",
      url: "cbq0",
    };

    const newUser = await UserModel.create({
      name,
      username,
      password,
      bio,
      avatar,
    });

    sendToken(res, newUser, 201, "User registered successfully.");
  },
);


// Login a user
const login = asyncTryCatchHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username }).select("+password");
    if (!user) {
      return next(new HttpException(400, "User not found."));
    }

    const isPasswordMatched = await isPasswordCorrect(password, user.password);
    if (!isPasswordMatched) {
      return next(new HttpException(400, "Invalid credentials."));
    }

    sendToken(res, user, 200, `Welcome back, ${user.name}.`);
  },
);


// Get the profile of logged in user
const getUserProfile = asyncTryCatchHandler(
  async (req: UserRequest, res: Response) => {
    const user = await UserModel.findById(req.user?._id);

    res.status(200).json({ success: true, data: user });
  },
);


// Logout user
const logout = (req: Request, res: Response, next: NextFunction) => {
  return res
    .status(200)
    .clearCookie("howruToken", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "Logged out successfully.",
    });
};


// Search users
const searchUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, username } = req.query;

  return res.status(200).json({
    success: true,
    message: username,
  });
};


export { register, login, getUserProfile, logout, searchUser };