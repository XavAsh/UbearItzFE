import CreateAccountForm from "@/components/auth/CreateAccountForm";

export const metadata = {
  title: "Create account",
};

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
