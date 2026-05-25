import { Router } from "express";
import { AppError, ERROR_CODES } from "../types/response.types";
import { file } from "zod";

const router = Router();

router.get("/test-error", (req, res) => {
  throw AppError.validation("This is a test error", {
    test: "additional details",
  });
});

export default router;
