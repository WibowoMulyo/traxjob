import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/theme.css";
import { App } from "./App";
import { AuthProvider } from "./auth/AuthContext";
import { ConfirmProvider } from "./components/confirm";
import { Toaster } from "./components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ConfirmProvider>
          <App />
        </ConfirmProvider>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
