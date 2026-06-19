import { NavLink } from "react-router";
import {
  ArrowRight,
  BarChart3,
  Castle,
  CheckCircle2,
  ClipboardCheck,
  Lock,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

type RoadmapData = {
  id: string;
  targetRole: string;
  companyName: string;
  vacancyTitle: string;
  requirements: string[];
  createdAt: string;
};

type GateResult = {
  gateId: string;
  gateTitle: string;
  score: number;
  correct: number;
  total: number;
  status: string;
  createdAt: string;
};

type GateStatus = "ready" | "almost-ready" | "needs-practice" | "active" | "locked";

type DashboardGate = {
  id: string;
  title: string;
  status: GateStatus;
  score?: number;
};

const ROADMAP_STORAGE_KEY = "dreamcastle:activeRoadmap";
const RESULTS_STORAGE_KEY = "dreamcastle:gateResults";

function createSlug(value: string, index: number) {
  return `${value.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`;
}

function getStoredRoadmap(): RoadmapData | null {
  const savedRoadmap = localStorage.getItem(ROADMAP_STORAGE_KEY);

  if (!savedRoadmap) return null;

  try {
    return JSON.parse(savedRoadmap) as RoadmapData;
  } catch {
    return null;
  }
}

function getStoredGateResults(): GateResult[] {
  const savedResults = localStorage.getItem(RESULTS_STORAGE_KEY);

  if (!savedResults) return [];

  try {
    return JSON.parse(savedResults) as GateResult[];
  } catch {
    return [];
  }
}

function getGateStatus(
  index: number,
  gateId: string,
  results: GateResult[],
  requirements: string[],
): GateStatus {
  const currentResult = results.find((result) => result.gateId === gateId);

  if (currentResult) {
    if (currentResult.score >= 80) return "ready";
    if (currentResult.score >= 60) return "almost-ready";
    return "needs-practice";
  }

  if (index === 0) return "active";

  const previousGateId = createSlug(requirements[index - 1], index);
  const previousResult = results.find((result) => result.gateId === previousGateId);

  if (previousResult && previousResult.score >= 80) {
    return "active";
  }

  return "locked";
}

function getStatusLabel(status: GateStatus) {
  if (status === "ready") return "Ready";
  if (status === "almost-ready") return "Almost Ready";
  if (status === "needs-practice") return "Needs Practice";
  if (status === "active") return "Current";
  return "Locked";
}

function getStatusIcon(status: GateStatus) {
  if (status === "ready") return <CheckCircle2 size={18} />;
  if (status === "almost-ready") return <Target size={18} />;
  if (status === "needs-practice") return <Target size={18} />;
  if (status === "active") return <ShieldCheck size={18} />;
  return <Lock size={18} />;
}

function getLatestResult(results: GateResult[]) {
  return [...results].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0];
}

