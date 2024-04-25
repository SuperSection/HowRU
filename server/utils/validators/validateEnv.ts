import * as z from "zod";

const envSchema = z.object({
  SERVER_PORT: z.number().default(5000),
  NODE_ENV: z.enum(["development", "production"]),
  MONGODB_URI: z.string().url(),
  JWT_SECRET: z.string(),
  JWT_EXPIRY: z.string(),
  CLIENT_URL: z.string().url(),

  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
});

envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
