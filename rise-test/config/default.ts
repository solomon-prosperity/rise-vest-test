import dotenv from "dotenv";
dotenv.config();

interface AppConfig {
  // APP
  httpPort: string | undefined;
  env: string | undefined;

  // PSQL DB
  psqlPort: string | undefined;
  psqlHost: string | undefined;
  psqlDatabaseName: string | undefined;
  psqlTestDatabaseName: string | undefined;
  psqlUsername: string | undefined;
  psqlPassword: string | undefined;
  psqlDatabaseUri: string | undefined;

  // JWT
  jwtSecret: string | undefined;
}

const config: AppConfig = {
  // APP
  httpPort: process.env.PORT || process.env.HTTP_PORT,
  env: process.env.NODE_ENV,

  // PSQL DB
  psqlPort: process.env.PSQL_DATABASE_PORT,
  psqlHost: process.env.PSQL_DATABASE_HOST,
  psqlDatabaseName: process.env.PSQL_DATABASE_NAME,
  psqlTestDatabaseName: process.env.PSQL_TEST_DATABASE_NAME,
  psqlUsername: process.env.PSQL_DATABASE_USER,
  psqlPassword: process.env.PSQL_DATABASE_PASSWORD,
  psqlDatabaseUri: process.env.PSQL_DATABASE_URI,

  // JWT
  jwtSecret: process.env.JWT_SECRET,
};

export default config;
