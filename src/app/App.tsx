import { Route, Routes } from "react-router";
import GateCheckPage from "../pages/GateCheckPage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HomePage from "../pages/HomePage";
import DashboardPage from "../pages/DashboardPage";
import RoadmapPage from "../pages/RoadmapPage";
import CreateRoadmapPage from "../pages/CreateRoadmapPage";

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-main)]">
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-roadmap" element={<CreateRoadmapPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/gate-check/:gateId" element={<GateCheckPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}