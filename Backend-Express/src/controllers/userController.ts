import { Request, Response } from "express";
import { createUserService, getAllUsersService, getByIdUserService } from "../services/userService";
import { plainToInstance } from "class-transformer";
import { CreateUserDto } from "../dto/user/createUser.dto";
import { validate } from "class-validator";

// Controller to get all users
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await getAllUsersService();
        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Controller to get a user by ID
export const getUserById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    try {
        const user = await getByIdUserService(id);
        if (user) {
            res.status(200).json({ user });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const createUser = async (req: Request, res: Response) => {
    const dto = plainToInstance(CreateUserDto, req.body);

    const errors = await validate(dto);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const user = await createUserService(dto);
        res.status(201).json({ user });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};