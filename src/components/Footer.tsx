import { Castle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="mb-4 flex items-center gap-2 font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--raspberry-soft)] text-[var(--raspberry)]">
              <Castle size={19} />
            </span>
            DreamCastle
          </div>

          <p className="max-w-md text-sm leading-6 text-[var(--text-muted)]">
            A career roadmap platform that turns your dream role into gates,
            checks, progress and real preparation.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold">Product</h3>
          <ul className="space-y-2 text-sm text-[var(--text-muted)]">
            <li>Roadmap</li>
            <li>Gate Checks</li>
            <li>Progress</li>
            <li>Dashboard</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold">Contact</h3>
          <ul className="space-y-2 text-sm text-[var(--text-muted)]">
            <li>dreamcastle@example.com</li>
            <li>Ukraine</li>
            <li>Student project</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}