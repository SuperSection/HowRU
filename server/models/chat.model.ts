import { Document, ObjectId, Schema, model } from "mongoose";


interface ChatMember {
  userId: Schema.Types.ObjectId; // Reference user ID
  [key: string]: any; // Allow additional properties of any type
}

export interface ChatDocument extends Document {
  name: string;
  groupChat: boolean;
  avatar: {
    public_id: string;
    url: string;
  };
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
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
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
  },
);


export const ChatModel = model<ChatDocument>("Chat", chatSchema);