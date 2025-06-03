import express, { Request, Response, Application } from 'express'
import dotenv from 'dotenv'
import todosRouter from './routes/todo'
import limiter from './middleware/rateLimiter'

dotenv.config()

const app: Application = express()
const host = process.env.HOST ?? 'localhost'
const port = process.env.PORT ? Number(process.env.PORT) : 3000

app.use(express.json()) // Middleware to parse JSON
app.use(limiter) // Apply rate limiting middleware
app.use('/api', todosRouter) // Mount the route

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server')
})

app.listen(port, () => {
  console.log(`Server is available at http://${host}:${port}`)
})
