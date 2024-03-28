import { Router } from "express";
import { register, login } from "../controllers/user.controller";
import RouteController from "../utils/interfaces/routeController.interface";
import validationMiddleware from "../middlewares/validation.middleware";
import { registrationSchema } from "../utils/validators/auth.validation";


class UserRouter implements RouteController {
  public path = "/users";
    public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
      this.router.post(`/register`, validationMiddleware(registrationSchema), register);
      this.router.post(`/login`, login);
  }
}


export default UserRouter;