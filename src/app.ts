import express from "express";
import healthRoutes from "./routes/health.routes";
import testRoutes from "./routes/test.routes";
import authModule from "./modules/auth";
import {
  errorHandler,
  securityMiddleware,
  jsonBodyParser,
} from "./core/middleware";

const app = express();

app.use(securityMiddleware);
app.use(express.json(jsonBodyParser));

app.use("/api/v1", healthRoutes);
app.use("/api/v1", testRoutes);
app.use("/api/v1/auth", authModule);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "Endpoint not found",
    },
    path: req.path,
    timestamp: new Date().toISOString(),
  });
});
// app.use(healthRoutes);

app.use(errorHandler);

export default app;
