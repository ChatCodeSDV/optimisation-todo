import { Queue } from 'bullmq'
import logger from '../middleware/logger'
import { config } from 'dotenv'
config() // Load environment variables from .env file

const reportQueue = new Queue('reportQueue', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost', // Redis host from environment variable or default to localhost
    port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379 // Redis port from environment variable or default to 6379
  }
})

export async function addReportTask(taskData: {
  userId: number
  reportType: string
}) {
  try {
    await reportQueue.add('generateReport', taskData)
    logger.info(`Task added to queue: ${JSON.stringify(taskData)}`)
  } catch (error) {
    logger.error(`Failed to add report task to queue: ${error}`)
    throw error
  }
}

export async function addCreateTodoTask(title: string, description?: string) {
  try {
    await reportQueue.add('createTodo', { title, description })
    logger.info(`CreateTodo task added to queue: ${title}`)
  } catch (error) {
    logger.error(`Failed to add createTodo task to queue: ${error}`)
    throw error
  }
}

export async function addMarkTodoDoneTask(id: number) {
  try {
    await reportQueue.add('markTodoDone', { id })
    logger.info(`MarkTodoDone task added to queue: ${id}`)
  } catch (error) {
    logger.error(`Failed to add markTodoDone task to queue: ${error}`)
    throw error
  }
}

export async function addDeleteTodoTask(todoId: number) {
  try {
    await reportQueue.add('deleteTodo', { todoId })
    logger.info(`DeleteTodo task added to queue: ${todoId}`)
  } catch (error) {
    logger.error(`Failed to add deleteTodo task to queue: ${error}`)
    throw error
  }
}

export default reportQueue
