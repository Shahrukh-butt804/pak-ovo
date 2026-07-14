import { createFileRoute, Link, useNavigate } from "@/lib/router-compat";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/auth/login")({
  head: () => ({ meta: [{ title: "Sign in — PakOvo" }, { name: "robots", content: "noindex" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) { toast.error("Please fix the errors below"); return; }
    toast.success("Signed in successfully");
    navigate({ to: "/account" });
  };

  return (
    <div className="container-px mx-auto flex max-w-md flex-col items-center py-16">
      <img src={logo} alt="PakOvo" className="h-16 w-16 object-contain" />
      <h1 className="mt-4 font-display text-3xl font-bold">Welcome back</h1>
      <p className="mt-1 text-sm text-muted-foreground">Sign in to your PakOvo account</p>

      <form className="mt-8 w-full space-y-3" onSubmit={onSubmit} noValidate>
        <Field label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} autoComplete="email" />
        <Field label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} autoComplete="current-password" />
        <div className="flex justify-end">
          <Link to="/auth/login" className="text-xs font-medium text-brand hover:underline">Forgot password?</Link>
        </div>
        <Button variant="hero" size="lg" className="w-full" type="submit">Sign in</Button>
      </form>

      <p className="mt-8 text-sm text-muted-foreground">
        New to PakOvo? <Link to="/auth/register" className="font-semibold text-brand hover:underline">Create account</Link>
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
