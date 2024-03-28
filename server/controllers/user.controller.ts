import { Request, Response } from "express";
import { UserModel } from "../models/user.model";


// Register a new user
const register = async (req: Request, res: Response) => {
  try {
    const { name, username, password, bio } = req.body;
    // console.log(req.body);

    const avatar = {
      public_id: "bdqw98h",
      url: "cbq0",
    };

    const newUser = await UserModel.create({
      name,
      username,
      password,
      bio,
      avatar,
    });

    res.status(201).json({ message: "User successfully registered.", data: newUser });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
}

const login = (req: Request, res: Response) => {
  res.json({message: "Login endpoint"});
};


export { register, login };