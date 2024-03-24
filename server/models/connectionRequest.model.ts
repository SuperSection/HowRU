import { Document, ObjectId, Schema, model, models } from "mongoose";


export interface ConnectionRequestDocument extends Document {
  status: string;
  sender: ObjectId;
  receiver: ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const connectionRequestSchema = new Schema<ConnectionRequestDocument>(
  {
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


export const ConnectionRequest = models.ConnectionRequest || model("ConnectionRequest", connectionRequestSchema);