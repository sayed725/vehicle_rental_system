import { Pool } from "pg";
import config from ".";


// Neon database connection string taken from .env


export const pool = new Pool({
  connectionString: `${config.connection_str}`,
});

const initDB = async () => {

    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
        );
        `)
}

export default initDB;

