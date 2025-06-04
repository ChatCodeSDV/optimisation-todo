import { Request, Response, NextFunction } from 'express'
import redis from '../db/redis'

export const idempotencyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const key = req.headers['Idempotency-Key']

  // Only apply to POST/PATCH
  if (
    !key ||
    typeof key !== 'string' ||
    !['POST', 'PATCH'].includes(req.method)
  ) {
    return next()
  }

  const redisKey = `idempotency:${key}`

  try {
    const cached = await redis.get(redisKey)
    if (cached) {
      const parsed = JSON.parse(cached.toString())
      return res.status(parsed.status).set(parsed.headers).send(parsed.body)
    }
    // Hook to capture the response
    const originalSend = res.send.bind(res)

    res.send = (body: any): Response => {
      const status = res.statusCode
      const headers = res.getHeaders()

      // Cache response in Redis (10min TTL)
      redis.setex(
        redisKey,
        600, // 10min
        JSON.stringify({
          status,
          headers,
          body: typeof body === 'string' ? body : JSON.stringify(body)
        })
      )

      return originalSend(body)
    }

    next()
  } catch (err) {
    console.error('Idempotency middleware error:', err)
    next() // Do not block the request if Redis fails
  }
}
