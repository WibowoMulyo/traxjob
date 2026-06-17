import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { authApi, ApiError } from "@/lib/api";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setSubmitting(true);
    try {
      await authApi.resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout
        title="Invalid reset link"
        footer={
          <Link
            to="/forgot-password"
            className="font-medium text-md-primary hover:underline"
          >
            Request a new link
          </Link>
        }
      >
        <p className="text-sm text-md-muted">
          This password reset link is missing its token. Please request a new
          one.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Set a new password"
      footer={
        <Link to="/login" className="font-medium text-md-primary hover:underline">
          Back to log in
        </Link>
      }
    >
      {done ? (
        <p className="rounded-md-sm bg-md-offer-container px-3 py-3 text-sm text-md-on-offer-container">
          Your password has been updated. You can now{" "}
          <Link to="/login" className="font-medium underline">
            log in
          </Link>{" "}
          with your new password.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="grid gap-4">
          {error && (
            <p className="rounded-md-sm bg-md-rejected-container px-3 py-2 text-sm text-md-on-rejected-container">
              {error}
            </p>
          )}
          <div className="grid gap-1.5">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="confirm">Confirm new password</Label>
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={submitting} className="mt-2 w-full">
            {submitting ? "Updating…" : "Update password"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
