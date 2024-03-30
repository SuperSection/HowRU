import * as z from "zod";


const registrationSchema = z.object({
  name: z
    .string({ required_error: "Name field is required" })
    .min(2, { message: "Name must contain at least 2 characters." })
    .max(80, { message: "Name should be under 80 charcaters." }),
  username: z
    .string({ required_error: "Username is required." })
    .min(3, "Username must have at least 3 characters."),
  password: z
    .string({ required_error: "Password is required." })
    .min(8, "Password must be at least 8 characters long."),
  bio: z.string().optional(),
  avatar: z
    .object({
      public_id: z.string({ required_error: "Avatar should have a Public ID." }),
      url: z.string({ required_error: "Avatar should contain an URL." }),
    })
    .optional(),
});


const loginSchema = z.object({
  username: z.string({ required_error: "Username is required." }),
  password: z.string({ required_error: "Password is required." }),
});


export { registrationSchema, loginSchema };