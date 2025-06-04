import { createLogger, format, transports } from 'winston'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config() // Load environment variables from .env file

const instanceId = process.env.INSTANCE_ID ?? '1' // Unique instance ID for this server

process.on('SIGINT', () => {
  logger.info('Received SIGINT (PM2 stop/restart signal)')
  process.exit()
})

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM (PM2 stop/restart signal)')
  process.exit()
})
// Ensure the logs directory exists
const logDir =
  process.env.NODE_ENV === 'production'
    ? process.env.LOG_DIR || '/tmp/logs' // Use /tmp/logs for production
    : path.join(__dirname, '../../logs') // Use local logs directory for development

console.log(`Log directory: ${logDir}`)
if (!fs.existsSync(logDir)) {
  console.log(`Creating log directory: ${logDir}`)
  fs.mkdirSync(logDir, { recursive: true })
}
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format((info) => {
      info.instance = instanceId
      return info
    })(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple())
    }),
    new transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error'
    }),
    new transports.File({ filename: path.join(logDir, 'combined.log') })
  ]
})

// If we're not in production, log to the console with a simple format
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple())
    })
  )
}

export default logger
