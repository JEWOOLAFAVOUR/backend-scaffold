import express from "express";
import healthRoutes from "./routes/health.routes";
import testRoutes from "./routes/test.routes";
import userRoutes from "./routes/user.routes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());

app.use("/api/v1", healthRoutes);
app.use("/api/v1", testRoutes);
app.use("/api/v1", userRoutes);

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
