import { Router } from "express";

const router = Router();

// Mock database for demonstration purposes
interface Todo {
  id: number;
  title: string;
  done: boolean;
}

let todos: Todo[] = [];

router.get("/", (req, res) => {
  res.send("Welcome to the Todo API");
});

export default router;
