import { Router } from 'express'
import {
  postTodo,
  getTodosList,
  patchTodoDone,
  deleteTodoController
} from '../controllers/todo.controller'
import { validateSchema } from '../middleware/validateSchema'
import { createTodoSchema } from '../schemas/createTodo.schema'

const router = Router()

router.get('/', (req, res) => {
  res.send('Welcome to the Todo API')
})

router.post('/todos', validateSchema(createTodoSchema), postTodo)
router.get('/todos', getTodosList)
router.patch('/todos/:id/done', patchTodoDone)
router.delete('/todos/:id', deleteTodoController)

export default router
