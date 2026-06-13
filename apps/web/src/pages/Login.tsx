import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Church } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const DEMO_ACCOUNTS = [
  { role: "Admin", email: "admin@church.org" },
  { role: "Pastor", email: "pastor@church.org" },
  { role: "Leader", email: "leader@church.org" },
  { role: "Member", email: "member@church.org" },
];

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@church.org");
  const [password, setPassword] = useState("Password123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Church className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to your ChurchOS dashboard</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          )}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white/60 p-4 text-xs text-slate-500">
          <p className="mb-2 font-medium text-slate-600">Demo accounts (password: Password123)</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((a) => (
              <button
                key={a.email}
                type="button"
                onClick={() => {
                  setEmail(a.email);
                  setPassword("Password123");
                }}
                className="rounded-md border border-slate-200 px-2 py-1 text-left hover:border-brand-300 hover:bg-brand-50"
              >
                <span className="block font-medium text-slate-700">{a.role}</span>
                <span className="block truncate text-slate-400">{a.email}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-slate-500">
          No account?{" "}
          <Link to="/register" className="font-medium text-brand-600 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
