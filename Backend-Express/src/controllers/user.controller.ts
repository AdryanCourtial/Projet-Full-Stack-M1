import { Request, Response } from "express";
import {
  getAllUsersService,
  getByIdUserService,
} from "../services/userService";
import { UserDto } from "../dto/user.dto";

class UserController {
  static getAllUsers = async (req: Request, res: Response) => {
    try {
      const dto = ((req as any).validated_query ?? {}) as UserDto;
      const users = await getAllUsersService(dto.q);
      res.status(200).json({ users });
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static getUser = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;

      const user = await getByIdUserService(userId);
      if (user) {
        res.status(200).json({ user });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

export default UserController;
