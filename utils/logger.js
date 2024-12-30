import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file'; // Enable log rotation

// Determine the current environment
const isDevelopment = process.env.NODE_ENV === 'development';

// Create a daily rotating file transport
const dailyRotateTransport = new transports.DailyRotateFile({
    filename: 'logs/application-%DATE%.log', // Log file pattern
    datePattern: 'YYYY-MM-DD',              // Rotate daily
    maxFiles: '14d',                        // Keep logs for 14 days
    level: 'info',                          // Log info level and above for file
});

// Configure the logger
export const logger = createLogger({
    level: isDevelopment ? 'debug' : 'info', // Log level based on environment
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp
        format.errors({ stack: true }),                    // Include error stack trace
        format.json()                                      // Use JSON format for logs
    ),
    transports: [
        // Console transport
        new transports.Console({
            format: isDevelopment
                ? format.combine(format.colorize(), format.simple()) // Colorful and simple for dev
                : format.combine(format.timestamp(), format.json()), // JSON format for production
        }),
        dailyRotateTransport, // Add daily rotating file transport
    ],
});

export default logger;
