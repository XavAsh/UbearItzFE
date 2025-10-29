"use client";

import { useState } from "react";

type CreateAccountFormProps = {
  onSubmit?: (data: { name: string; email: string; password: string }) => void | Promise<void>;
  submitLabel?: string;
  showLinks?: boolean;
};

export default function CreateAccountForm({ onSubmit, submitLabel = "Create account", showLinks = true }: CreateAccountFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await onSubmit?.({ name, email, password });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md w-full space-y-4">
      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border rounded px-3 py-2" placeholder="Jane Doe" />
      </div>
      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
          placeholder="you@example.com"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
          placeholder="••••••••"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="terms" className="block text-sm font-medium">
          I am a buisness
        </label>
        <input id="terms" type="checkbox" required className="w-full border rounded px-3 py-2" />
      </div>
      <button type="submit" disabled={loading} className="w-full bg-black text-white rounded px-4 py-2 disabled:opacity-60">
        {loading ? "Please wait…" : submitLabel}
      </button>

      {showLinks && (
        <p className="text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="underline">
            Log in
          </a>
        </p>
      )}
    </form>
  );
}
