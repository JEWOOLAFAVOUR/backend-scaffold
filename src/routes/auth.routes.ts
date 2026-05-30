import { Router } from "express";
import { loginUserSchema } from "../validators/auth.validator";
import { loginUser } from "../controllers/auth.controller";
import { loginLimiter } from "../config/rateLimit";
import { validate } from "../middlewares/validate";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.post(
  "/login",
  loginLimiter,
  validate(loginUserSchema, "Login body must contain only email and password"),
  loginUser,
);

// router.get("/me", authenticate, (req: any, res) => {
//   res.status(200).json({
//     success: true,
//     data: { auth: req.auth },
//     timestamp: new Date().toISOString(),
//   });
// });

export default router;
