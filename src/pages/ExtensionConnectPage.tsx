import { useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";

function safeAuthorizeUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value, window.location.origin);
    if (
      url.origin !== window.location.origin ||
      url.pathname !== "/api/auth/extension/authorize"
    )
      return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function ExtensionConnectPage() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [params] = useSearchParams();
  const authorizeUrl = safeAuthorizeUrl(params.get("authorize"));

  useEffect(() => {
    if (user && authorizeUrl) window.location.assign(authorizeUrl);
  }, [authorizeUrl, user]);

  if (loading || user) {
    return (
      <div className="grid min-h-svh place-items-center">
        <Loader2 className="size-8 animate-spin text-md-primary" />
      </div>
    );
  }

  return (
    <AuthLayout
      title="Connect TraxJob"
      subtitle="Log in to connect the TraxJob browser extension."
    >
      {authorizeUrl ? (
        <Button asChild className="w-full">
          <Link to="/login" state={{ from: location }}>
            Login to TraxJob
          </Link>
        </Button>
      ) : (
        <p className="text-sm text-md-muted">This connection link is invalid or expired.</p>
      )}
    </AuthLayout>
  );
}
