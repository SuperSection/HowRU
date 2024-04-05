import * as z from "zod";

const sendRequestValidator = z.object({
  userId: z
    .string({ required_error: "User ID is required." })
    .min(1, { message: "Must be a valid ID." }),
});


const acceptRequestValidator = z.object({
  requestId: z
    .string({ required_error: "Request ID is required." })
    .min(1, { message: "Must be a valid ID." }),
  accept: z.boolean({ required_error: "Accept or Reject. Provide as true or false." }),
});


export { sendRequestValidator, acceptRequestValidator };