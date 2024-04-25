import { z } from "zod";

const MB_BYTES = 1000000; // Number of bytes in a megabyte.
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];


const imageSchema = z
  .instanceof(FileList).refine((files) => files.length > 0, "Profile picture is required.")
  .superRefine((f, ctx) => {
    // First, add an issue if the mime type is wrong.
    if (!ACCEPTED_IMAGE_TYPES.includes(f[0].type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `File must be one of [${ACCEPTED_IMAGE_TYPES.map((mimetype) =>
          mimetype.slice(6),
        ).join(", ")}] but was ${f[0].type}`,
      });
    }
    // Next add an issue if the file size is too large.
    if (f[0].size > 5 * MB_BYTES) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        type: "array",
        message: `The file must not be larger than 5MB: ${f[0].size / MB_BYTES}`,
        maximum: 5 * MB_BYTES,
        inclusive: true,
      });
    }
  });



export const RegisterSchema = z
  .object({
    profilePicture: imageSchema,
    name: z.string().min(2, "Your name must contain 2 characters at least."),
    username: z.string().min(3, "Username must be at least of 3 characters."),
    bio: z.string().optional(),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long." }),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: "Password do not match",
      path: ["confirmPassword"],
    },
  );


  
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;