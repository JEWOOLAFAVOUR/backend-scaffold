import { registerUser } from "../controllers/user.controller";
import { Router } from "express";
import { validate } from "../middlewares/validate";
import { createUserSchema } from "../validators/user.validator";
import { authLimiter } from "../config/rateLimit";

const router = Router();

router.post("/users", authLimiter, validate(createUserSchema), registerUser);

export default router;
