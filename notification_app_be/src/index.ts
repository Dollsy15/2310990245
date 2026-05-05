import dotenv from "dotenv";
import app from "./app";
import { initializeLogger, getLogger, getConfig } from "logging-middleware";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Initialize logger (NO ARGUMENTS)
initializeLogger();

// Start server
app.listen(PORT, async () => {
  const logger = getLogger();

  await logger.info("backend", "config", `Server started on port ${PORT}`, {
    port: String(PORT),
    environment: process.env.NODE_ENV || "development",
  });

  console.log(`Server running on http://localhost:${PORT}`);
});
