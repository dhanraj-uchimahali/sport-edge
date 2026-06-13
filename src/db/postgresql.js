import { Sequelize } from "sequelize";
import { db } from '../constants/config.js';
import { logger } from '../utils/logger.js';


// Initialize Sequelize instance with MySQL connection config
const sequelize = new Sequelize(db.database, db.user, db.password, {
  host: db.host,
  port: db.port,
  dialect: db.dialect,
  pool: {
    max: Number.parseInt(db.connectionLimit),
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: { ssl: { require: true } },
  retry: { max: 3 },
  logging: db.logging
});

sequelize.authenticate()
  .then(() => {
    logger.info("Database connection has been established successfully.")
    console.log("Database connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Database connection/sync failed:", error);
    logger.error('Database connection/sync failed:', { error });
    process.exit(1);
  });

export default sequelize;
