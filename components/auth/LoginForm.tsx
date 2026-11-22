"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";
import Link from "next/link";
import { FormEvent, useState } from "react";

export function LoginForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toastOpen, setToastOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validate = () => {
    const next: Record<string, string> = {};
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email";
    }
    if (!password) next.password = "Password is required";
    else if (password.length < 6) {
      next.password = "Password must be at least 6 characters";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setToastOpen(true);
  };

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Input
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="current-password"
        />
        <Button type="submit" size="lg" className="w-full">
          Sign in
        </Button>
        <Button variant="outline" size="lg" className="w-full" href="/student">
          Continue to student dashboard (demo)
        </Button>
        <p className="text-center text-sm text-muted">
          No account?{" "}
          <Link href="/signup" className="font-medium text-primary hover:text-primary-dark">
            Create one
          </Link>
        </p>
        <p className="rounded-lg border border-border bg-surface/80 px-4 py-3 text-xs text-muted">
          Demo only — authentication is not connected. Use any valid-format email and
          password to see the success toast.
        </p>
      </form>

      <Toast
        open={toastOpen}
        message="Signed in (demo). Redirect via the student dashboard button."
        onClose={() => setToastOpen(false)}
      />
    </>
  );
}