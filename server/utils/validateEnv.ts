import { cleanEnv, port, str } from "envalid";

export interface Env {
  NODE_ENV: string;
  SERVER_PORT: number;
}

export const env = cleanEnv(process.env, {
  // MONGODB_URI: str(),
  NODE_ENV: str({ desc: "Node environment (development, production)" }),
  SERVER_PORT: port({ desc: "Port on which the server listens" }),
});
