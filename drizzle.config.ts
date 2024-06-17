import 'dotenv/config'; // make sure to install dotenv package
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
    dialect: 'postgresql',
    out: './src/drizzle',
    schema: './src/drizzle/schema.ts',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
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