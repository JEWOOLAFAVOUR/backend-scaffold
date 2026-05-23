import { registerUser } from "../controllers/user.controller";
import { Router } from "express";
import { validate } from "../middlewares/validate";
import { createUserSchema } from "../validators/user.validator";

const router = Router();

router.post("/users", validate(createUserSchema), registerUser);

export default router;
