import { ObjectId } from "mongoose";
import { UserDocument, UserModel } from "../models/user.model";
import { CreateUserSchema } from "../utils/validators/auth.validation";
import HttpException from "../utils/classes/http.exception";

/**
 * Create a new user
 */
const createUser = async (data: CreateUserSchema): Promise<UserDocument> => {
  try {
    const newUser = await UserModel.create({ ...data });
    return newUser;
  } catch (error) {
    throw new HttpException(500, "Failed to create user.");
  }
};

/**
 * Get user by userId
 * @param userId
 * @returns UserDocument
 */
const getUserById = async (
  userId: ObjectId | string,
  options?: string,
): Promise<UserDocument> => {
  try {
    const userData = await UserModel.findById(userId, options);
    if (!userData) {
      throw new HttpException(400, "User not found.");
    }
    return userData;
  } catch (error) {
    throw new HttpException(500, "Failed to find user.");
  }
};

export { createUser, getUserById };
