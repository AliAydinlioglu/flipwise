const settings = {
  env: process.env.NODE_ENV,
  log: {
    level: process.env.LOG_LEVEL || "info",
    disabled: false,
  },
  cors: {
    origins: ["http://localhost:5173", "https://frontend-2425-aliaydinlioglu.onrender.com"],
    maxAge: 3 * 60 * 60,
  },
  database: {
    client: "mysql2",
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT || "3306", 10),
    name: process.env.DATABASE_NAME || "flashcard_prod",
    username: process.env.DATABASE_USERNAME || "root",
    password: process.env.DATABASE_PASSWORD || "root",
  },
  auth: {
    argon: {
      saltLength: 16,
      hashLength: 32,
      timeCost: 6,
      memoryCost: 2 ** 17,
    },
    jwt: {
      secret: process.env.JWTSECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || 86400,
    },
  },
  PORT: parseInt(process.env.PORT || "9000", 10),
};

export default settings;
