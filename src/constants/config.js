// Server Configuration
export const app = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV
};

// PostgreSQL Configuration
export const db = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: process.env.DB_CONNECTION_LIMIT,
  logging: process.env.DB_LOGGING === 'true'
};

// CORS Configuration
export const allowedOriginsURL = process.env.ALLOWED_ORIGINS.split(',');

// Logging Configuration
export const log = {
  level: process.env.LOG_LEVEL || 'info',
  duration: process.env.LOG_DURATION || '14d',
  channel: process.env.LOG_CHANNEL || 'console'
};
