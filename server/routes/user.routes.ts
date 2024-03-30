import { Router } from "express";

import { singleAvatar } from "../middlewares/multer.middleware";
import validationMiddleware from "../middlewares/validation.middleware";
import RouteController from "../utils/interfaces/routeController.interface";
import { loginSchema, registrationSchema } from "../utils/validators/auth.validation";
import { register, login, getUserProfile, logout, searchUser } from "../controllers/user.controller";
import isUserAuthenticated from "../middlewares/auth.middleware";


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
      validationMiddleware(registrationSchema),
      register,
    );

    this.router.post(`/login`, validationMiddleware(loginSchema), login);


    // to protect following routes
    this.router.use(isUserAuthenticated);


    /**
     * Protected Routes
     */
    this.router.get(`${this.path}/profile`, getUserProfile);

    this.router.post(`${this.path}/logout`, logout);

    this.router.get(`${this.path}/search`, searchUser);
  }
}


export default UserRouter;