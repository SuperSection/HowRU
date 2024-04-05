import HttpException from "../utils/classes/http.exception";
import { MessageDocument, MessageModel } from "../models/message.model";


const createNewMessage = async (
  data: Object,
): Promise<MessageDocument> => {
  try {
    const newMessage = await MessageModel.create(data);
    return newMessage;
  } catch (error: any) {
      console.log(error.message);
    throw new HttpException(500, "Failed to create message.");
  }
};


export { createNewMessage };