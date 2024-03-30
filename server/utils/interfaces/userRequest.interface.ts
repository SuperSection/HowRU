import { Request } from "express";
import { UserDocument } from "models/user.model";

interface UserRequest extends Request {
  user?: { _id: string } | UserDocument;
}

export default UserRequest;
