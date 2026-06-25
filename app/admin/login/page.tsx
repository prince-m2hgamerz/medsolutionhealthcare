"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-canvas-night flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-display text-heading-xl text-on-primary mb-2">
            Med Solution <span className="text-link-mint">Admin</span>
          </h1>
          <p className="text-caption text-link-cool-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-md px-4 py-3 text-caption text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-caption text-link-cool-2 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
              required
              className="w-full bg-canvas-night-elevated border border-hairline-dark text-on-primary rounded-md px-4 py-3 text-body-md placeholder:text-shade-60 focus:outline-none focus:border-link-cool-2 transition-colors"
            />
          </div>

          <div>
            <label className="block text-caption text-link-cool-2 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full bg-canvas-night-elevated border border-hairline-dark text-on-primary rounded-md px-4 py-3 text-body-md placeholder:text-shade-60 focus:outline-none focus:border-link-cool-2 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-center disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-micro text-link-cool-2 mt-8">
          Protected area. Authorized personnel only.
        </p>
      </div>
    </div>
  );
}
