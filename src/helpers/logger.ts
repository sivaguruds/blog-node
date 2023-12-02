import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { format, createLogger, transports } = winston;
const { combine, timestamp, label, printf, prettyPrint } = format;
const CATEGORY = 'Custom format log';

// Using custom print format
const customFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const fileRotateTransport = new DailyRotateFile({
  filename: 'logs/rotate-%DATE%.log',
  datePattern: 'DD-MM-YYYY hh:mm a',
  maxFiles: '7d',
});

export const logger = winston.createLogger({
  level: 'debug',
  format: combine(
    label({ label: CATEGORY }),
    timestamp({
      format: 'DD-MM-YYYY hh:mm A',
    }),
    prettyPrint(),
    // customFormat,
  ),
  transports: [fileRotateTransport, new transports.Console()],
});
