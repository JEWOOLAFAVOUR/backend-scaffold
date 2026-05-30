import { Router } from "express";
import { loginUserSchema } from "../validators/auth.validator";
import { loginUser } from "../controllers/auth.controller";
import { loginLimiter } from "../config/rateLimit";
import { validate } from "../middlewares/validate";

const router = Router();

router.post(
  "/login",
  loginLimiter,
  validate(loginUserSchema, "Login body must contain only email and password"),
  loginUser,
);

export default router;
