import { useMemo, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  RotateCcw,
  ShieldCheck,
  Target,
} from "lucide-react";

type RoadmapData = {
  id: string;
  targetRole: string;
  companyName: string;
  vacancyTitle: string;
  requirements: string[];
  createdAt: string;
};

type Question = {
  id: number;
  title: string;
  options: string[];
  correctAnswer: string;
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

function getStatus(score: number) {
  if (score >= 80) return "Ready";
  if (score >= 60) return "Almost Ready";
  return "Needs Practice";
}

function getQuestions(gateTitle: string): Question[] {
  const normalizedTitle = gateTitle.toLowerCase();

  if (normalizedTitle.includes("html") || normalizedTitle.includes("css")) {
    return [
      {
        id: 1,
        title: "What is the main purpose of semantic HTML?",
        options: [
          "To make text colorful",
          "To give content meaningful structure",
          "To replace CSS",
          "To make JavaScript faster",
        ],
        correctAnswer: "To give content meaningful structure",
      },
      {
        id: 2,
        title: "Which layout tool is usually better for a two-dimensional grid?",
        options: ["Flexbox", "Grid", "Position absolute", "Float"],
        correctAnswer: "Grid",
      },
      {
        id: 3,
        title: "What does responsive design solve?",
        options: [
          "Only page loading speed",
          "Layout adaptation for different screen sizes",
          "Only SEO",
          "Only animations",
        ],
        correctAnswer: "Layout adaptation for different screen sizes",
      },
      {
        id: 4,
        title: "Which element should usually be connected with an input?",
        options: ["label", "section", "main", "footer"],
        correctAnswer: "label",
      },
      {
        id: 5,
        title: "What is the role of box-sizing: border-box?",
        options: [
          "It removes all margins",
          "It includes padding and border inside element size",
          "It centers elements",
          "It changes text color",
        ],
        correctAnswer: "It includes padding and border inside element size",
      },
    ];
  }

  if (normalizedTitle.includes("javascript") || normalizedTitle.includes("js")) {
    return [
      {
        id: 1,
        title: "Which method creates a new array by transforming every item?",
        options: ["forEach", "map", "find", "push"],
        correctAnswer: "map",
      },
      {
        id: 2,
        title: "What is async/await mainly used for?",
        options: [
          "Styling components",
          "Working with asynchronous operations",
          "Creating CSS grids",
          "Importing images only",
        ],
        correctAnswer: "Working with asynchronous operations",
      },
      {
        id: 3,
        title: "What does DOM manipulation usually mean?",
        options: [
          "Changing database tables",
          "Changing HTML elements through JavaScript",
          "Changing server config",
          "Changing package versions",
        ],
        correctAnswer: "Changing HTML elements through JavaScript",
      },
      {
        id: 4,
        title: "Which block handles runtime errors?",
        options: ["if/else", "try/catch", "switch", "map/filter"],
        correctAnswer: "try/catch",
      },
      {
        id: 5,
        title: "Which method returns the first matching element in an array?",
        options: ["filter", "map", "find", "reduce"],
        correctAnswer: "find",
      },
    ];
  }

  if (normalizedTitle.includes("react")) {
    return [
      {
        id: 1,
        title: "What is a React component?",
        options: [
          "A reusable piece of UI",
          "A CSS file",
          "A database table",
          "A browser extension",
        ],
        correctAnswer: "A reusable piece of UI",
      },
      {
        id: 2,
        title: "What is useState used for?",
        options: [
          "Routing between pages",
          "Storing component state",
          "Installing packages",
          "Writing CSS variables",
        ],
        correctAnswer: "Storing component state",
      },
      {
        id: 3,
        title: "What are props used for?",
        options: [
          "Passing data to components",
          "Deleting components",
          "Creating npm scripts",
          "Changing Git branches",
        ],
        correctAnswer: "Passing data to components",
      },
      {
        id: 4,
        title: "Why do lists need a key prop?",
        options: [
          "For React to track list items efficiently",
          "For CSS animations only",
          "For browser bookmarks",
          "For API authorization",
        ],
        correctAnswer: "For React to track list items efficiently",
      },
      {
        id: 5,
        title: "What is conditional rendering?",
        options: [
          "Showing UI depending on state or conditions",
          "Running npm install conditionally",
          "Changing database schema",
          "Making all elements hidden",
        ],
        correctAnswer: "Showing UI depending on state or conditions",
      },
    ];
  }

  return [
    {
      id: 1,
      title: `What should you understand before claiming readiness in ${gateTitle}?`,
      options: [
        "Only definitions",
        "How to apply it in practical tasks",
        "Only the name of the technology",
        "Only where the logo is used",
      ],
      correctAnswer: "How to apply it in practical tasks",
    },
    {
      id: 2,
      title: "What is the best proof of a skill for a junior candidate?",
      options: [
        "A copied definition",
        "A small working project or task",
        "Only a nice CV design",
        "A random certificate without practice",
      ],
      correctAnswer: "A small working project or task",
    },
    {
      id: 3,
      title: "What should you do if a gate result is weak?",
      options: [
        "Ignore it and apply everywhere",
        "Practice the weak areas and retry later",
        "Delete the roadmap",
        "Change the company name",
      ],
      correctAnswer: "Practice the weak areas and retry later",
    },
    {
      id: 4,
      title: "What does readiness mean in DreamCastle?",
      options: [
        "You watched one video",
        "You can explain and apply the skill",
        "You added the skill to CV",
        "You heard about the skill",
      ],
      correctAnswer: "You can explain and apply the skill",
    },
    {
      id: 5,
      title: "What should a practice task be connected to?",
      options: [
        "The real requirement",
        "Random design trends",
        "Only colors",
        "Only animations",
      ],
      correctAnswer: "The real requirement",
    },
  ];
}

export default function GateCheckPage() {
  const { gateId } = useParams();
  const navigate = useNavigate();

  const roadmap = getStoredRoadmap();

  const gateTitle = useMemo(() => {
    if (!roadmap || !gateId) return null;

    const requirement = roadmap.requirements.find(
      (item, index) => createSlug(item, index + 1) === gateId,
    );

    return requirement || null;
  }, [roadmap, gateId]);

  const questions = useMemo(() => {
    if (!gateTitle) return [];

    return getQuestions(gateTitle);
  }, [gateTitle]);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<GateResult | null>(null);

  function selectAnswer(questionId: number, answer: string) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  }

  function finishCheck() {
    if (!gateId || !gateTitle) return;

    const correct = questions.filter(
      (question) => answers[question.id] === question.correctAnswer,
    ).length;

    const score = Math.round((correct / questions.length) * 100);
    const status = getStatus(score);

    const newResult: GateResult = {
      gateId,
      gateTitle,
      score,
      correct,
      total: questions.length,
      status,
      createdAt: new Date().toISOString(),
    };

    const savedResults = localStorage.getItem(RESULTS_STORAGE_KEY);
    const parsedResults: GateResult[] = savedResults
      ? JSON.parse(savedResults)
      : [];

    const updatedResults = [
      ...parsedResults.filter((item) => item.gateId !== gateId),
      newResult,
    ];

    localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(updatedResults));
    setResult(newResult);
  }

  function resetCheck() {
    setAnswers({});
    setResult(null);
  }

  if (!roadmap || !gateTitle) {
    return (
      <section className="mx-auto max-w-5xl px-5 py-20">
        <NavLink
          to="/roadmap"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--text-muted)] transition hover:text-[var(--raspberry)]"
        >
          <ArrowLeft size={17} />
          Back to roadmap
        </NavLink>

        <h1 className="text-5xl font-black">Gate not found</h1>

        <p className="mt-4 text-[var(--text-muted)]">
          Create a roadmap first or select an available gate.
        </p>
      </section>
    );
  }

  const allAnswered = questions.every((question) => answers[question.id]);

  return (
    <section className="relative overflow-hidden">
      <div className="hero-glow hero-glow-left" />
      <div className="hero-glow hero-glow-right" />

      <div className="mx-auto max-w-5xl px-5 py-10">
        <NavLink
          to="/roadmap"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[var(--text-muted)] transition hover:text-[var(--raspberry)]"
        >
          <ArrowLeft size={17} />
          Back to roadmap
        </NavLink>

        <div className="mb-8 rounded-[2.5rem] border border-[var(--border)] bg-white p-7 shadow-big">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--raspberry-soft)] text-[var(--raspberry)]">
            <ShieldCheck size={28} />
          </div>

          <p className="font-bold text-[var(--raspberry)]">Gate Check</p>

          <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
            {gateTitle}
          </h1>

          <p className="mt-4 max-w-2xl leading-8 text-[var(--text-muted)]">
            Answer these questions to estimate your readiness for this gate.
            This is not a final exam — it is a quick signal of what to improve.
          </p>
        </div>

        {result ? (
          <div className="rounded-[2.5rem] border border-[var(--border)] bg-white p-7 shadow-big">
            <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
              <div className="text-center">
                <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-full border-[12px] border-[var(--green)] bg-[var(--green-soft)]">
                  <span className="text-5xl font-black text-[var(--green)]">
                    {result.score}%
                  </span>
                </div>

                <h2 className="mt-5 text-3xl font-black">{result.status}</h2>

                <p className="mt-2 text-[var(--text-muted)]">
                  {result.correct} correct out of {result.total}
                </p>
              </div>

              <div>
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg)] p-6">
                  <div className="mb-4 flex items-center gap-2 font-black text-[var(--green)]">
                    <CheckCircle2 size={20} />
                    Result saved
                  </div>

                  <p className="leading-7 text-[var(--text-muted)]">
                    Your result was saved locally. Later the roadmap will use
                    this score to unlock the next gate automatically.
                  </p>
                </div>

                <div className="mt-5 rounded-3xl border border-[var(--border)] bg-[var(--raspberry-soft)] p-6">
                  <div className="mb-4 flex items-center gap-2 font-black text-[var(--raspberry)]">
                    <Target size={20} />
                    Recommended next step
                  </div>

                  <p className="leading-7 text-[var(--text-main)]">
                    Build a small practical task connected to{" "}
                    <strong>{gateTitle}</strong>, then retry this check after
                    practice.
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={resetCheck}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-white px-6 py-3 font-bold shadow-soft transition hover:-translate-y-0.5"
                  >
                    <RotateCcw size={18} />
                    Retry check
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/roadmap")}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--raspberry)] px-6 py-3 font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-[var(--raspberry-dark)]"
                  >
                    Back to roadmap
                    <ClipboardCheck size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-5">
            {questions.map((question) => (
              <div
                key={question.id}
                className="rounded-[2rem] border border-[var(--border)] bg-white p-6 shadow-soft"
              >
                <p className="mb-2 text-sm font-black text-[var(--raspberry)]">
                  Question {question.id}
                </p>

                <h2 className="text-2xl font-black">{question.title}</h2>

                <div className="mt-5 grid gap-3">
                  {question.options.map((option) => {
                    const isSelected = answers[question.id] === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => selectAnswer(question.id, option)}
                        className={`rounded-2xl border px-5 py-4 text-left font-bold transition hover:-translate-y-0.5 ${
                          isSelected
                            ? "border-[var(--raspberry)] bg-[var(--raspberry-soft)] text-[var(--raspberry)]"
                            : "border-[var(--border)] bg-[var(--bg)] text-[var(--text-main)]"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={finishCheck}
              disabled={!allAnswered}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--raspberry)] px-7 py-4 font-bold text-white shadow-soft transition hover:-translate-y-1 hover:bg-[var(--raspberry-dark)] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
            >
              Finish Gate Check
              <CheckCircle2 size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}