/*import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 1 minute)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({ error: 'Too many requests, slow down!' })
  }
})

export default limiter*/

import { rateLimit } from 'express-rate-limit'
import logger from './logger'

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 100, // 100 requests per minute per IP
  standardHeaders: true, // Use `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn(
      `Rate limit exceeded for IP: ${req.ip} - ${req.method} ${req.originalUrl}`
    )
    res.status(429).json({
      error: 'Too many requests, slow down!'
    })
  }
})

export default limiter
