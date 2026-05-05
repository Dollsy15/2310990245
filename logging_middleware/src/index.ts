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

export const getLogger = (): Logger => {
  return {
    info: async (module, layer, message, meta) => {},
    error: async (module, layer, message, meta) => {},
    warn: async (module, layer, message, meta) => {},
    debug: async (module, layer, message, meta) => {},
    fatal: async (module, layer, message, meta) => {},
  };
};

export const initializeLogger = () => {};

export const getConfig = () => ({
  clientID: "ce95a206-3bb3-4260-a058-7b90197810c1",
  clientSecret: "TnZSVKdahkKKeJNG",
  apiBaseURL: "http://20.207.122.201/evaluation-service",
});
