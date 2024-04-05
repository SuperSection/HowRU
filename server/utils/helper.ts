import { ObjectId } from "mongoose";

import { UserDocument, UserModel } from "../models/user.model";


const getTheConnectedUser = async (
  members: any,
  userId: ObjectId | string,
): Promise<UserDocument> =>
  await members.find(
    (member: UserDocument) => member._id.toString() !== userId.toString(),
  );


export { getTheConnectedUser };