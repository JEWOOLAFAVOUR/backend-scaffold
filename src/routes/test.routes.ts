import { Router } from "express";
import { AppError } from "../types/response.types";

const router = Router();

router.get("/test-error", (req, res) => {
  throw new AppError("This is a test error", "TEST_ERROR", 400);
});

export default router;
