import { Request, Response } from "express";

export const listAuditLogs = (_req: Request, res: Response): void => {
  res.status(501).json({
    success: false,
    error: {
      code: "NOT_IMPLEMENTED",
      message: "Audit module is scaffolded but not implemented yet",
    },
    timestamp: new Date().toISOString(),
  });
};
