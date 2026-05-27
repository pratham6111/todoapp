import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      setError("");
      const res = await fetch(`${API_URL}/api/tasks`);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      });

      if (!res.ok) throw new Error("Failed to add task");

      setTitle("");
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleTask = async (task) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.title,
          done: !task.done
        })
      });

      if (!res.ok) throw new Error("Failed to update task");

      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Failed to delete task");

      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1>Todo Manager</h1>
        <p className="subtitle">React frontend + Node backend</p>

        <form onSubmit={addTask} className="form">
          <input
            type="text"
            placeholder="Enter new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button type="submit">Add Task</button>
        </form>

        {error && <div className="error">{error}</div>}
        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className={task.done ? "done" : ""}>
                <span onClick={() => toggleTask(task)}>{task.title}</span>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
