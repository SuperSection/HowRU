import express, { Application } from "express";
import userRouter from "./routes/user.routes";
import "dotenv/config";

const app: Application = express();

app.use("/api/user", userRouter);

export default app;
