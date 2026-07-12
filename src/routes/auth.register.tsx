import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/auth/register")({
  head: () => ({ meta: [{ title: "Create account — PakOvo" }, { name: "robots", content: "noindex" }] }),
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "Full name is required";
    else if (form.name.trim().length < 2) e.name = "Name is too short";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) { toast.error("Please fix the errors below"); return; }
    toast.success("Account created — welcome to PakOvo!");
    navigate({ to: "/account" });
  };

  return (
    <div className="container-px mx-auto flex max-w-md flex-col items-center py-16">
      <img src={logo} alt="PakOvo" className="h-16 w-16 object-contain" />
      <h1 className="mt-4 font-display text-3xl font-bold">Create account</h1>
      <p className="mt-1 text-sm text-muted-foreground">Join PakOvo and unlock 10% off</p>

      <form className="mt-8 w-full space-y-3" onSubmit={onSubmit} noValidate>
        <Field label="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} autoComplete="name" />
        <Field label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} autoComplete="email" />
        <Field label="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} autoComplete="new-password" />
        <Button variant="hero" size="lg" className="w-full" type="submit">Create account</Button>
      </form>

      <p className="mt-8 text-sm text-muted-foreground">
        Already have an account? <Link to="/auth/login" className="font-semibold text-brand hover:underline">Sign in</Link>
      </p>
    </div>
  );
}

function Field({ label, error, required, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">
        {label}{required && <span className="ml-0.5 text-destructive">*</span>}
      </span>
      <input
        {...rest}
        aria-invalid={!!error}
        className={`h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-1 ${error ? "border-destructive focus:border-destructive focus:ring-destructive" : "border-input focus:border-brand focus:ring-brand"}`}
      />
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
