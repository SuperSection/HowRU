import { Router } from "express";

import {
  register,
  login,
  getMyProfile,
  logout,
  searchUser,
  sendConnectionRequest,
  acceptConnectionRequest,
  getMyNotifications,
  getMyConnections,
} from "../controllers/user.controller";

import { singleAvatar } from "../middlewares/multer.middleware";
import isUserAuthenticated from "../middlewares/auth.middleware";
import validationMiddleware from "../middlewares/validation.middleware";

import RouteController from "../utils/interfaces/routeController.interface";
import { loginValidator, registrationValidator } from "../utils/validators/auth.validation";
import { acceptRequestValidator, sendRequestValidator } from "../utils/validators/request.validation";


class UserRouter implements RouteController {
  public path = "/user";
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * Public Routes
     */
    this.router.post(
      `/register`,
      singleAvatar,
      validationMiddleware(registrationValidator),
      register,
    );

    this.router.post(`/login`, validationMiddleware(loginValidator), login);

    
    // to protect following routes
    this.router.use(isUserAuthenticated);

    
    /**
     * Protected Routes
     */
    this.router.get(`${this.path}/profile`, getMyProfile);

    this.router.post(`${this.path}/logout`, logout);

    this.router.get(`${this.path}/search`, searchUser);

    this.router.put(
      `${this.path}/send-request`,
      validationMiddleware(sendRequestValidator),
      sendConnectionRequest,
    );

    this.router.put(
      `${this.path}/accept-request`,
      validationMiddleware(acceptRequestValidator),
      acceptConnectionRequest,
    );

    this.router.get(`${this.path}/notifications`, getMyNotifications);

    this.router.get(`${this.path}/connections`, getMyConnections);
  }
}


export default UserRouter;