import * as z from "zod";

const headerSchema = z.object({
  name: z.string(),
  username: z.string(),
  password: z.string(),
  bio: z.string().optional(),
  avatar: z.object({ public_id: z.string(), url: z.string() }).optional(),
});

export default headerSchema;
