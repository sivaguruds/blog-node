"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const { format, createLogger, transports } = winston_1.default;
const { combine, timestamp, label, printf, prettyPrint } = format;
const CATEGORY = 'Custom format log';
// Using custom print format
const customFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});
const fileRotateTransport = new winston_daily_rotate_file_1.default({
    filename: 'logs/rotate-%DATE%.log',
    datePattern: 'DD-MM-YYYY hh:mm a',
    maxFiles: '7d',
});
exports.logger = winston_1.default.createLogger({
    level: 'debug',
    format: combine(label({ label: CATEGORY }), timestamp({
        format: 'DD-MM-YYYY hh:mm A',
    }), prettyPrint()),
    transports: [fileRotateTransport, new transports.Console()],
});