export default function DashboardPage() {
  const roadmap = getStoredRoadmap();
  const gateResults = getStoredGateResults();

  if (!roadmap) {
    return (
      <section className="relative overflow-hidden">
        <div className="hero-glow hero-glow-left" />
        <div className="hero-glow hero-glow-right" />

        <div className="mx-auto grid min-h-[calc(100vh-74px)] max-w-7xl items-center gap-10 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--text-muted)] shadow-soft">
              <Sparkles size={16} className="text-[var(--raspberry)]" />
              Dashboard is empty
            </div>

            <h1 className="max-w-2xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
              No roadmap yet.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--text-muted)]">
              Create your first career roadmap to unlock progress tracking,
              current focus, gate results and next actions.
            </p>

            <NavLink
              to="/create-roadmap"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--raspberry)] px-7 py-4 font-bold text-white shadow-soft transition hover:-translate-y-1 hover:bg-[var(--raspberry-dark)]"
            >
              Create roadmap
              <Plus size={18} />
            </NavLink>
          </div>

          <div className="rounded-[2.5rem] border border-[var(--border)] bg-white p-8 shadow-big">
            <div className="locked-castle-card">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[var(--bg)] text-[var(--text-muted)]">
                <BarChart3 size={44} />
              </div>

              <h2 className="text-3xl font-black">Progress locked</h2>

              <p className="mt-4 max-w-md text-center leading-7 text-[var(--text-muted)]">
                Your dashboard will appear here after you build your first path.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const gates: DashboardGate[] = roadmap.requirements.map((requirement, index) => {
    const gateId = createSlug(requirement, index + 1);
    const result = gateResults.find((item) => item.gateId === gateId);

    return {
      id: gateId,
      title: requirement,
      status: getGateStatus(index, gateId, gateResults, roadmap.requirements),
      score: result?.score,
    };
  });

  const readyGates = gates.filter((gate) => gate.status === "ready").length;
  const checkedGates = gates.filter((gate) => typeof gate.score === "number").length;
  const currentGate = gates.find((gate) => gate.status !== "ready");
  const latestResult = getLatestResult(gateResults);
  const progress = Math.round((readyGates / Math.max(gates.length, 1)) * 100);
  const castleUnlocked = gates.length > 0 && gates.every((gate) => gate.status === "ready");

  function resetProgress() {
    localStorage.removeItem(RESULTS_STORAGE_KEY);
    window.location.reload();
  }

  return (
    <section className="relative overflow-hidden">
      <div className="hero-glow hero-glow-left" />
      <div className="hero-glow hero-glow-right" />

      <div className="mx-auto max-w-7xl px-5 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 font-bold text-[var(--raspberry)]">Dashboard</p>

            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
              Your progress hub
            </h1>

            <p className="mt-3 max-w-2xl text-[var(--text-muted)]">
              Track your current roadmap, gate results and next action before
              moving closer to the castle.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <NavLink
              to="/roadmap"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--raspberry)] px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-[var(--raspberry-dark)]"
            >
              Open roadmap
              <ArrowRight size={17} />
            </NavLink>

            <button
              type="button"
              onClick={resetProgress}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm font-bold shadow-soft transition hover:-translate-y-0.5 hover:text-[var(--raspberry)]"
            >
              <RotateCcw size={17} />
              Reset progress
            </button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="roadmap-stat-card">
            <p>Overall readiness</p>
            <h3>{progress}%</h3>
          </div>

          <div className="roadmap-stat-card">
            <p>Ready gates</p>
            <h3>
              {readyGates} / {gates.length}
            </h3>
          </div>

          <div className="roadmap-stat-card">
            <p>Checked gates</p>
            <h3>
              {checkedGates} / {gates.length}
            </h3>
          </div>

          <div className="roadmap-stat-card">
            <p>Castle status</p>
            <h3>{castleUnlocked ? "Unlocked" : "Locked"}</h3>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2.5rem] border border-[var(--border)] bg-white p-7 shadow-big">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <p className="font-bold text-[var(--raspberry)]">
                  Current roadmap
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  {roadmap.targetRole}
                </h2>

                <p className="mt-2 text-[var(--text-muted)]">
                  {roadmap.companyName || "No company"} ·{" "}
                  {roadmap.vacancyTitle || "Custom vacancy"}
                </p>
              </div>

              <div className="hidden rounded-2xl bg-[var(--green-soft)] px-4 py-3 text-sm font-black text-[var(--green)] sm:block">
                {progress}% ready
              </div>
            </div>

            <div className="mb-7 h-4 overflow-hidden rounded-full bg-[var(--bg)]">
              <div
                className="h-full rounded-full bg-[var(--raspberry)] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="grid gap-4">
              {gates.map((gate) => (
                <div
                  key={gate.id}
                  className={`dashboard-gate-row dashboard-gate-${gate.status}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="dashboard-gate-icon">
                      {getStatusIcon(gate.status)}
                    </span>

                    <div>
                      <h3>{gate.title}</h3>
                      <p>{getStatusLabel(gate.status)}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-black text-[var(--text-main)]">
                      {typeof gate.score === "number" ? `${gate.score}%` : "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-[2rem] border border-[var(--border)] bg-white p-6 shadow-soft">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--raspberry-soft)] text-[var(--raspberry)]">
                {castleUnlocked ? <Trophy size={24} /> : <Target size={24} />}
              </div>

              <h2 className="text-2xl font-black">
                {castleUnlocked ? "Ready to apply" : "Next action"}
              </h2>

              {castleUnlocked ? (
                <p className="mt-3 leading-7 text-[var(--text-muted)]">
                  All gates are ready. Your next step is to prepare CV, GitHub,
                  portfolio and apply checklist.
                </p>
              ) : (
                <p className="mt-3 leading-7 text-[var(--text-muted)]">
                  Focus on{" "}
                  <strong className="text-[var(--text-main)]">
                    {currentGate?.title || "your next gate"}
                  </strong>
                  . Pass or retry the Gate Check to move forward.
                </p>
              )}

              {currentGate ? (
                <NavLink
                  to={`/gate-check/${currentGate.id}`}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--raspberry)] px-5 py-3 font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-[var(--raspberry-dark)]"
                >
                  {currentGate.score ? "Retry Gate Check" : "Start Gate Check"}
                  <ShieldCheck size={18} />
                </NavLink>
              ) : (
                <NavLink
                  to="/roadmap"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--green)] px-5 py-3 font-bold text-white shadow-soft transition hover:-translate-y-0.5"
                >
                  View unlocked castle
                  <Castle size={18} />
                </NavLink>
              )}
            </div>

            <div className="rounded-[2rem] border border-[var(--border)] bg-white p-6 shadow-soft">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--green-soft)] text-[var(--green)]">
                <ClipboardCheck size={24} />
              </div>

              <h2 className="text-2xl font-black">Latest result</h2>

              {latestResult ? (
                <div className="mt-5 rounded-3xl border border-[var(--border)] bg-[var(--bg)] p-5">
                  <p className="text-sm font-bold text-[var(--text-muted)]">
                    {latestResult.gateTitle}
                  </p>

                  <div className="mt-3 flex items-end justify-between gap-4">
                    <h3 className="text-4xl font-black">
                      {latestResult.score}%
                    </h3>

                    <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-[var(--raspberry)]">
                      {latestResult.status}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-[var(--text-muted)]">
                    {latestResult.correct} correct out of {latestResult.total}
                  </p>
                </div>
              ) : (
                <p className="mt-3 leading-7 text-[var(--text-muted)]">
                  No Gate Checks completed yet. Start your current gate to see
                  results here.
                </p>
              )}
            </div>

            <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--text-main)] p-6 text-white shadow-soft">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[var(--green)]">
                <Castle size={24} />
              </div>

              <h2 className="text-2xl font-black">DreamCastle rule</h2>

              <p className="mt-3 leading-7 text-white/70">
                Your castle opens only when every gate reaches 80% or higher.
                Almost ready is good, but not enough to unlock the next step.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}