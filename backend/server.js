const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());
app.use(morgan("dev"));

let tasks = [
  { id: 1, title: "Build CI/CD pipeline", done: false },
  { id: 2, title: "Deploy app on Kubernetes", done: false }
];

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Task title is required" });
  }

  const newTask = {
    id: Date.now(),
    title: title.trim(),
    done: false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put("/api/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const { title, done } = req.body;

  const task = tasks.find((t) => t.id === taskId);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (typeof title === "string") task.title = title;
  if (typeof done === "boolean") task.done = done;

  res.json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const before = tasks.length;
  tasks = tasks.filter((t) => t.id !== taskId);

  if (tasks.length === before) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json({ message: "Task deleted" });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
