import type { Metadata } from "next";
import { LoginForm } from "@/features/admin/components/login-form";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <main className="mx-auto max-w-sm px-5 py-24">
      <h1 className="mb-10 font-heading text-4xl">Admin sign in</h1>
      <LoginForm />
    </main>
  );
}
