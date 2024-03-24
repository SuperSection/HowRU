import { Document, ObjectId, Schema, model, models } from "mongoose";


export interface MessageDocument extends Document {
  content: string;
  sender: ObjectId;
  chat: ObjectId;
  attachments: string;

  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<MessageDocument>(
  {
    content: {
      type: String,
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    attachments: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);


export const Message = models.Message || model("Message", messageSchema);