import { createClient } from 'redis'
import { Todo } from '../models/todo.model'
import {
  getTodosFromDb,
  createTodoInDb,
  markTodoDoneInDb,
  deleteTodoInDb
} from './sqlite'

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'redis',
    port: Number(process.env.REDIS_PORT) || 6379
  }
})

redisClient.on('error', (err) => {
  console.error('Redis error:', err)
})

redisClient.connect().then(() => {
  console.log('Connected to Redis.')
})

export default redisClient

// Redis keys
const TODOS_CACHE_KEY = 'todos:all'

export async function getTodos(): Promise<Todo[]> {
  // Try to get from Redis cache
  const cached = await redisClient.get(TODOS_CACHE_KEY)
  if (cached) {
    const cachedStr = typeof cached === 'string' ? cached : cached.toString()
    return JSON.parse(cachedStr) as Todo[]
  }
  // If not in cache, get from DB and cache it
  const todos = await getTodosFromDb()
  await redisClient.set(TODOS_CACHE_KEY, JSON.stringify(todos))
  return todos
}

export async function createTodo(
  title: string,
  description?: string
): Promise<Todo> {
  const todo = await createTodoInDb(title, description ?? undefined)
  // Invalidate cache
  await redisClient.del(TODOS_CACHE_KEY)
  return todo
}

export async function markTodoDone(id: number): Promise<Todo | null> {
  const todo = await markTodoDoneInDb(id.toString())
  // Invalidate cache
  await redisClient.del(TODOS_CACHE_KEY)
  return todo
}

export async function deleteTodo(id: number): Promise<void> {
  // Delete from DB (not implemented in this snippet)
  await deleteTodoInDb(id.toString())
  // Invalidate cache
  await redisClient.del(TODOS_CACHE_KEY)
}
