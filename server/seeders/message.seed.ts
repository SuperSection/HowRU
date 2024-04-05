import { faker } from "@faker-js/faker";

import { ChatModel } from "../models/chat.model";
import { UserModel } from "../models/user.model";
import { MessageModel } from "../models/message.model";


const createMessages = async (numberOfMessages: number) => {
  try {
    const users = await UserModel.find().select("_id");
    const chats = await ChatModel.find().select("_id");

    const messagePromise = [];

    for (let i = 0; i < numberOfMessages; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomChat = chats[Math.floor(Math.random() * chats.length)];

      messagePromise.push(
        MessageModel.create({
          chat: randomChat?._id,
          sender: randomUser?._id,
          content: faker.lorem.sentence(),
        }),
      );
    }

    await Promise.all(messagePromise);

    console.log("Messages created successfully", numberOfMessages);
    process.exit();
      
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};


const createMessagesInAChat = async (
  chatId: string,
  numberOfMessages: number,
) => {
  try {
    const users = await UserModel.find().select("_id");

    const messagePromise = [];

    for (let i = 0; i < numberOfMessages; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      messagePromise.push(
        MessageModel.create({
          chat: chatId,
          sender: randomUser?._id,
          content: faker.lorem.sentence(),
        }),
      );
    }

    await Promise.all(messagePromise);

    console.log("Messages created successfully in the chat", numberOfMessages);
    process.exit();
      
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};



export { createMessages, createMessagesInAChat };