import { Queue } from 'bullmq'
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
  await reportQueue.add('generateReport', taskData)
  console.log(`Task added to queue: ${JSON.stringify(taskData)}`)
}

export async function addCreateTodoTask(title: string, description?: string) {
  await reportQueue.add('createTodo', { title, description })
  console.log(`CreateTodo task added to queue: ${title}`)
}

export async function addMarkTodoDoneTask(id: number) {
  await reportQueue.add('markTodoDone', { id })
  console.log(`MarkTodoDone task added to queue: ${id}`)
}

export async function addDeleteTodoTask(todoId: number) {
  await reportQueue.add('deleteTodo', { todoId })
  console.log(`DeleteTodo task added to queue: ${todoId}`)
}

export default reportQueue
