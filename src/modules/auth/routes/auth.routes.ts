import { Router } from "express";
import { loginUserSchema } from "../validators/login.validator";
import { registerUserSchema } from "../validators/register.validator";
import { registerUser, loginUser } from "../controllers/auth.controller";
import { authLimiter, loginLimiter } from "../../../core/middleware";
import { validate } from "../../../core/middleware";
import { authenticate } from "../../../core/middleware";

const router = Router();

router.post(
  "/signup",
  authLimiter,
  validate(
    registerUserSchema,
    "Signup body must contain only email, first_name, last_name and password",
  ),
  registerUser,
);

router.post(
  "/login",
  loginLimiter,
  validate(loginUserSchema, "Login body must contain only email and password"),
  loginUser,
);

router.get("/me", authenticate, (req: any, res) => {
  res.status(200).json({
    success: true,
    data: { auth: req.auth },
    timestamp: new Date().toISOString(),
  });
});

export default router;
