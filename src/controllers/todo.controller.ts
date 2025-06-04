import { Request, Response, NextFunction } from 'express'
import { getTodos, createTodo, markTodoDone, deleteTodo } from '../db/redis'
import {
  addCreateTodoTask,
  addMarkTodoDoneTask,
  addDeleteTodoTask
} from '../services/queue.service'
import logger from '../middleware/logger'

export const postTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title } = req.body
    const description = req.body.description ?? ''
    logger.info(`POST /todos - Title: ${title}`)
    if (!title) {
      logger.warn('POST /todos - Missing title') // Log a warning
      res.status(400).json({ error: 'Title is required' })
      return
    }

    // Add to cache immediately
    const todo = await createTodo(title, description)

    // Add task to queue for PostgreSQL
    await addCreateTodoTask(title, description)
    logger.info(`Todo created: ${JSON.stringify(todo)}`) // Log success
    res.status(201).json({ message: 'Todo created in cache', todo })
  } catch (err) {
    logger.error(`Error in POST /todos: ${err.message}`) // Log the error
    next(err)
  }
}

export const getTodosList = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    logger.info('GET /todos - Fetching todos') // Log the request
    const todos = await getTodos()
    res.json(todos)
  } catch (err) {
    logger.error(`Error in GET /todos: ${err.message}`) // Log the error
    next(err)
  }
}

export const patchTodoDone = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    logger.info(`PATCH /todos/${req.params.id} - Marking as done`) // Log the request
    const id = parseInt(req.params.id, 10)
    if (isNaN(id)) {
      logger.warn(`PATCH /todos/${req.params.id} - Invalid ID`) // Log a warning
      res.status(400).json({ error: 'Invalid ID' })
      return
    }

    // Update cache immediately
    const todo = await markTodoDone(id)
    if (!todo) {
      logger.warn(`Todo with ID ${id} not found in cache`) // Log a warning
      res.status(404).json({ error: 'Todo not found in cache' })
      return
    }

    // Add task to queue for PostgreSQL
    await addMarkTodoDoneTask(id)

    logger.info(`Todo with ID ${id} marked as done in cache`) // Log success
    res.status(200).json({ message: 'Todo marked as done in cache', todo })
  } catch (err) {
    next(err)
  }
}

export const deleteTodoController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10)
    logger.info(`DELETE /todos/${req.params.id} - ID: ${id}`) // Log the request
    if (isNaN(id)) {
      logger.warn(`DELETE /todos/${req.params.id} - Invalid ID`) // Log a warning
      res.status(400).json({ error: 'Invalid ID' })
      return
    }

    // Delete from cache immediately
    await deleteTodo(id)

    // Add task to queue for PostgreSQL
    await addDeleteTodoTask(id)
    logger.info(`Todo with ID ${id} deleted from cache`) // Log success
    res.status(200).json({ message: 'Todo deleted from cache' })
  } catch (err) {
    logger.error(`Error in DELETE /todos/${req.params.id}: ${err.message}`) // Log the error

    next(err)
  }
}

export const handleError = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(`Unhandled error: ${err.message}`, { stack: err.stack })
  res.status(500).json({ error: 'Internal Server Error' })
}
