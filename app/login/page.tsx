import LoginForm from "@/components/auth/LoginForm";
import ClientLogin from "@/app/login/ClientLogin";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Login | UbearItz",
  description: "Access your UbearItz account to manage orders and cart.",
  path: "/login",
});

export default function LoginPage() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="w-full flex flex-col items-center gap-6">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <ClientLogin />
      </div>
    </main>
  );
}
