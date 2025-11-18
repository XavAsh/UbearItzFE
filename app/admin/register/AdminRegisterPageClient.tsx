"use client";

import CreateAccountForm from "@/components/auth/CreateAccountForm";
import { register as apiRegister } from "@/services/api/auth";

export default function AdminRegisterPageClient() {
  async function handleSubmit({ name, email, password }: { name: string; email: string; password: string }) {
    await apiRegister({ name, email, password, role: "admin" });
    window.location.href = "/login";
  }

  return (
    <main className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="w-full flex flex-col items-center gap-6">
        <h1 className="text-2xl font-semibold">Create admin account</h1>
        <CreateAccountForm onSubmit={handleSubmit} submitLabel="Create admin" />
      </div>
    </main>
  );
}

