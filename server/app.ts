import express, { Application } from "express";
import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";

import connectDB from "./config/connectDB";
import ErrorHandler from "./middlewares/errorHandler";
import RouteController from "./utils/interfaces/routeController.interface";
import { createSampleUsers } from "./seeders/user.seed";
import { createGroupChats, createPersonalChats } from "./seeders/chat.seed";
import { createMessages, createMessagesInAChat } from "./seeders/message.seed";


class App {
  public express: Application;
  public port: number;

  constructor(routes: RouteController[], port: number) {
    this.express = express();
    this.port = port;

    this.initializeDatabaseConnection();
    this.initializeMiddleware();
    this.initializeRouteControllers(routes);
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    this.express.use(helmet());
    this.express.use(cors());
    this.express.use(morgan("dev"));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(cookieParser());
    this.express.use(compression());
  }

  private initializeRouteControllers(routes: RouteController[]): void {
    routes.forEach((route: RouteController) => {
      this.express.use("/api", route.router);
    });
  }

  private initializeErrorHandling(): void {
    this.express.use(ErrorHandler);
  }

  private initializeDatabaseConnection(): void {
    const MongoDB_URI = process.env.MONGODB_URI as string;
    connectDB(MongoDB_URI);
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      console.log(`App listening on PORT ${this.port}`);
    });
  }
}

export default App;
