import { createLogger, transports, format } from 'winston';
import 'winston-daily-rotate-file';
import { log } from '../constants/config.js'
import util from 'util';
import fs from 'fs';
import path from 'path';

const { combine, timestamp, json, errors, printf, colorize } = format;

// Helper: create a filter for specific log level
const filterOnly = (level) => format((info) => (info.level === level ? info : false))();

// Helper: ensure directory exists for a given file path
const ensureDir = (filePath) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const fileRotateTransport = (filePath, level = 'info', filter = null) =>
  new transports.DailyRotateFile({
    filename: `logs/${filePath}-%DATE%.json`,
    datePattern: 'YYYY-MM-DD',
    maxFiles: log.duration,
    zippedArchive: true,
    level,
    format: filter
      ? combine(filter, errors({ stack: true }), timestamp({ format: 'HH:mm:ss' }), json())
      : combine(errors({ stack: true }), timestamp({ format: 'HH:mm:ss' }), json())
  });

let loggerFormat = combine(errors({ stack: true }), timestamp({ format: 'HH:mm:ss' }), json());

const transport = [];
const exceptionTransport = [];
const rejectionTransport = [];

// Channel: Console logs
if (log.channel === 'console') {
  loggerFormat = combine(
    colorize(),
    printf(({ level, message, ...meta }) => {
      const formattedMessage = util.format(message, ...Object.values(meta));
      return `${level}: ${formattedMessage}`;
    })
  );
  transport.push(new transports.Console());
  exceptionTransport.push(new transports.Console());
  rejectionTransport.push(new transports.Console());
} else if (log.channel === 'daily') {
   // ✅ Only info, warn, etc. go here
   ensureDir('logs/app/log');
   transport.push(fileRotateTransport('app/log', 'info', format((info) => (info.level !== 'error' ? info : false))()));

   // ✅ Only errors go here
   ensureDir('logs/app/error');
   transport.push(fileRotateTransport('app/error', 'error', filterOnly('error')));

   // ✅ Separate exception and rejection logs
   ensureDir('logs/exception/auth-exception');
   exceptionTransport.push(fileRotateTransport('exception/auth-exception', 'error', filterOnly('error')));
   ensureDir('logs/rejection/auth-rejection');
   rejectionTransport.push(fileRotateTransport('rejection/auth-rejection', 'error', filterOnly('error')));
 }
else {
   // ✅ Fallback to fixed file logs
   ensureDir('logs/app-log.json');
   transport.push(
     new transports.File({
       filename: 'logs/app-log.json',
       level: 'info',
       format: format((info) => (info.level !== 'error' ? info : false))()
     })
   );
   ensureDir('logs/app-error.json');
   transport.push(
     new transports.File({
       filename: 'logs/app-error.json',
       level: 'error',
       format: filterOnly('error')
     })
   );
   ensureDir('logs/exception/auth-exception.json');
   exceptionTransport.push(new transports.File({ filename: 'logs/exception/auth-exception.json', level: 'error' }));
   ensureDir('logs/rejection/auth-rejection.json');
   rejectionTransport.push(new transports.File({ filename: 'logs/rejection/auth-rejection.json', level: 'error' }));
 }

export const logger = createLogger({
   level: log.level,
   format: loggerFormat,
   transports: transport,
   exceptionHandlers: exceptionTransport,
   rejectionHandlers: rejectionTransport
});
 