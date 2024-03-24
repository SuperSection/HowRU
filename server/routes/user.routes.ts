import { Router } from "express";
import { login } from "../controllers/user.controller";

const router = Router();

router.get("/", login);

export default router;