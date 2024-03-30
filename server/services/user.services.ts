import { UserDocument, UserModel } from "../models/user.model";


class UserService {
  private user = UserModel;
    
  /**
   * Create a new user
   */
  public async create(
    data : UserDocument
  ): Promise<UserDocument> {
    try {
      const user = await this.user.create({ ...data });
      return user;
    } catch (error) {
      throw new Error("Failed to create user.");
    }
  }
}


export default UserService;