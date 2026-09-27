import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { TrackerPage } from "./pages/TrackerPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
import { ExtensionConnectPage } from "./pages/ExtensionConnectPage";
import { ExtensionPage } from "./pages/ExtensionPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { GuestRoute, ProtectedRoute } from "./auth/guards";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const el = hash
      ? document.getElementById(hash.slice(1))
      : null;

    if (el) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches;
      el.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/extension/connect" element={<ExtensionConnectPage />} />
        <Route path="/extension" element={<ExtensionPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<TrackerPage />} />
        </Route>
      </Routes>
    </>
  );
}
