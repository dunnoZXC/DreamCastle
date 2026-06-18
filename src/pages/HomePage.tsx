import { motion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  Castle,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  FileCheck,
  GitBranch,
  Map,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { NavLink } from "react-router";

const features = [
  {
    icon: Map,
    title: "Personalized roadmap",
    text: "Turn a vacancy or career goal into a clear path of gates.",
  },
  {
    icon: ShieldCheck,
    title: "Gate Checks",
    text: "Check if you are actually ready for each requirement.",
  },
  {
    icon: BadgeCheck,
    title: "Real progress",
    text: "Track readiness, weak points and next steps before applying.",
  },
];

const gates = [
  { title: "Start", status: "open" },
  { title: "HTML/CSS", status: "ready" },
  { title: "JavaScript", status: "active" },
  { title: "React", status: "locked" },
  { title: "API Project", status: "locked" },
  { title: "Portfolio", status: "locked" },
  { title: "Castle", status: "locked" },
];

const painPoints = [
  {
    icon: SearchCheck,
    title: "Job requirements feel chaotic",
    text: "Vacancies often mix core skills, tools, frameworks, soft skills and bonus requirements in one long list.",
  },
  {
    icon: Code2,
    title: "It is hard to know your real level",
    text: "Watching tutorials is not the same as being ready to solve tasks, explain decisions and pass an interview.",
  },
  {
    icon: GitBranch,
    title: "Portfolio often does not match the role",
    text: "DreamCastle helps connect every requirement with proof: tasks, projects and preparation steps.",
  },
];

const gateCheckItems = [
  {
    icon: ClipboardCheck,
    title: "Theory check",
    text: "Short questions to verify that you understand the base concepts.",
  },
  {
    icon: Code2,
    title: "Practical scenarios",
    text: "Small tasks that show if you can apply the skill in real work situations.",
  },
  {
    icon: FileCheck,
    title: "Result summary",
    text: "Clear score, strong areas, weak areas and recommended next steps.",
  },
];

const resultStats = [
  { label: "Overall readiness", value: "72%" },
  { label: "Completed gates", value: "3 / 5" },
  { label: "Current gate", value: "React" },
  { label: "Castle status", value: "Locked" },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="hero-glow hero-glow-left" />
        <div className="hero-glow hero-glow-right" />

        <div className="mx-auto grid min-h-[calc(100vh-74px)] max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--text-muted)] shadow-soft">
              <Sparkles size={16} className="text-[var(--raspberry)]" />
              Career roadmap for junior IT specialists
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-tight md:text-7xl">
              Build your path from{" "}
              <span className="text-[var(--raspberry)]">dream role</span> to
              real skills.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--text-muted)]">
              DreamCastle turns your career goal or vacancy into a gamified
              roadmap. Each skill becomes a gate. Each gate checks your real
              readiness before you move closer to the castle.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <NavLink
                to="/create-roadmap"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--raspberry)] px-7 py-4 font-bold text-white shadow-soft transition hover:-translate-y-1 hover:bg-[var(--raspberry-dark)]"
              >
                Build my path
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </NavLink>

              <NavLink
                to="/roadmap"
                className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-white px-7 py-4 font-bold text-[var(--text-main)] shadow-soft transition hover:-translate-y-1"
              >
                View demo roadmap
              </NavLink>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="rounded-3xl border border-[var(--border)] bg-white/80 p-5 shadow-soft backdrop-blur"
                  >
                    <Icon size={23} className="mb-3 text-[var(--raspberry)]" />
                    <h3 className="font-bold">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                      {feature.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="relative"
          >
            <div className="rounded-[2.5rem] border border-[var(--border)] bg-white p-5 shadow-big">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-muted)]">
                    Demo path
                  </p>
                  <h2 className="text-2xl font-black">
                    Junior Frontend Developer
                  </h2>
                </div>

                <div className="rounded-full bg-[var(--green-soft)] px-4 py-2 text-sm font-bold text-[var(--green)]">
                  42% ready
                </div>
              </div>

              <div className="roadmap-preview">
                {gates.map((gate, index) => (
                  <div
                    key={gate.title}
                    className={`gate-node gate-${gate.status}`}
                    style={{
                      gridColumn:
                        index === 0
                          ? "1 / span 2"
                          : index === 1
                            ? "2 / span 2"
                            : index === 2
                              ? "4 / span 2"
                              : index === 3
                                ? "3 / span 2"
                                : index === 4
                                  ? "5 / span 2"
                                  : index === 5
                                    ? "4 / span 2"
                                    : "6 / span 2",
                      gridRow:
                        index === 0
                          ? "6"
                          : index === 1
                            ? "5"
                            : index === 2
                              ? "4"
                              : index === 3
                                ? "3"
                                : index === 4
                                  ? "2"
                                  : index === 5
                                    ? "1"
                                    : "1",
                    }}
                  >
                    <span className="gate-dot">
                      {gate.status === "ready" ? (
                        <CheckCircle2 size={16} />
                      ) : gate.title === "Castle" ? (
                        <Castle size={17} />
                      ) : (
                        <Target size={15} />
                      )}
                    </span>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                        {gate.title === "Start" ? "Entry" : `Gate ${index}`}
                      </p>
                      <h3>{gate.title}</h3>
                    </div>
                  </div>
                ))}

                <svg
                  className="roadmap-lines"
                  viewBox="0 0 620 420"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M80 365 C120 330, 170 315, 205 290 S270 235, 325 220 S390 175, 350 135 S450 95, 500 65"
                    stroke="var(--line)"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M80 365 C120 330, 170 315, 205 290 S270 235, 325 220"
                    stroke="var(--raspberry)"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 hidden rounded-3xl border border-[var(--border)] bg-white p-5 shadow-big md:block">
              <p className="text-sm font-semibold text-[var(--text-muted)]">
                Current gate
              </p>
              <p className="text-xl font-black">JavaScript</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 font-bold text-[var(--raspberry)]">
              How it works
            </p>
            <h2 className="text-4xl font-black tracking-tight">
              From vacancy chaos to a clear path.
            </h2>
            <p className="mt-4 leading-7 text-[var(--text-muted)]">
              DreamCastle does not replace job boards. It helps you understand
              what to do after you find a vacancy.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Add your goal",
                text: "Choose a role or paste vacancy requirements.",
              },
              {
                step: "02",
                title: "Unlock your gates",
                text: "Each requirement becomes a gate on your path.",
              },
              {
                step: "03",
                title: "Check readiness",
                text: "Pass Gate Checks and get practice tasks.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg)] p-7"
              >
                <span className="text-sm font-black text-[var(--raspberry)]">
                  {item.step}
                </span>
                <h3 className="mt-4 text-2xl font-black">{item.title}</h3>
                <p className="mt-3 leading-7 text-[var(--text-muted)]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
            <section className="bg-[var(--bg)]">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="mb-3 font-bold text-[var(--raspberry)]">
                Why it matters
              </p>

              <h2 className="text-4xl font-black tracking-tight md:text-5xl">
                DreamCastle is not another job board.
              </h2>

              <p className="mt-5 max-w-xl leading-8 text-[var(--text-muted)]">
                Job boards help you find vacancies. DreamCastle helps you
                understand what to do next: which skills are missing, what to
                practice and when you are actually ready to apply.
              </p>
            </div>

            <div className="grid gap-5">
              {painPoints.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-[2rem] border border-[var(--border)] bg-white p-6 shadow-soft"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--raspberry-soft)] text-[var(--raspberry)]">
                      <Icon size={22} />
                    </div>

                    <h3 className="text-xl font-black">{item.title}</h3>

                    <p className="mt-3 leading-7 text-[var(--text-muted)]">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 font-bold text-[var(--raspberry)]">
              Gate Checks
            </p>

            <h2 className="text-4xl font-black tracking-tight md:text-5xl">
              Each gate checks real readiness.
            </h2>

            <p className="mt-4 leading-7 text-[var(--text-muted)]">
              DreamCastle does not ask only “do you know React?”. It checks
              whether you can explain, apply and prove the skill.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {gateCheckItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg)] p-7"
                >
                  <div className="mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-white text-[var(--raspberry)] shadow-soft">
                    <Icon size={24} />
                  </div>

                  <h3 className="text-2xl font-black">{item.title}</h3>

                  <p className="mt-3 leading-7 text-[var(--text-muted)]">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[var(--bg)]">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div className="rounded-[2.5rem] border border-[var(--border)] bg-white p-7 shadow-big">
              <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-[var(--raspberry)]">
                    Example result
                  </p>

                  <h2 className="mt-2 text-3xl font-black">
                    JavaScript Gate
                  </h2>
                </div>

                <div className="rounded-full bg-[var(--green-soft)] px-4 py-2 text-sm font-black text-[var(--green)]">
                  Almost ready
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {resultStats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-3xl border border-[var(--border)] bg-[var(--bg)] p-5"
                  >
                    <p className="text-sm font-semibold text-[var(--text-muted)]">
                      {item.label}
                    </p>
                    <p className="mt-2 text-2xl font-black">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-[var(--border)] bg-[var(--green-soft)] p-5">
                <div className="mb-3 flex items-center gap-2 font-black text-[var(--green)]">
                  <CheckCircle2 size={20} />
                  Strong areas
                </div>

                <p className="leading-7 text-[var(--text-main)]">
                  Variables, functions, arrays and basic DOM events.
                </p>
              </div>

              <div className="mt-4 rounded-3xl border border-[var(--border)] bg-[var(--raspberry-soft)] p-5">
                <div className="mb-3 flex items-center gap-2 font-black text-[var(--raspberry)]">
                  <Target size={20} />
                  Needs practice
                </div>

                <p className="leading-7 text-[var(--text-main)]">
                  Async logic, API requests, error handling and real project
                  structure.
                </p>
              </div>
            </div>

            <div>
              <p className="mb-3 font-bold text-[var(--raspberry)]">
                Clear output
              </p>

              <h2 className="text-4xl font-black tracking-tight md:text-5xl">
                Not just a score. A next step.
              </h2>

              <p className="mt-5 max-w-xl leading-8 text-[var(--text-muted)]">
                After every Gate Check, the user receives a readiness score,
                strong areas, weak areas and a practical task that helps move
                closer to the next gate.
              </p>

              <div className="mt-8 rounded-[2rem] border border-[var(--border)] bg-white p-6 shadow-soft">
                <p className="text-sm font-bold text-[var(--text-muted)]">
                  Recommended task
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  Build a vacancy filter with API data
                </h3>

                <p className="mt-3 leading-7 text-[var(--text-muted)]">
                  Render job cards, add stack filters, show loading and error
                  states, then save the result to your portfolio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[var(--text-main)] p-8 text-white shadow-big md:p-12">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[var(--raspberry)] opacity-30 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[var(--green)] opacity-25 blur-3xl" />

            <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                  <Trophy size={28} className="text-[var(--green)]" />
                </div>

                <h2 className="max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
                  Build your castle one gate at a time.
                </h2>

                <p className="mt-5 max-w-2xl leading-8 text-white/70">
                  Start with one vacancy or one career goal. DreamCastle will
                  help you turn it into a structured path of skills, checks and
                  real preparation.
                </p>
              </div>

              <NavLink
                to="/create-roadmap"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--raspberry)] px-7 py-4 font-bold text-white shadow-soft transition hover:-translate-y-1 hover:bg-[var(--raspberry-dark)]"
              >
                Start building
                <ArrowRight size={18} />
              </NavLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}