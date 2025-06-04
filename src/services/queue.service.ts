import { Queue } from 'bullmq'

const reportQueue = new Queue('reportQueue', {
  connection: {
    host: 'localhost',
    port: 6379 // Redis connection
  }
})

export async function addReportTask(taskData: {
  userId: number
  reportType: string
}) {
  await reportQueue.add('generateReport', taskData)
  console.log(`Task added to queue: ${JSON.stringify(taskData)}`)
}

export default reportQueue
