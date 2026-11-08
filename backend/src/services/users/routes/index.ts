import { Router } from "express";
import { userController } from "../controller/userController";

const userRouter = Router();

userRouter.post("/", userController.createUser);

export { userRouter };

