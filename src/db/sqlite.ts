import { Pool } from 'pg'
import { Todo } from '../models/todo.model'

const pool = new Pool({
  host: process.env.PGHOST || 'postgrestodo',
  port: +(process.env.PGPORT || 5432),
  user: process.env.PGUSER || 'todo',
  password: process.env.PGPASSWORD || 'todo',
  database: process.env.PGDATABASE || 'todo_db'
})

// Ensure table exists
pool
  .query(
    `
  CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    done BOOLEAN NOT NULL DEFAULT FALSE,
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
  )
`
  )
  .catch(console.error)

export async function getTodosFromDb(): Promise<Todo[]> {
  const { rows } = await pool.query('SELECT * FROM todos')
  return rows.map((row) => ({
    id: row.id.toString(),
    title: row.title,
    description: row.description,
    done: row.done,
    createdAt: row.createdat,
    updatedAt: row.updatedat
  }))
}

export async function createTodoInDb(
  title: string,
  description?: string
): Promise<Todo> {
  const now = new Date()
  const { rows } = await pool.query(
    `INSERT INTO todos (title, description, done, createdAt, updatedAt)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [title, description ?? null, false, now, now]
  )
  const row = rows[0]
  return {
    id: row.id.toString(),
    title: row.title,
    description: row.description,
    done: row.done,
    createdAt: row.createdat,
    updatedAt: row.updatedat
  }
}

export async function markTodoDoneInDb(id: string): Promise<Todo | null> {
  const now = new Date()
  const { rows } = await pool.query(
    `UPDATE todos SET done = TRUE, updatedAt = $1 WHERE id = $2 RETURNING *`,
    [now, id]
  )
  if (!rows[0]) return null
  const row = rows[0]
  return {
    id: row.id.toString(),
    title: row.title,
    description: row.description,
    done: row.done,
    createdAt: row.createdat,
    updatedAt: row.updatedat
  }
}

export async function deleteTodoInDb(id: string): Promise<void> {
  await pool.query('DELETE FROM todos WHERE id = $1', [id])
}

export async function closeDbConnection(): Promise<void> {
  await pool.end()
}