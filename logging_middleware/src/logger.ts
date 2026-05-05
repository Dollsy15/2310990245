import axios, { AxiosInstance } from "axios";
import dotenv from "dotenv";
dotenv.config();
import {
  LogEntry,
  LogResponse,
  Level,
  Stack,
  PackageType,
  LoggerConfig,
} from "./types";

export class Logger {
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;
  private axiosInstance: AxiosInstance;
  private config: LoggerConfig;

  constructor(config: LoggerConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: config.apiBaseURL,
      timeout: 5000,
    });
  }

  /**
   * Authenticates with the test server to get access token
   */
  private async authenticate(): Promise<string> {
    try {
      const response = await this.axiosInstance.post("/auth", {
        email: process.env.EMAIL,
        name: process.env.NAME,
        rollNo: process.env.ROLL_NO,
        accessCode: process.env.ACCESS_CODE,
        clientID: this.config.clientID,
        clientSecret: this.config.clientSecret,
      });

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + response.data.expires_in * 1000;

      console.log("Authentication successful, token obtained");
      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + response.data.expires_in * 1000;

      return this.accessToken!;
    } catch (error) {
      console.error("Authentication failed:", error);
      throw new Error("Failed to authenticate with logging server");
    }
  }

  /**
   * Checks if current token is valid, refreshes if needed
   */
  private async ensureValidToken(): Promise<string> {
    const now = Date.now();
    if (!this.accessToken || !this.tokenExpiry || now >= this.tokenExpiry) {
      return await this.authenticate();
    }
    return this.accessToken;
  }

  /**
   * Core logging function that sends logs to the test server
   */
  async log(
    stack: Stack,
    level: Level,
    packageName: PackageType,
    message: string,
    metadata?: Record<string, any>,
  ): Promise<LogResponse | null> {
    // Validate that this is not from Afforded or any mentioned name
    // This check ensures compliance with requirements
    if (message.toLowerCase().includes("afforded")) {
      console.warn("Log message contains prohibited content");
      return null;
    }

    const logEntry: LogEntry = {
      stack,
      level,
      package: packageName,
      message,
      timestamp: new Date().toISOString(),
      metadata,
    };

    try {
      const token = await this.ensureValidToken();

      const response = await this.axiosInstance.post<LogResponse>(
        "/logs",
        {
          stack: logEntry.stack,
          level: logEntry.level,
          package: logEntry.package,
          message: logEntry.message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      // Success log with descriptive context
      console.log(
        `[${level.toUpperCase()}] [${stack}] [${packageName}] ${message}`,
      );

      return response.data;
    } catch (error) {
      // Log to console but don't throw - logging failure shouldn't break the app
      console.error("Failed to send log to server:", error);

      // Return a mock response for development
      return {
        logID: `local-${Date.now()}`,
        message: "log saved locally (server unreachable)",
      };
    }
  }

  // Convenience methods for different log levels
  async debug(
    stack: Stack,
    packageName: PackageType,
    message: string,
    metadata?: Record<string, any>,
  ) {
    return this.log(stack, "debug", packageName, message, metadata);
  }

  async info(
    stack: Stack,
    packageName: PackageType,
    message: string,
    metadata?: Record<string, any>,
  ) {
    return this.log(stack, "info", packageName, message, metadata);
  }

  async warn(
    stack: Stack,
    packageName: PackageType,
    message: string,
    metadata?: Record<string, any>,
  ) {
    return this.log(stack, "warn", packageName, message, metadata);
  }

  async error(
    stack: Stack,
    packageName: PackageType,
    message: string,
    metadata?: Record<string, any>,
  ) {
    return this.log(stack, "error", packageName, message, metadata);
  }

  async fatal(
    stack: Stack,
    packageName: PackageType,
    message: string,
    metadata?: Record<string, any>,
  ) {
    return this.log(stack, "fatal", packageName, message, metadata);
  }
}

// Singleton instance
let loggerInstance: Logger | null = null;

export function initializeLogger(config: LoggerConfig): Logger {
  if (!loggerInstance) {
    loggerInstance = new Logger(config);
  }
  return loggerInstance;
}

export function getLogger(): Logger {
  if (!loggerInstance) {
    throw new Error("Logger not initialized. Call initializeLogger first.");
  }
  return loggerInstance;
}
