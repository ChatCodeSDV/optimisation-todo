import { Request, Response, NextFunction } from 'express'
import { getTodos, deleteTodos } from '../db/redis'
import {
  addCreateTodoTask,
  addMarkTodoDoneTask,
  addDeleteTodoTask
} from '../services/queue.service'

export const postTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title } = req.body
    const description = req.body.description ?? ''
    if (!title) {
      res.status(400).json({ error: 'Title is required' })
      return
    }

    await deleteTodos()

    // Add task to queue for PostgreSQL
    await addCreateTodoTask(title, description)

    res.status(201).json({ message: 'Todo created in cache' })
  } catch (err) {
    next(err)
  }
}

export const getTodosList = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const todos = await getTodos()
    res.json(todos)
  } catch (err) {
    next(err)
  }
}

export const patchTodoDone = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10)
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid ID' })
      return
    }

    await deleteTodos()

    // Add task to queue for PostgreSQL
    await addMarkTodoDoneTask(id)

    res.status(200).json({ message: 'Todo marked as done' })
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
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid ID' })
      return
    }

    await deleteTodos()

    // Add task to queue for PostgreSQL
    await addDeleteTodoTask(id)

    res.status(200).json({ message: 'Todo deleted' })
  } catch (err) {
    next(err)
  }
}

export const handleError = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(err)
  res.status(500).json({ error: 'Internal Server Error' })
}
