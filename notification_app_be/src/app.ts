import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { getLogger, initializeLogger, Logger } from "logging-middleware";
import notificationRoutes from "./routes/notificationRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use(async (req: Request, res: Response, next: NextFunction) => {
  const logger = getLogger();
  const startTime = Date.now();

  // Log incoming request
  await logger.info(
    "backend",
    "middleware",
    `Incoming ${req.method} request to ${req.path}`,
    {
      method: req.method,
      path: req.path,
      query: req.query,
      ip: req.ip,
    },
  );

  // Capture response
  const originalSend = res.send;
  res.send = function (body: any): any {
    const responseTime = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Log response
    if (statusCode >= 400) {
      logger.error(
        "backend",
        "middleware",
        `Request failed: ${req.method} ${req.path} - ${statusCode}`,
        {
          statusCode,
          responseTime,
          errorBody: body,
        },
      );
    } else {
      logger.info(
        "backend",
        "middleware",
        `Request completed: ${req.method} ${req.path} - ${statusCode}`,
        {
          statusCode,
          responseTime,
        },
      );
    }

    return originalSend.call(this, body);
  };

  next();
});

// Routes
app.use("/api/notifications", notificationRoutes);

// Health check endpoint
app.get("/health", async (req: Request, res: Response) => {
  const logger = getLogger();
  await logger.info("backend", "controller", "Health check endpoint called");
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

export default app;
