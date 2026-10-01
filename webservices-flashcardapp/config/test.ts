const settings = {
  env: process.env.NODE_ENV,
  log: {
    level: "error",
    disabled: process.env.DISABLE_LOGGING === "true",
  },
  cors: {
    origins: [
      "http://localhost:9000", // backend server for testing
      "http://localhost:5173", // frontend development server
    ],
    maxAge: 3 * 60 * 60,
  },
  database: {
    client: "mysql2",
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT || "3306", 10),
    name: process.env.DATABASE_NAME || "flashcard_test",
    username: process.env.DATABASE_USERNAME || "root",
    password: process.env.DATABASE_PASSWORD || "root",
  },
  auth: {
    argon: {
      saltLength: 16,
      hashLength: 32,
      timeCost: 4,
      memoryCost: 2 ** 16,
    },
    jwt: {
      secret: process.env.JWTSECRET || "test-jwt-secret",
      expiresIn: 3600,
    },
  },
  PORT: parseInt(process.env.PORT || "9001", 10),
};

export default settings;
