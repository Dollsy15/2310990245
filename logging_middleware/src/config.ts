import dotenv from "dotenv";
dotenv.config();

export interface Config {
  clientID: string;
  clientSecret: string;
  apiBaseURL: string;
}

export const getConfig = (): Config => {
  return {
    clientID: process.env.CLIENT_ID || "",
    clientSecret: process.env.CLIENT_SECRET || "",
    apiBaseURL:
      process.env.API_BASE_URL || "http://20.207.122.201/evaluation-service",
  };
};
