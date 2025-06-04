import { Request, Response, NextFunction } from 'express'
import { getTodos, createTodo, markTodoDone, deleteTodo } from '../db/redis'

export const postTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title } = req.body
    if (!title) {
      res.status(400).json({ error: 'Title is required' })
      return
    }
    const todo = await createTodo(title)
    res.status(201).json(todo)
  } catch (err) {
    next(err)
  }
}

export const getTodosList = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
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
    const todo = await markTodoDone(id)
    if (!todo) {
      res.status(404).json({ error: 'Todo not found' })
      return
    }
    res.json(todo)
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
    await deleteTodo(id)
    res.status(204).send()
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
