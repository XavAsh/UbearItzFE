import CreateAccountForm from "@/components/auth/CreateAccountForm";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Create account | UbearItz",
  description: "Create your UbearItz account to start ordering from local restaurants.",
  path: "/register",
});

export default function CreateAccountPage() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="w-full flex flex-col items-center gap-6">
        <h1 className="text-2xl font-semibold">Create your account</h1>
        <CreateAccountForm />
      </div>
    </main>
  );
}
