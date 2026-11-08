import { type Request, type Response, type NextFunction } from "express";
import { userService, type UserService } from "../userService";
import { validateUserPayload } from "../validator/schema";

export class UserController {
  constructor(private service: UserService = userService) {}

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      validateUserPayload(req.body);
      const data = await this.service.createUser(req.body);

      return res.status(201).json({
        message: "success created account",
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController();

