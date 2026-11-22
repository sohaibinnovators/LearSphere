"use client";

import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function SignupForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toastOpen, setToastOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Name is required";
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email";
    }
    if (!password) next.password = "Password is required";
    else if (password.length < 8) {
      next.password = "Use at least 8 characters";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setToastOpen(true);
    window.setTimeout(() => {
      router.push(role === "instructor" ? "/instructor" : "/student");
    }, 1400);
  };

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Input
          label="Full name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          autoComplete="name"
        />
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
          autoComplete="new-password"
        />
        <Select
          label="I want to join as"
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          options={[
            { value: "student", label: "Student" },
            { value: "instructor", label: "Instructor" },
          ]}
        />
        <Button type="submit" size="lg" className="w-full">
          Create account
        </Button>
        <p className="text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:text-primary-dark">
            Sign in
          </Link>
        </p>
        <p className="rounded-lg border border-border bg-surface/80 px-4 py-3 text-xs text-muted">
          Demo signup — after success you will be routed to the{" "}
          {role === "instructor" ? "instructor" : "student"} dashboard UI.
        </p>
      </form>

      <Toast
        open={toastOpen}
        message="Account created (demo). Taking you to your dashboard…"
        onClose={() => setToastOpen(false)}
      />
    </>
  );
}