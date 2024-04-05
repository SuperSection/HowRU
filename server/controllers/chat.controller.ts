import { ObjectId } from "mongoose";
import { NextFunction, Response } from "express";

import {
  ALERT,
  NEW_ATTACHMENT,
  NEW_MESSAGE_ALERT,
  REFETCH_CHATS,
} from "../constants/chat.events";
import {
  createNewChat,
  findChatById,
  findMyChats,
} from "../services/chat.services";
import { getUserById } from "../services/user.services";
import { createNewMessage } from "../services/message.services";

import { ChatModel } from "../models/chat.model";
import { UserDocument } from "../models/user.model";
import { MessageModel } from "../models/message.model";

import emitEvent from "../utils/features/emitEvent";
import Avatar from "../utils/interfaces/avatar.interface";
import HttpException from "../utils/classes/http.exception";
import ApiResponse from "../utils/classes/ApiResponse.class";
import { getTheConnectedUser } from "../utils/helper";
import asyncTryCatchHandler from "../utils/asyncTryCatchHandler";
import UserRequest from "../utils/interfaces/userRequest.interface";
import { deleteFilesFromCloudinary } from "../utils/features/cloudinary";


const newGroupChat = asyncTryCatchHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const { name, members } = req.body;

    if (members.length < 2) {
      return next(
        new HttpException(400, "Group chat must have at least 3 members."),
      );
    }

    const allGroupMembers = [req.user, ...members];

    const groupAvatar = {
      public_id: "",
      url: "",
    }

    await createNewChat({
      name,
      groupChat: true,
      creator: req.user?._id,
      members: allGroupMembers,
      avatar: groupAvatar,
    });

    emitEvent(req, REFETCH_CHATS, members);
    emitEvent(req, ALERT, allGroupMembers, `Welcome to ${name} group`);

    return res
      .status(200)
      .json(new ApiResponse(200, "Group created successfully."));
  },
);


const getMyChats = asyncTryCatchHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const chats = await ChatModel.find({ members: req.user?._id })
      .populate("members", "name profilePicture")
      .exec();

    const transformedChats = chats.map(
      async ({ _id, name, avatar, members, groupChat }) => {
        const connectedMember = await getTheConnectedUser(
          members,
          req.user?._id,
        );

        console.log(connectedMember);

        if (!connectedMember) {
          return next(new HttpException(400, "Connected member not found."));
        }

        return {
          _id,
          groupChat,
          avatar: groupChat ? avatar : connectedMember.profilePicture,
          name: groupChat ? name : connectedMember.name,
          members: members.reduce((prev: ObjectId[], curr) => {
            if (curr !== req.user?._id) {
              prev.push(curr);
            }
            return prev;
          }, []),
        };
      },
    );

    return res.status(200).json({
      success: true,
      chats: transformedChats,
    });
  },
);


const getMyGroups = asyncTryCatchHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const chats = await ChatModel.find({
      members: req.user?._id,
      groupChat: true,
    }).populate("members", "name profilePicture");

    const groups = chats.map(({ _id, name, groupChat, avatar }) => ({
      _id,
      groupChat,
      name,
      avatar,
    }));

    return res.status(200).json({
      success: true,
      groups,
    });
  },
);


const addMembersInGroup = asyncTryCatchHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const { chatId, members } = req.body;

    if (!members || members.length < 1) {
      return next(new HttpException(400, "Please provide members to add."));
    }

    const chat = await findChatById(chatId);

    if (!chat) {
      return next(new HttpException(404, "Chat not found."));
    }

    if (!chat.groupChat) {
      return next(new HttpException(400, "This is not a group chat."));
    }

    if (chat?.creator.toString() !== req.user?._id) {
      return next(
        new HttpException(403, "You are not allowed to add members."),
      );
    }

    const allNewMembers = await Promise.allSettled<Promise<UserDocument>>(
      members.map((memberId: ObjectId) => getUserById(memberId, "name")),
    );

    const resolvedMembers = allNewMembers.map((memberResult) =>
      memberResult.status === "fulfilled" ? memberResult.value : undefined,
    );

    chat.members.push(...resolvedMembers.map((member) => member?._id));

    if (chat.members.length > 200) {
      return next(new HttpException(400, "Group members limit reached."));
    }

    await chat.save();

    const getUsersData = chat.members.map(async (memberId: ObjectId) => {
      const user = await getUserById(memberId);
      return user;
    });

    Promise.all(getUsersData).then((users) => {
      const allUsersName = users.map((user) => user.name).join(", ");

      emitEvent(
        req,
        ALERT,
        users,
        `${allUsersName} has been added in the group.`,
      );
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Members added successfully."));
  },
);


