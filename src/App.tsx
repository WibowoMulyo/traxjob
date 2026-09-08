import { Routes, Route } from "react-router-dom";
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

export function App() {
  return (
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
  );
}
