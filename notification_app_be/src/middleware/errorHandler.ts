import { Request, Response, NextFunction } from "express";
import { getLogger } from "logging-middleware";

export const errorHandler = async (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const logger = getLogger();

  // Log the error with fatal level for critical errors
  await logger.fatal(
    "backend",
    "middleware",
    `Unhandled error occurred: ${error.message}`,
    {
      stack: error.stack,
      path: req.path,
      method: req.method,
      ip: req.ip,
    },
  );

  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
};