const removeMemberFromGroup = asyncTryCatchHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const { userId, chatId } = req.body;

    const [chat, userToRemove] = await Promise.all([
      findChatById(chatId),
      getUserById(userId, "name"),
    ]);

    if (!chat) {
      return next(new HttpException(404, "Chat not found."));
    }

    if (!chat.groupChat) {
      return next(new HttpException(400, "This is not a group chat."));
    }

    if (chat?.creator.toString() !== req.user?._id) {
      return next(
        new HttpException(403, "You are not allowed to remove members."),
      );
    }

    if (chat.members.length <= 3) {
      return next(
        new HttpException(400, "Group must have at least 3 mmembers"),
      );
    }

    chat.members = chat.members.filter(
      (memberId) => memberId.toString() !== userId.toString(),
    );

    await chat.save();

    emitEvent(
      req,
      ALERT,
      chat.members,
      `${userToRemove} has been removed from the group.`,
    );
    emitEvent(req, REFETCH_CHATS, chat.members);

    return res
      .status(200)
      .json(new ApiResponse(200, "Member removed successfully."));
  },
);


const exitGroup = asyncTryCatchHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const chatId = req.params.groupId;
    if (!chatId) {
      return next(new HttpException(400, "Invalid request."));
    }

    const chat = await findChatById(chatId);

    if (!chat) {
      return next(new HttpException(404, "Chat not found."));
    }

    if (!chat?.members.find(req.user?._id)) {
      return next(new HttpException(400, "You are not a member of the group."));
    }

    if (!chat.groupChat) {
      return next(new HttpException(400, "This is not a group chat."));
    }

    const remainingMembers = chat.members.filter(
      (memberId) => memberId.toString() !== req.user?._id.toString(),
    );

    if (remainingMembers.length < 3) {
      return next(
        new HttpException(400, "Group must have at least 3 members."),
      );
    }

    if (chat.creator.toString() === req.user?._id.toString()) {
      const randomMember = Math.floor(Math.random() * remainingMembers.length);
      const newCreator = remainingMembers[randomMember];
      if (!newCreator) {
        return next(new HttpException(404, "Failed select a new creator."));
      }

      chat.creator = newCreator;
    }

    chat.members = remainingMembers;

    const [userLeft] = await Promise.all([
      getUserById(req.user?._id, "name"),
      chat.save(),
    ]);

    emitEvent(
      req,
      ALERT,
      chat.members,
      `Member ${userLeft.name} has left the group.`,
    );

    return res
      .status(200)
      .json(new ApiResponse(200, "User left group successfully."));
  },
);


const sendAttachments = asyncTryCatchHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const { chatId } = req.body;

    const [chat, user] = await Promise.all([
      findChatById(chatId),
      getUserById(req.user?._id, "name"),
    ]);

    if (!chat) {
      return next(new HttpException(404, "Chat not found."));
    }

    const files = req.files || [];

    if (!files.length) {
      return next(new HttpException(400, "No attachments are provided."));
    }

    // upload files here
    const attachments = [
      {
        url: "8fb8b7t",
        public_id: "vuyv7b7n7",
      },
    ];

    const messageForDB = {
      content: "send attachments endpoint testing",
      attachments,
      sender: user._id,
      chat: chatId,
    };

    const messageForRealTime = {
      ...messageForDB,
      sender: {
        _id: user._id,
        name: user.name,
      },
    };

    const message = await createNewMessage(messageForDB);

    emitEvent(req, NEW_ATTACHMENT, chat.members, {
      message: messageForRealTime,
      chatId,
    });

    emitEvent(req, NEW_MESSAGE_ALERT, chat.members, {
      chatId,
    });

    return res.status(200).json({ success: true, message });
  },
);


