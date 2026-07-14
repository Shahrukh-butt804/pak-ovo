import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@/lib/router-compat";
import { useResetPasswordMutation } from "@/redux/services/authSlice";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/reset-password")({
  head: () => ({
    meta: [{ title: "Reset Password — PakOvo" }, { name: "robots", content: "noindex" }],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, otp } = location.state || {};

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const validate = () => {
    const e: typeof errors = {};
    if (!password.trim()) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be at least 6 characters";
    if (password !== confirmPassword) e.password = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors below");
      return;
    }

    const res: any = await resetPassword({ email, otp: Number(otp), password });

    if (res?.data?.success) {
      toast.success(res?.data?.message || "Operation successful");
      navigate("/auth/login");
    } else {
      toast.error(
        res?.error?.data?.message || res?.error?.data?.errors[0].msg || "something went wrong",
      );
    }
  };

  return (
    <div className="container-px mx-auto flex max-w-md flex-col items-center py-16">
      <img src={logo} alt="PakOvo" className="h-16 w-16 object-contain" />
      <h1 className="mt-4 font-display text-3xl font-bold">Reset Password</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your new password and confirm it to reset your account password.
      </p>

      <form className="mt-8 w-full space-y-3" onSubmit={onSubmit} noValidate>
        <Field
          label="New Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="new-password"
        />
        <Field
          label="Confirm Password"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.password}
          autoComplete="new-password"
        />

        <div className="flex justify-end">
          <Link to="/auth/login" className="text-xs font-medium text-brand hover:underline">
            Back to Login
          </Link>
        </div>

        <Button disabled={isLoading} variant="hero" size="lg" className="w-full" type="submit">
          Reset Password
        </Button>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  required,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
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
