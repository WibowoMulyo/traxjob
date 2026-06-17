import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { authApi, ApiError } from "@/lib/api";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
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

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link"
      footer={
        <Link to="/login" className="font-medium text-md-primary hover:underline">
          Back to log in
        </Link>
      }
    >
      {sent ? (
        <p className="rounded-md-sm bg-md-offer-container px-3 py-3 text-sm text-md-on-offer-container">
          If an account exists for <strong>{email}</strong>, a password reset
          link is on its way. Check your inbox (and spam).
        </p>
      ) : (
        <form onSubmit={onSubmit} className="grid gap-4">
          {error && (
            <p className="rounded-md-sm bg-md-rejected-container px-3 py-2 text-sm text-md-on-rejected-container">
              {error}
            </p>
          )}
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={submitting} className="mt-2 w-full">
            {submitting ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
