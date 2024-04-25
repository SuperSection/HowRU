import { NextFunction, Request, Response } from "express";

import { createUser } from "../services/user.services";
import { REFETCH_CHATS } from "../constants/chat.events";
import { NEW_CONNECTION_REQUEST } from "../constants/user.events";

import { UserModel } from "../models/user.model";
import { ChatModel } from "../models/chat.model";

import emitEvent from "../utils/features/emitEvent";
import { getTheConnectedUser } from "../utils/helper";
import HttpException from "../utils/classes/http.exception";
import ApiResponse from "../utils/classes/ApiResponse.class";
import asyncTryCatchHandler from "../utils/asyncTryCatchHandler";
import isPasswordCorrect from "../utils/features/verifyPassword";
import UserRequest from "../utils/interfaces/userRequest.interface";
import { uploadFilesToCloudinary } from "../utils/features/cloudinary";
import { ConnectionRequestModel } from "../models/connectionRequest.model";
import sendToken, { cookieOptions } from "../utils/features/generateToken";


// Register a new user
const register = asyncTryCatchHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, username, password, bio } = req.body;
    // console.log(req.body);

    const file = req.file;
    if (!file) {
      return next(new HttpException(400, "Please upload a profile picture."));
    }
    console.log(file);

    const avatar = await uploadFilesToCloudinary([file]);

    const profilePicture = {
      public_id: avatar[0]?.public_id,
      url: avatar[0]?.url,
    };

    const newUser = await createUser({
      name,
      username,
      password,
      bio,
      profilePicture,
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
const getMyProfile = asyncTryCatchHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const user = await UserModel.findById(req.user?._id);

    if (!user) {
      return next(new HttpException(404, "User not found."));
    }

    res.status(200).json({ success: true, data: user });
  },
);


// Logout user
const logout = asyncTryCatchHandler(
  (req: Request, res: Response, next: NextFunction) => {
    return res
      .status(200)
      .clearCookie("howruToken", { ...cookieOptions, maxAge: 0 })
      .json(new ApiResponse(200, "Logged out successfully."));
  },
);


// Search users
const searchUser = asyncTryCatchHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const { name = "" } = req.query;

    const myPersonalChats = await ChatModel.find({ groupChat: false, members: req.user?._id });

    const allConnectedUsers = myPersonalChats.flatMap((chat) => chat.members);

    const allUsersExceptMeAndMyConnections = await UserModel.find({
      _id: { $nin: allConnectedUsers },
      name: { $regex: name, $options: "i" },
    });

    const users = allUsersExceptMeAndMyConnections.map(({_id, name, profilePicture}) => ({
      _id,
      name,
      profilePicture: profilePicture.url,
    }));

    return res.status(200).json({
      success: true,
      users,
    });
  },
);


// Send connection request to a user
const sendConnectionRequest = asyncTryCatchHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const { userId } = req.body;

    const connectionRequest = await ConnectionRequestModel.findOne({
      $or: [
        { sender: req.user?._id, receiver: userId },
        { sender: userId, receiver: req.user?._id },
      ],
    });

    if (connectionRequest) {
      return next(new HttpException(400, "Connection Request already sent."));
    }

    await ConnectionRequestModel.create({
      sender: req.user?._id,
      receiver: userId,
    });

    emitEvent(req, NEW_CONNECTION_REQUEST, [userId]);

    return res
      .status(200)
      .json(new ApiResponse(200, "Connection Request sent."));
  },
);


// Accept or Reject connection request 
const acceptConnectionRequest = asyncTryCatchHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const { requestId, accept } = req.body;

    const connectionRequest = await ConnectionRequestModel.findById(requestId)
      .populate("sender", "name")
      .populate("receiver", "name")
      .exec();

    if (!connectionRequest) {
      return next(new HttpException(400, "Connection Request not found."));
    }

    if (connectionRequest.receiver._id.toString() !== req.user?._id.toString()) {
      return next(
        new HttpException(
          400,
          "You are not authorized to accept this request.",
        ),
      );
    }

    if (!accept) {
      await connectionRequest.deleteOne();

      return res.status(200).json(new ApiResponse(200, "Connection Request rejected."));
    }

    const members = [connectionRequest.sender._id, connectionRequest.receiver._id];

    await Promise.all([
      ChatModel.create({
        members,
        name: `${connectionRequest.sender.name}-${connectionRequest.receiver.name}`,
      }),
      connectionRequest.deleteOne(),
    ]);

    emitEvent(req, REFETCH_CHATS, members);

    return res
      .status(200)
      .json({
        success: true,
        message: "Connection Request accepted.",
        sender: connectionRequest.sender._id,
      });
  },
); 


// Get all received notifications by a user
const getMyNotifications = asyncTryCatchHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const connectionRequests = await ConnectionRequestModel.find({
      receiver: req.user?._id,
    })
      .populate("sender", "name profilePicture")
      .exec();

    const allRequests = connectionRequests.map(({ _id, sender }) => ({
      _id,
      sender: {
        _id: sender._id,
        name: sender.name,
        profilePicture: sender.profilePicture.url,
      },
    }));

    return res.status(200).json({
      success: true,
      allRequests,
    });
  },
);


// Get all connections of a user
const getMyConnections = asyncTryCatchHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const { chatId } = req.body;

    const myPersonalChats = await ChatModel.find({
      groupChat: false,
      members: req.user?._id,
    });

    const allConnectedUsers = myPersonalChats.map(async ({ members }) => {
      const connectedMember = await getTheConnectedUser(members, req.user?._id);

      return {
        _id: connectedMember._id,
        name: connectedMember.name,
        profilePicture: connectedMember.profilePicture.url,
      };
    });

    if (chatId) {
      const chat = await ChatModel.findById(chatId);

      const availableConnections = allConnectedUsers.filter(
        async (connection) => !chat?.members.includes((await connection)._id),
      );

      return res.status(200).json({
        success: true,
        connections: availableConnections,
      });

    } else {
      return res.status(200).json({
        success: true,
        connections: allConnectedUsers,
      });
    }
  },
);



export {
  register,
  login,
  getMyProfile,
  logout,
  searchUser,
  sendConnectionRequest,
  acceptConnectionRequest,
  getMyNotifications,
  getMyConnections,
};