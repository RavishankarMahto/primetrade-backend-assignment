import { FormEvent, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

type Task = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; email: string };
};

type ListRes = { success: true; data: { tasks: Task[] } };
type TaskRes = { success: true; data: { task: Task } };

export function DashboardPage() {
  const { token, user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [flash, setFlash] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [adminUsers, setAdminUsers] = useState<{ id: string; email: string; role: string }[] | null>(
    null
  );

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setFlash(null);
    try {
      const res = await api<ListRes>("/api/v1/tasks", { token });
      setTasks(res.data.tasks);
    } catch (e) {
      setFlash({ type: "err", text: e instanceof Error ? e.message : "Failed to load tasks" });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  async function createTask(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setFlash(null);
    try {
      await api<TaskRes>("/api/v1/tasks", {
        method: "POST",
        token,
        body: JSON.stringify({ title, description: description || null, completed: false }),
      });
      setTitle("");
      setDescription("");
      setFlash({ type: "ok", text: "Task created." });
      await load();
    } catch (err) {
      setFlash({ type: "err", text: err instanceof Error ? err.message : "Create failed" });
    }
  }

  async function toggleComplete(t: Task) {
    if (!token) return;
    try {
      await api<TaskRes>(`/api/v1/tasks/${t.id}`, {
        method: "PATCH",
        token,
        body: JSON.stringify({ completed: !t.completed }),
      });
      await load();
    } catch (err) {
      setFlash({ type: "err", text: err instanceof Error ? err.message : "Update failed" });
    }
  }

  async function removeTask(id: string) {
    if (!token) return;
    if (!confirm("Delete this task?")) return;
    try {
      await api<unknown>(`/api/v1/tasks/${id}`, { method: "DELETE", token });
      setFlash({ type: "ok", text: "Task deleted." });
      await load();
    } catch (err) {
      setFlash({ type: "err", text: err instanceof Error ? err.message : "Delete failed" });
    }
  }

  async function loadAdminUsers() {
    if (!token || user?.role !== "ADMIN") return;
    try {
      const res = await api<{
        success: true;
        data: { users: { id: string; email: string; role: string }[] };
      }>("/api/v1/admin/users", { token });
      setAdminUsers(res.data.users);
      setFlash({ type: "ok", text: "Loaded users (admin)." });
    } catch (err) {
      setFlash({ type: "err", text: err instanceof Error ? err.message : "Admin request failed" });
    }
  }

  return (
    <div className="card wide">
      <div className="row between">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">
            Signed in as <strong>{user?.email}</strong> ({user?.role})
          </p>
        </div>
        <div className="row gap">
          <Link className="link" to="/login" onClick={() => logout()}>
            Log out
          </Link>
        </div>
      </div>

      {flash && <p className={flash.type === "ok" ? "flash ok" : "flash err"}>{flash.text}</p>}

      {user?.role === "ADMIN" && (
        <section className="section">
          <h2>Admin</h2>
          <button type="button" onClick={() => void loadAdminUsers()}>
            List all users
          </button>
          {adminUsers && (
            <ul className="list">
              {adminUsers.map((u) => (
                <li key={u.id}>
                  {u.email} — {u.role}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section className="section">
        <h2>New task</h2>
        <form onSubmit={createTask} className="form grid">
          <label>
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label className="span2">
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </label>
          <button type="submit">Add task</button>
        </form>
      </section>

      <section className="section">
        <h2>Your tasks {loading && <span className="muted">(loading…)</span>}</h2>
        {tasks.length === 0 && !loading && <p className="muted">No tasks yet.</p>}
        <ul className="task-list">
          {tasks.map((t) => (
            <li key={t.id} className="task-item">
              <div>
                <div className="task-title">{t.title}</div>
                {t.description && <div className="muted small">{t.description}</div>}
                {t.user && user?.role === "ADMIN" && (
                  <div className="muted small">Owner: {t.user.email}</div>
                )}
              </div>
              <div className="row gap">
                <label className="inline">
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => void toggleComplete(t)}
                  />{" "}
                  Done
                </label>
                <button type="button" className="danger" onClick={() => void removeTask(t.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <p className="muted small">
        API docs: <a href="http://localhost:4000/docs">Swagger</a> (backend must be running).
      </p>
    </div>
  );
}
