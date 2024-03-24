import { Document, Schema, model, models } from "mongoose";


export interface UserDocument extends Document {
  name: string;
  username: string;
  password: string;
  avatar: string;

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: [3, "Must contain at least 3 characters."],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Must be at least 6 characters long."],
      select: false,
    },
    avatar: {
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


export const User = models.User || model("User", userSchema);