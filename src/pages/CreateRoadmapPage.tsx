import { useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { useNavigate } from "react-router";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Plus,
  Sparkles,
  Target,
  Trash2,
} from "lucide-react";

type RoadmapData = {
  id: string;
  targetRole: string;
  companyName: string;
  vacancyTitle: string;
  requirements: string[];
  createdAt: string;
};

const STORAGE_KEY = "dreamcastle:activeRoadmap";

const templates = [
  {
    name: "Junior Frontend",
    role: "Junior Frontend Developer",
    requirements: ["HTML/CSS", "JavaScript", "React", "REST API", "Git", "Portfolio"],
  },
  {
    name: "Manual QA",
    role: "Junior Manual QA Engineer",
    requirements: [
      "Test Cases",
      "Bug Reports",
      "Regression Testing",
      "API Testing",
      "SQL",
      "Jira",
    ],
  },
  {
    name: "React Intern",
    role: "React Developer Intern",
    requirements: ["HTML/CSS", "JavaScript", "React", "Components", "Forms", "GitHub"],
  },
];

export default function CreateRoadmapPage() {
  const navigate = useNavigate();

  const [targetRole, setTargetRole] = useState("Junior Frontend Developer");
  const [companyName, setCompanyName] = useState("Example Company");
  const [vacancyTitle, setVacancyTitle] = useState("Junior Frontend Developer");
  const [requirementInput, setRequirementInput] = useState("");
  const [requirements, setRequirements] = useState<string[]>([
    "HTML/CSS",
    "JavaScript",
    "React",
    "REST API",
    "Git",
    "Portfolio",
  ]);

  function addRequirement() {
    const value = requirementInput.trim();

    if (!value) return;

    const alreadyExists = requirements.some(
      (item) => item.toLowerCase() === value.toLowerCase(),
    );

    if (alreadyExists) {
      setRequirementInput("");
      return;
    }

    setRequirements((prev) => [...prev, value]);
    setRequirementInput("");
  }

  function removeRequirement(requirement: string) {
    setRequirements((prev) => prev.filter((item) => item !== requirement));
  }

  function handleRequirementKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addRequirement();
    }
  }

  function applyTemplate(template: (typeof templates)[number]) {
    setTargetRole(template.role);
    setVacancyTitle(template.role);
    setRequirements(template.requirements);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!targetRole.trim()) {
      alert("Add your target role first.");
      return;
    }

    if (requirements.length < 2) {
      alert("Add at least 2 requirements to build a roadmap.");
      return;
    }

    const roadmap: RoadmapData = {
      id: String(Date.now()),
      targetRole: targetRole.trim(),
      companyName: companyName.trim(),
      vacancyTitle: vacancyTitle.trim(),
      requirements,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(roadmap));

    navigate("/roadmap");
  }

  return (
    <section className="relative overflow-hidden">
      <div className="hero-glow hero-glow-left" />
      <div className="hero-glow hero-glow-right" />

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--text-muted)] shadow-soft">
            <Sparkles size={16} className="text-[var(--raspberry)]" />
            Step 1 — Build your path
          </div>

          <h1 className="max-w-2xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
            Turn a vacancy into your{" "}
            <span className="text-[var(--raspberry)]">career map.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--text-muted)]">
            Add your target role and requirements. DreamCastle will transform
            them into gates on your path to the castle.
          </p>

          <div className="mt-8 rounded-[2rem] border border-[var(--border)] bg-white p-6 shadow-soft">
            <h2 className="text-xl font-black">Quick templates</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              Use a preset to quickly test how the roadmap will work.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {templates.map((template) => (
                <button
                  key={template.name}
                  type="button"
                  onClick={() => applyTemplate(template)}
                  className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5 hover:border-[var(--raspberry)] hover:text-[var(--raspberry)]"
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-[2rem] border border-[var(--border)] bg-[var(--text-main)] p-6 text-white shadow-soft">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <Target size={23} className="text-[var(--green)]" />
            </div>

            <h2 className="text-xl font-black">How gates are created</h2>

            <p className="mt-3 leading-7 text-white/70">
              Every requirement becomes a Gate. Later each Gate will have a
              readiness check, result score and practice task.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[2.5rem] border border-[var(--border)] bg-white p-6 shadow-big md:p-8"
        >
          <div className="mb-8">
            <p className="font-bold text-[var(--raspberry)]">Roadmap setup</p>
            <h2 className="mt-2 text-3xl font-black">Create your roadmap</h2>
          </div>

          <div className="grid gap-5">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-bold">
                <Target size={17} className="text-[var(--raspberry)]" />
                Target role
              </span>

              <input
                value={targetRole}
                onChange={(event) => setTargetRole(event.target.value)}
                placeholder="Junior Frontend Developer"
                className="roadmap-input"
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-bold">
                  <Building2 size={17} className="text-[var(--raspberry)]" />
                  Company name
                </span>

                <input
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  placeholder="Example Company"
                  className="roadmap-input"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-bold">
                  <BriefcaseBusiness
                    size={17}
                    className="text-[var(--raspberry)]"
                  />
                  Vacancy title
                </span>

                <input
                  value={vacancyTitle}
                  onChange={(event) => setVacancyTitle(event.target.value)}
                  placeholder="Junior Frontend"
                  className="roadmap-input"
                />
              </label>
            </div>

            <div>
              <span className="mb-2 block text-sm font-bold">
                Requirements
              </span>

              <div className="flex gap-3">
                <input
                  value={requirementInput}
                  onChange={(event) => setRequirementInput(event.target.value)}
                  onKeyDown={handleRequirementKeyDown}
                  placeholder="Example: TypeScript"
                  className="roadmap-input"
                />

                <button
                  type="button"
                  onClick={addRequirement}
                  className="flex h-13 w-13 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--raspberry)] text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-[var(--raspberry-dark)]"
                  aria-label="Add requirement"
                >
                  <Plus size={22} />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {requirements.map((requirement) => (
                  <div
                    key={requirement}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm font-bold"
                  >
                    {requirement}

                    <button
                      type="button"
                      onClick={() => removeRequirement(requirement)}
                      className="text-[var(--text-muted)] transition hover:text-[var(--raspberry)]"
                      aria-label={`Remove ${requirement}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--raspberry)] px-7 py-4 font-bold text-white shadow-soft transition hover:-translate-y-1 hover:bg-[var(--raspberry-dark)]"
          >
            Build my path
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </section>
  );
}