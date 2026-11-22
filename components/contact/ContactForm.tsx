"use client";

import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";
import { FormEvent, useState } from "react";

export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toastOpen, setToastOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Name is required";
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email";
    }
    if (!subject.trim()) next.subject = "Subject is required";
    if (!message.trim()) next.message = "Message is required";
    else if (message.trim().length < 20) {
      next.message = "Please write at least 20 characters";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setToastOpen(true);
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setErrors({});
  };

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Name"
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
        </div>
        <Input
          label="Subject"
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          error={errors.subject}
        />
        <Textarea
          label="Message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          error={errors.message}
          placeholder="How can we help?"
        />
        <Button type="submit" size="lg">
          Send message
        </Button>
        <p className="text-xs text-muted">
          Demo form — your message is not sent to a server.
        </p>
      </form>

      <Toast
        open={toastOpen}
        message="Thanks for reaching out. We'll respond soon (demo confirmation)."
        onClose={() => setToastOpen(false)}
      />
    </>
  );
}