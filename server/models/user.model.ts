import { Document, Schema, model, models } from "mongoose";


export interface UserDocument extends Document {
  name: string;
  username: string;
  password: string;
  bio: string;
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
    bio: {
      type: String,
      maxlength: [150, "Must be at most 150 characters long."],
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


// userSchema.pre("save", async function (next: NextFunction) {
//   if (!this.isModified("password")) {
//     return next();
//   }
//   next();
// });


export const UserModel = model<UserDocument>("User", userSchema);