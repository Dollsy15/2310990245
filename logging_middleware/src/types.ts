export type Stack = "backend" | "frontend";
export type Level = "debug" | "info" | "warn" | "error" | "fatal";

// Backend-specific packages
export type BackendPackage =
  | "cache"
  | "controller"
  | "cron_job"
  | "db"
  | "domain"
  | "handler"
  | "repository"
  | "route"
  | "service";

// Frontend-specific packages
export type FrontendPackage =
  | "api"
  | "component"
  | "hook"
  | "page"
  | "state"
  | "style";

// Shared packages
export type SharedPackage = "auth" | "config" | "middleware" | "utils";

export type PackageType = BackendPackage | FrontendPackage | SharedPackage;

export interface LogEntry {
  stack: Stack;
  level: Level;
  package: PackageType;
  message: string;
  timestamp?: string;
  metadata?: Record<string, any>;
}

export interface LogResponse {
  logID: string;
  message: string;
}

export interface LoggerConfig {
  clientID: string;
  clientSecret: string;
  accessToken?: string;
  tokenExpiry?: number;
  apiBaseURL: string;
}
