import { createClient } from 'redis'

const redisClient = createClient()

redisClient.on('error', (err) => {
  console.error('Redis error:', err)
})

redisClient.connect().then(() => {
  console.log('Connected to Redis.')
})

export default redisClient
