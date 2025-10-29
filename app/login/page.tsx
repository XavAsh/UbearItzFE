import LoginForm from "@/components/auth/LoginForm";
import ClientLogin from "@/app/login/ClientLogin";
export const metadata = {
  title: "Login",
};

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
