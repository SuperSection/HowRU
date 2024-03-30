import { Document, Schema, model } from "mongoose";
import { hash } from "bcryptjs";


export interface UserDocument extends Document {
  name: string;
  username: string;
  password: string;
  bio: string;
  avatar: {
    public_id: string;
    url: string;
  };

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
    bio: {
      type: String,
      maxlength: [400, "Must be under 400 characters."],
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
  },
);


// Hash password on save change
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await hash(this.password, 10);
  next();
});


export const UserModel = model<UserDocument>("User", userSchema);