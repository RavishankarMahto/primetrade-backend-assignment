import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

type RegRes = {
  success: true;
  data: { user: { id: string; email: string; role: "USER" | "ADMIN" }; token: string };
};

export function RegisterPage() {
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
      const res = await api<RegRes>("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setSession(res.data.token, res.data.user);
      setMsg({ type: "ok", text: "Account created." });
      navigate("/dashboard");
    } catch (err) {
      setMsg({ type: "err", text: err instanceof Error ? err.message : "Registration failed" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card narrow">
      <h1>Register</h1>
      <p className="muted small">
        Password: 8+ chars, at least one letter and one number.
      </p>
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Creating…" : "Create account"}
        </button>
      </form>
      {msg && <p className={msg.type === "ok" ? "flash ok" : "flash err"}>{msg.text}</p>}
      <p className="muted">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
