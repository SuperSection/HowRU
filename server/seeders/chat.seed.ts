import { ObjectId } from "mongoose";
import { faker, simpleFaker } from "@faker-js/faker";

import { ChatModel } from "../models/chat.model";
import { UserModel } from "../models/user.model";


const createPersonalChats = async (numberOfChats: number) => {
  try {
    const users = await UserModel.find().select("_id");

    const chatsPromise = [];

    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < users.length; j++) {
        chatsPromise.push(
          ChatModel.create({
            name: faker.lorem.words(2),
            members: [users[i]?._id, users[j]?._id],
          }),
        );
      }
    }

    await Promise.all(chatsPromise);

    console.log("Chats created successfully.");
    process.exit();
      
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};


const createGroupChats = async (numberOfChats: number) => {
  try {
    const users = await UserModel.find().select("_id");

    const chatsPromise = [];

    for (let i = 0; i < numberOfChats; i++) {
      const numberOfMembers = simpleFaker.number.int({
        min: 3,
        max: users.length,
      });
      const members: ObjectId[] = [];

      for (let i = 0; i < numberOfMembers; i++) {
        const randomIndex = Math.floor(Math.random() * users.length);
        const randomUser = users[randomIndex];

        // Ensure the same user is not added twice
        if (!members.includes(randomUser?._id)) {
          members.push(randomUser?._id);
        }
      }

      const chat = await ChatModel.create({
        groupChat: true,
        name: faker.lorem.words(1),
        members,
        creator: members[0],
      });

      chatsPromise.push(chat);
    }

    await Promise.all(chatsPromise);

    console.log("Group chats created successfully", numberOfChats);
    process.exit();
      
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};


export { createPersonalChats, createGroupChats };