const getChatDetils = asyncTryCatchHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    if (req.query.populate === "true") {
      const chat = await ChatModel.findById(req.params.chatId)
        .populate("members", "name profilePicture")
        .lean(); // Convert chat document to plain object

      if (!chat) {
        return next(new HttpException(404, "Chat not found."));
      }

      chat.members = chat.members.map(({ _id, name, profilePicture }) => ({
        _id,
        name,
        avatar: profilePicture.url,
      }));

      return res.status(200).json({
        success: true,
        chat,
      });
    } else {
      const chat = await ChatModel.findById(req.params.chatId).lean();

      if (!chat) {
        return next(new HttpException(404, "Chat not found."));
      }

      return res.status(200).json({
        success: true,
        chat,
      });
    }
  },
);


const renameGroup = asyncTryCatchHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const chatId = req.params.chatId;
    if (!chatId) {
      return next(new HttpException(400, "Invalid request."));
    }

    const { name } = req.body;

    const chat = await findChatById(chatId);
    if (!chat) {
      return next(new HttpException(404, "Chat not found."));
    }

    if (!chat.groupChat) {
      return next(new HttpException(400, "This is not a group chat."));
    }

    if (chat.creator.toString() !== req.user?._id.toString()) {
      return next(
        new HttpException(403, "You are not allowed to rename the group."),
      );
    }

    chat.name = name;
    await chat.save();

    emitEvent(req, REFETCH_CHATS, chat.members);

    return res
      .status(200)
      .json(new ApiResponse(200, "Group renamed successfully."));
  },
);


const deleteChat = asyncTryCatchHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const chatId = req.params.chatId;
    if (!chatId) {
      return next(new HttpException(400, "Invalid request."));
    }

    const chat = await findChatById(chatId);
    if (!chat) {
      return next(new HttpException(404, "Chat not found."));
    }

    if (
      chat.groupChat &&
      chat.creator.toString() !== req.user?._id.toString()
    ) {
      return next(
        new HttpException(403, "You are not allowed to delete the group."),
      );
    }

    if (!chat.groupChat && !chat.members.includes(req.user?._id.toString())) {
      return next(
        new HttpException(403, "You don't have such a chat to delete."),
      );
    }

    // Here we have to delete all messages as well as attachments or files from cloudinary
    const messagesWithAttachments = await MessageModel.find({
      chat: chatId,
      attachments: { $exists: true, $ne: [] },
    });

    const public_ids: string[] = [];

    messagesWithAttachments.forEach(({ attachments }) =>
      attachments.forEach(({ public_id }: Avatar) =>
        public_ids.push(public_id),
      ),
    );

    await Promise.all([
      deleteFilesFromCloudinary(public_ids),
      chat.deleteOne(),
      MessageModel.deleteMany({ chat: chatId }),
    ]);

    emitEvent(req, REFETCH_CHATS, chat.members);

    return res
      .status(200)
      .json(new ApiResponse(200, "Chat deleted successfully."));
  },
);


const getMessages = asyncTryCatchHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const chatId = req.params.chatId;
    if (!chatId) {
      return next(new HttpException(400, "Invalid request."));
    }

    const { page = 1 } = req.query as { page?: number };

    const resultPerPage = 20;
    const skip = (page - 1) * resultPerPage;

    const [messages, totalMessagesCount] = await Promise.all([
      MessageModel.find({ chat: chatId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(resultPerPage)
        .populate("sender", "name profilePicture")
        .lean(),
      MessageModel.countDocuments({ chat: chatId }),
    ]);

    const totalPages = Math.ceil(totalMessagesCount / resultPerPage) || 0;

    return res.status(200).json({
      success: true,
      messages: messages.reverse(),
      totalPages,
    });
  },
);


export {
  addMembersInGroup,
  getMyChats,
  getMyGroups,
  newGroupChat,
  removeMemberFromGroup,
  exitGroup,
  sendAttachments,
  getChatDetils,
  renameGroup,
  deleteChat,
  getMessages,
};