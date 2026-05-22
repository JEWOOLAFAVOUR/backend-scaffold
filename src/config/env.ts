import dotenv from "dotenv";

dotenv.config();

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value || defaultValue!;
};

export const config = {
  PORT: parseInt(getEnv("PORT", "8080"), 10),
  NODE_ENV: getEnv("NODE_ENV", "development"),
  isDevelopment: getEnv("NODE_ENV", "development") === "development",
  isProduction: getEnv("NODE_ENV", "development") === "production",
  DATABASE_URL: getEnv("DATABASE_URL"),
};
