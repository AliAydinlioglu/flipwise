// This file maps environment variable names to config paths
// It's used by the 'config' library to override values from environment variables
// Note: With the updated config files, we're now directly using process.env
// but keeping this for reference and potential future use

const settings = {
  env: "NODE_ENV",
  PORT: "PORT",
  database: {
    host: "DATABASE_HOST",
    port: "DATABASE_PORT",
    name: "DATABASE_NAME",
    username: "DATABASE_USERNAME",
    password: "DATABASE_PASSWORD",
  },
  auth: {
    jwt: {
      secret: "JWTSECRET",
      expiresIn: "JWT_EXPIRES_IN",
    },
  },
  log: {
    level: "LOG_LEVEL",
    disabled: "DISABLE_LOGGING",
  },
  cors: {
    origins: "CORS_ORIGINS",
  },
  frontend: {
    url: "FRONTEND_URL",
  },
};

export default settings;
