import app from './app.js';
import { logger } from './utils/logger.js';
import { app as application } from './constants/config.js';
import sequelize from './db/postgresql.js';


const PORT = application.port || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}.`);
});

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  process.exit(1);
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  server.close(() => {
    logger.info("HTTP server closed.");
    sequelize.close()
      .then(() => {
        logger.info("Database connection closed.");
        process.exit(0);
      })
      .catch((error) => {
        logger.error("Error closing database connection:", error);
        process.exit(1);
      });
  });
});
 