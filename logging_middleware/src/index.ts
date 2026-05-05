export type LogMeta = Record<string, any>;

export type Logger = {
  info: (
    module: string,
    layer: string,
    message: string,
    meta?: LogMeta,
  ) => Promise<void>;
  error: (
    module: string,
    layer: string,
    message: string,
    meta?: LogMeta,
  ) => Promise<void>;
  warn: (
    module: string,
    layer: string,
    message: string,
    meta?: LogMeta,
  ) => Promise<void>;
  debug: (
    module: string,
    layer: string,
    message: string,
    meta?: LogMeta,
  ) => Promise<void>;
  fatal: (
    module: string,
    layer: string,
    message: string,
    meta?: LogMeta,
  ) => Promise<void>;
};

const log = (
  level: string,
  module: string,
  layer: string,
  message: string,
  meta?: LogMeta,
) => {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      module,
      layer,
      message,
      meta,
    }),
  );
};

export const getLogger = (): Logger => {
  return {
    info: async (m, l, msg, meta) => log("info", m, l, msg, meta),
    error: async (m, l, msg, meta) => log("error", m, l, msg, meta),
    warn: async (m, l, msg, meta) => log("warn", m, l, msg, meta),
    debug: async (m, l, msg, meta) => log("debug", m, l, msg, meta),
    fatal: async (m, l, msg, meta) => log("fatal", m, l, msg, meta),
  };
};

export const initializeLogger = (config?: any) => {
  if (config) {
    console.log("Logger initialized with config:", config);
  }
};

export const getConfig = () => ({
  clientID: "ce95a206-3bb3-4260-a058-7b90197810c1",
  clientSecret: "TnZSVKdahkKKeJNG",
  apiBaseURL: "http://20.207.122.201/evaluation-service",
});
