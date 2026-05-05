import dotenv from "dotenv";
import app from "./app";
import { initializeLogger, getLogger } from "logging-middleware";

dotenv.config();

const PORT = process.env.PORT || 3000;

// initialize logger
initializeLogger();

app.listen(PORT, async () => {
  const logger = getLogger();

  await logger.info(
    "backend",
    "server",
    "Server started successfully",
    {
      port: String(PORT),
      env: process.env.NODE_ENV || "development"
    }
  );

  console.log(`🚀 Server running on http://localhost:${PORT}`);
});