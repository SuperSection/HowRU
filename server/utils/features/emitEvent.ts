import { ObjectId } from "mongoose";
import { UserDocument } from "../../models/user.model";
import { Request } from 'express';


const emitEvent = (
  req: Request,
  event: string,
  users: UserDocument[] | ObjectId[],
  data?: string | Object,
) => {
  console.log("Emitting event", event);
};


export default emitEvent;