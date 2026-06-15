import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { TrackerPage } from "./pages/TrackerPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<TrackerPage />} />
    </Routes>
  );
}
