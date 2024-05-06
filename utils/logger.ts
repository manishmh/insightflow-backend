import winston from 'winston';
import chalk from 'chalk';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ level, message, timestamp }) => {
            const color = level === 'error' ? chalk.red :
                          level === 'warn' ? chalk.yellow :
                          chalk.white;
            return `${timestamp} [${color(level.toUpperCase())}] ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

export default logger;
