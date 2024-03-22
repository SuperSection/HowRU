import express, { Application } from "express";
import env from "./utils/validateEnv";

const PORT = env.SERVER_PORT || 5000;

const app: Application = express();

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
