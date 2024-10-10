import { Pool, PoolClient } from "pg";
import config from "../../../config/default";
let pool: Pool | null = null;

export const connectPsqlDB = async (): Promise<PoolClient> => {
  const {
    psqlDatabaseName,
    psqlTestDatabaseName,
    psqlPassword,
    psqlUsername,
    psqlHost,
    psqlPort,
    env,
  } = config;

  if (!pool) {
    pool = new Pool({
      user: psqlUsername,
      host: psqlHost,
      database: env === "test" ? psqlTestDatabaseName : psqlDatabaseName,
      password: psqlPassword,
      port: Number(psqlPort),
    });

    // Create tables when the pool is created
    await createTables();
  }

  try {
    console.log("Connecting to PostgreSQL...");
    const client = await pool.connect();
    console.log("Connected to PostgreSQL!");
    return client;
  } catch (error) {
    console.error("Could not connect to PostgreSQL", error);
    throw error;
  }
};

const createTables = async () => {
  const client = await pool?.connect();
  try {
    await client?.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR NOT NULL,
        gender VARCHAR NOT NULL,
        created_on TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS posts (
        postId SERIAL PRIMARY KEY,
        userId INT REFERENCES users(id) ON DELETE CASCADE,
        post TEXT NOT NULL,
        created_on TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_on TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS comments (
        commentId SERIAL PRIMARY KEY,
        postId INT REFERENCES posts(postId) ON DELETE CASCADE,
        userId INT REFERENCES users(id) ON DELETE CASCADE,
        comment TEXT NOT NULL,
        created_on TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    if (client) {
      client.release(); // Ensure the client is released back to the pool
    }
  }
};

export const closePsqlConnection = async (): Promise<void> => {
  if (pool) {
    try {
      console.log("Closing PostgreSQL connection...");
      await pool.end(); // Closes all clients in the pool
      console.log("PostgreSQL connection closed.");
    } catch (error) {
      console.error("Error closing PostgreSQL connection:", error);
      throw error;
    } finally {
      pool = null; // Set the pool to null after closing
    }
  }
};
