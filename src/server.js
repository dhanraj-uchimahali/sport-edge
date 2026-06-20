import http from 'http';
import app from './app.js';
import { logger } from './utils/logger.js';
import { app as application } from './constants/config.js';
import sequelize from './db/postgresql.js';
import { attachWebsocketServer } from './ws/server.js';

const PORT = application.port || 3000;

const httpServer = http.createServer(app);

const server = httpServer.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}.`);
  console.log(`Websocket server is running at port: ws://localhost:${PORT}/ws`)
});

attachWebsocketServer(server);

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
 