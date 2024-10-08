import { createLogger, format, transports } from 'winston';

const logger = createLogger({
    level: 'verbose',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' })
    ]
})

export default logger