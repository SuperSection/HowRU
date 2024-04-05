import { ObjectId } from "mongoose";
import { ChatDocument, ChatModel } from "../models/chat.model";
import HttpException from "../utils/classes/http.exception";
import { CreateChatSchemaType } from "utils/validators/chat.validation";

/**
 * Create a new user
 */
const createNewChat = async (
  data: CreateChatSchemaType,
): Promise<ChatDocument> => {
  try {
    const user = await ChatModel.create({ ...data });
    return user;
  } catch (error: any) {
    throw new HttpException(500, `Failed to create chat. ${error.message}`);
  }
};


/**
 * Find all chats of a user
 * @param myId
 * @returns chats
 */
const findMyChats = async (myId: string): Promise<ChatDocument[]> => {
  try {
    const chats = await ChatModel.find({ members: myId }).populate(
      "members",
      "name profilePicture",
    );
    return chats;
  } catch (error) {
    throw new HttpException(404, "Failed to find personal chats");
  }
};


const findChatById = async (chatId: ObjectId | string) => {
  try {
    const chat = await ChatModel.findById(chatId);
    return chat;
  } catch (error) {
    throw new HttpException(
      404,
      "Failed to find any chat with the provided id.",
    );
  }
};


export { createNewChat, findMyChats, findChatById };