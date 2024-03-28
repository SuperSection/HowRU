import { UserDocument, UserModel } from "../models/user.model";


class UserService {
  private user = UserModel;
    
  /**
   * Create a new user
   */
  public async create(
    name: string,
    username: string,
    password: string,
    avatar: string,
  ): Promise<UserDocument> {
    try {
      const user = await this.user.create({ name, username, password, avatar });
      return user;
    } catch (error) {
      throw new Error("Failed to create user.");
    }
  }
}


export default UserService;