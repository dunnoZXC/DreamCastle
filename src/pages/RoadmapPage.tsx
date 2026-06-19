import { NavLink } from "react-router";
import {
  ArrowLeft,
  Castle,
  CheckCircle2,
  Lock,
  Play,
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

type RoadmapStatus =
  | "ready"
  | "active"
  | "locked"
  | "needs-practice"
  | "almost-ready"
  | "castle"
  | "castle-open";

type RoadmapNode = {
  id: string;
  title: string;
  label: string;
  status: RoadmapStatus;
  type: "start" | "gate" | "castle";
  originalIndex: number;
  score?: number;
};

const ROADMAP_STORAGE_KEY = "dreamcastle:activeRoadmap";
const RESULTS_STORAGE_KEY = "dreamcastle:gateResults";

function createSlug(value: string, index: number) {
  return `${value.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`;
}

function getStoredRoadmap(): RoadmapData | null {
  const savedRoadmap = localStorage.getItem(ROADMAP_STORAGE_KEY);

  if (!savedRoadmap) {
    return null;
  }

  try {
    return JSON.parse(savedRoadmap) as RoadmapData;
  } catch {
    return null;
  }
}

function getStoredGateResults(): GateResult[] {
  const savedResults = localStorage.getItem(RESULTS_STORAGE_KEY);

  if (!savedResults) {
    return [];
  }

  try {
    return JSON.parse(savedResults) as GateResult[];
  } catch {
    return [];
  }
}

function isReadyResult(result?: GateResult) {
  return Boolean(result && result.score >= 80);
}

function getGateStatus(
  index: number,
  gateId: string,
  results: GateResult[],
  requirements: string[],
): RoadmapStatus {
  const currentResult = results.find((result) => result.gateId === gateId);

  if (currentResult) {
    if (currentResult.score >= 80) return "ready";
    if (currentResult.score >= 60) return "almost-ready";
    return "needs-practice";
  }

  if (index === 0) {
    return "active";
  }

  const previousGateId = createSlug(requirements[index - 1], index);
  const previousResult = results.find(
    (result) => result.gateId === previousGateId,
  );

  if (isReadyResult(previousResult)) {
    return "active";
  }

  return "locked";
}

function getNodePositionClass(index: number) {
  const positions = [
    "roadmap-lane-left",
    "roadmap-lane-center",
    "roadmap-lane-right",
    "roadmap-lane-center",
  ];

  return positions[index % positions.length];
}

function getStatusLabel(status: RoadmapStatus) {
  if (status === "ready") return "Ready";
  if (status === "active") return "Current";
  if (status === "almost-ready") return "Almost Ready";
  if (status === "needs-practice") return "Needs Practice";
  if (status === "castle-open") return "Unlocked";
  return "Locked";
}

function getStatusIcon(status: RoadmapStatus, type: RoadmapNode["type"]) {
  if (type === "castle") return <Castle size={20} />;
  if (status === "ready") return <CheckCircle2 size={20} />;
  if (status === "almost-ready") return <Target size={18} />;
  if (status === "needs-practice") return <Target size={18} />;
  if (status === "active") return <Play size={18} />;
  return <Lock size={18} />;
}

export default function RoadmapPage() {
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
              <Lock size={16} className="text-[var(--raspberry)]" />
              Roadmap locked
            </div>

            <h1 className="max-w-2xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
              Your castle is waiting.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--text-muted)]">
              Add your target role and requirements first. DreamCastle will use
              them to build your personal path from Start to Castle.
            </p>

            <NavLink
              to="/create-roadmap"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--raspberry)] px-7 py-4 font-bold text-white shadow-soft transition hover:-translate-y-1 hover:bg-[var(--raspberry-dark)]"
            >
              Build my first path
              <Sparkles size={18} />
            </NavLink>
          </div>

          <div className="rounded-[2.5rem] border border-[var(--border)] bg-white p-8 shadow-big">
            <div className="locked-castle-card">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[var(--bg)] text-[var(--text-muted)]">
                <Castle size={44} />
              </div>

              <h2 className="text-3xl font-black">Castle locked</h2>

              <p className="mt-4 max-w-md text-center leading-7 text-[var(--text-muted)]">
                Your roadmap will appear here after you create a goal.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const gateNodes: RoadmapNode[] = roadmap.requirements.map(
    (requirement, index): RoadmapNode => {
      const gateId = createSlug(requirement, index + 1);
      const result = gateResults.find((item) => item.gateId === gateId);

      return {
        id: gateId,
        title: requirement,
        label: `Gate ${index + 1}`,
        status: getGateStatus(
          index,
          gateId,
          gateResults,
          roadmap.requirements,
        ),
        type: "gate",
        originalIndex: index + 1,
        score: result?.score,
      };
    },
  );

  const allGatesReady =
    gateNodes.length > 0 &&
    gateNodes.every((node) => node.status === "ready");

  const nodes: RoadmapNode[] = [
    {
      id: "start",
      title: "Start",
      label: "Entry",
      status: "ready",
      type: "start",
      originalIndex: 0,
    },
    ...gateNodes,
    {
      id: "castle",
      title: "Castle",
      label: "Final goal",
      status: allGatesReady ? "castle-open" : "castle",
      type: "castle",
      originalIndex: roadmap.requirements.length + 1,
    },
  ];

  const visualNodes = [...nodes].reverse();

  const completedGates = gateNodes.filter(
    (node) => node.status === "ready",
  ).length;

  const checkedGates = gateNodes.filter(
    (node) =>
      node.status === "ready" ||
      node.status === "almost-ready" ||
      node.status === "needs-practice",
  ).length;

  const currentGate = gateNodes.find((node) => node.status !== "ready");

  const progress = Math.round(
    (completedGates / Math.max(roadmap.requirements.length, 1)) * 100,
  );

  function resetRoadmap() {
    localStorage.removeItem(ROADMAP_STORAGE_KEY);
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
            <NavLink
              to="/create-roadmap"
              className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--text-muted)] transition hover:text-[var(--raspberry)]"
            >
              <ArrowLeft size={17} />
              Edit requirements
            </NavLink>

            <p className="mb-2 font-bold text-[var(--raspberry)]">My Roadmap</p>

            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
              {roadmap.targetRole}
            </h1>

            <p className="mt-3 text-[var(--text-muted)]">
              {roadmap.companyName || "No company"} ·{" "}
              {roadmap.vacancyTitle || "Custom vacancy"}
            </p>
          </div>

          <button
            type="button"
            onClick={resetRoadmap}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm font-bold shadow-soft transition hover:-translate-y-0.5 hover:text-[var(--raspberry)]"
          >
            <RotateCcw size={17} />
            Reset demo
          </button>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="roadmap-stat-card">
            <p>Overall progress</p>
            <h3>{progress}%</h3>
          </div>

          <div className="roadmap-stat-card">
            <p>Ready gates</p>
            <h3>
              {completedGates} / {roadmap.requirements.length}
            </h3>
          </div>

          <div className="roadmap-stat-card">
            <p>Checked gates</p>
            <h3>
              {checkedGates} / {roadmap.requirements.length}
            </h3>
          </div>

          <div className="roadmap-stat-card">
            <p>Castle status</p>
            <h3>{allGatesReady ? "Unlocked" : "Locked"}</h3>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="full-roadmap-shell">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-[var(--raspberry)]">
                  Path visualization
                </p>

                <h2 className="mt-1 text-2xl font-black">Start to Castle</h2>
              </div>

              <div className="rounded-full bg-[var(--green-soft)] px-4 py-2 text-sm font-black text-[var(--green)]">
                {completedGates} gates ready
              </div>
            </div>

            <div className="full-roadmap-map">
              {visualNodes.map((node) => (
                <div
                  key={node.id}
                  className={`roadmap-lane ${getNodePositionClass(
                    node.originalIndex,
                  )}`}
                >
                  <div
                    className={`full-gate-card full-gate-${node.status} ${
                      node.type === "castle" ? "full-gate-castle" : ""
                    }`}
                  >
                    <span className="full-gate-icon">
                      {getStatusIcon(node.status, node.type)}
                    </span>

                    <div>
                      <p>{node.label}</p>
                      <h3>{node.title}</h3>
                      <span>
                        {getStatusLabel(node.status)}
                        {typeof node.score === "number"
                          ? ` · ${node.score}%`
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-[2rem] border border-[var(--border)] bg-white p-6 shadow-soft">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--raspberry-soft)] text-[var(--raspberry)]">
                {allGatesReady ? <Trophy size={24} /> : <Target size={24} />}
              </div>

              <h2 className="text-2xl font-black">
                {allGatesReady ? "Castle unlocked" : "Current focus"}
              </h2>

              {allGatesReady ? (
                <p className="mt-3 leading-7 text-[var(--text-muted)]">
                  All gates are ready. Your roadmap is complete and the Castle
                  is unlocked. Next step: prepare your CV, portfolio and apply.
                </p>
              ) : (
                <p className="mt-3 leading-7 text-[var(--text-muted)]">
                  Your current gate is{" "}
                  <strong className="text-[var(--text-main)]">
                    {currentGate?.title || "not selected"}
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
                <button className="mt-6 inline-flex w-full cursor-default items-center justify-center gap-2 rounded-full bg-[var(--green)] px-5 py-3 font-bold text-white shadow-soft">
                  Ready to apply
                  <Trophy size={18} />
                </button>
              )}
            </div>

            <div className="rounded-[2rem] border border-[var(--border)] bg-white p-6 shadow-soft">
              <h2 className="text-2xl font-black">Requirements</h2>

              <div className="mt-5 grid gap-3">
                {gateNodes.map((node) => (
                  <div
                    key={node.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3"
                  >
                    <span className="text-sm font-bold">{node.title}</span>

                    <span className="text-sm font-black text-[var(--text-muted)]">
                      {node.score ? `${node.score}%` : getStatusLabel(node.status)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--text-main)] p-6 text-white shadow-soft">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[var(--green)]">
                <Castle size={24} />
              </div>

              <h2 className="text-2xl font-black">Castle condition</h2>

              <p className="mt-3 leading-7 text-white/70">
                Castle unlocks only when every gate reaches at least 80%
                readiness.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}