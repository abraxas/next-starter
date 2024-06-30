import "dotenv/config"; // make sure to install dotenv package
import { defineConfig } from "drizzle-kit";
import { serverContainer } from "@/services/serverContainer";
import { TYPES } from "@/services/types";
import ServerConfig from "@/services/server/ServerConfig";

const serverConfig = serverContainer.get<ServerConfig>(TYPES.ServerConfig);

export default defineConfig({
  dialect: "postgresql",
  out: "./src/drizzle",
  schema: "./src/drizzle/schema.ts",
  dbCredentials: {
    url: serverConfig.databaseUrl!,
  },
  // dbCredentials: {
  //     host: process.env.DB_HOST!,
  //     port: Number(process.env.DB_PORT!),
  //     user: process.env.DB_USERNAME!,
  //     password: process.env.DB_PASSWORD!,
  //     database: process.env.DB_NAME!,
  // },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
});
