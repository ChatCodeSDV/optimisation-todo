import { createClient } from 'redis'
import { Todo } from '../models/todo.model'
import { getTodosFromDb } from './postgres'
import logger from '../middleware/logger'
import dotenv from 'dotenv'
dotenv.config() // Load environment variables from .env file

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'redis',
    port: Number(process.env.REDIS_PORT) || 6379
  }
})

redisClient.on('error', (err) => {
  logger.error('Redis error:', err)
})

const instanceId = process.env.INSTANCE_ID ?? '1' // Unique instance ID for this server

redisClient.connect().then(() => {
  logger.info(`Connected instance n°${instanceId} to Redis.`)
})

export default redisClient

// Redis keys
const TODOS_CACHE_KEY = 'todos:all'

export async function getTodos(): Promise<Todo[]> {
  // Try to get from Redis cache
  const cached = await redisClient.get(TODOS_CACHE_KEY)
  if (cached) {
    return JSON.parse(cached) as Todo[]
  }
  // If not in cache, get from DB and cache it
  const todos = await getTodosFromDb()
  await redisClient.set(TODOS_CACHE_KEY, JSON.stringify(todos))
  return todos
}

export async function deleteTodos(): Promise<void> {
  await redisClient.del(TODOS_CACHE_KEY)
}
