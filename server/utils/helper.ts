import { ObjectId } from "mongoose";

import { UserDocument, UserModel } from "../models/user.model";


export const getTheConnectedUser = async (
  members: any,
  userId: ObjectId | string,
): Promise<UserDocument> =>
  await members.find(
    (member: UserDocument) => member._id.toString() !== userId.toString(),
  );


export const getBase64 = (file: any) =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
