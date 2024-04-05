import * as z from "zod";


const createChatValidator = z.object({
  name: z
    .string({ required_error: "Name field is required." })
    .min(2, { message: "Name must contain at least 2 characters." })
    .max(80, { message: "Name should be under 80 charcaters." }),
  groupChat: z.boolean().default(false),
  avatar: z
    .object({
      public_id: z.string({
        required_error: "Avatar should have a Public ID.",
      }),
      url: z.string({ required_error: "Avatar should contain an URL." }),
    })
    .optional(),
  creator: z.string().optional(), // Validate creator as optional CUID
  members: z
    .array(z.string())
    .min(2, { message: "Must have at least 2 members in a chat." })
    .max(200, "Members count can be only upto 200."), // Array of optional CUIDs,
});

type CreateChatSchemaType = z.infer<typeof createChatValidator>;


const addMembersValidator = z.object({
  chatId: z.string({ required_error: "Chat ID is required." }),
  members: z
    .array(z.string())
    .min(1, { message: "Mention new members ID to be added." }),
});


const removeMemberValidator = z.object({
  chatId: z.string({ required_error: "Chat ID is required." }),
  userId: z.string({ required_error: "User ID to remove is required." }),
});


export { createChatValidator, CreateChatSchemaType, addMembersValidator, removeMemberValidator };