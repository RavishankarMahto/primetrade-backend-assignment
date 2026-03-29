import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

type LoginRes = {
  success: true;
  data: { user: { id: string; email: string; role: "USER" | "ADMIN" }; token: string };
};

export function LoginPage() {
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const res = await api<LoginRes>("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setSession(res.data.token, res.data.user);
      setMsg({ type: "ok", text: "Logged in." });
      navigate("/dashboard");
    } catch (err) {
      setMsg({ type: "err", text: err instanceof Error ? err.message : "Login failed" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card narrow">
      <h1>Log in</h1>
      <form onSubmit={onSubmit} className="form">
        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      {msg && <p className={msg.type === "ok" ? "flash ok" : "flash err"}>{msg.text}</p>}
      <p className="muted">
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
