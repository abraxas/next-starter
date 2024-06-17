import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, Client } from 'pg';

export const pool = new Pool()


import * as schema from './schema';
//import {relations} from "./relations";
// export const client = new Client({
//     connectionString: process.env.DATABASE_URL,
// });
// { schema } is used for relational queries
//export const db = drizzle(pool, { schema: {...schema, ...relations} });
export const db = drizzle(pool, { schema });