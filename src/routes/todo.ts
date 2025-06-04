import { Router } from 'express'
import {
  postTodo,
  getTodosList,
  patchTodoDone,
  deleteTodoController
} from '../controllers/todo.controller'

const router = Router()

router.get('/', (req, res) => {
  res.send('Welcome to the Todo API')
})

router.post('/todos', postTodo)
router.get('/todos', getTodosList)
router.patch('/todos/:id/done', patchTodoDone)
router.delete('/todos/:id', deleteTodoController)

export default router
