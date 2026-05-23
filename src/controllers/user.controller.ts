import { Request, Response, NextFunction } from "express";
import { userService } from "../services/users.service";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await userService.register(req.body);

    res.status(201).json({
      success: true,
      data: user,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
};
