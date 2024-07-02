import type { Request, Response } from "express";

export const HealthCheck = (req: Request, res: Response): void => {
  res.status(200).json({
    message: "OK",
  });
};
