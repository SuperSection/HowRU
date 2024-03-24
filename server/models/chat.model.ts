import { Document, ObjectId, Schema, model, models } from "mongoose";


export interface ChatDocument extends Document {
  name: string;
  groupChat: boolean;
  creator: ObjectId;
  members: ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<ChatDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    groupChat: {
      type: Boolean,
      default: false,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);


export const Chat = models.Chat || model("Chat", chatSchema);