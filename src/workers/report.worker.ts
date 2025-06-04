import { Worker } from 'bullmq'
import {
  createTodoInDb,
  markTodoDoneInDb,
  deleteTodoInDb
} from '../db/postgres'

const reportWorker = new Worker(
  'reportQueue',
  async (job) => {
    console.log(`Processing job: ${job.name}`)

    switch (job.name) {
      case 'createTodo': {
        const { title, description } = job.data
        const newTodo = await createTodoInDb(title, description)
        console.log('Todo created:', newTodo)
        break
      }

      case 'markTodoDone': {
        const { id } = job.data
        const updatedTodo = await markTodoDoneInDb(id)
        console.log('Todo marked as done:', updatedTodo)
        break
      }

      case 'deleteTodo': {
        const { todoId } = job.data
        await deleteTodoInDb(todoId)
        console.log(`Todo with ID ${todoId} deleted`)
        break
      }

      default:
        console.error(`Unknown job type: ${job.name}`)
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379
    }
  }
)

reportWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`)
})

reportWorker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err)
})
