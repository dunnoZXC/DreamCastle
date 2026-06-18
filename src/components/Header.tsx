import { NavLink } from "react-router";
import { Castle } from "lucide-react";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/create-roadmap", label: "Build path" },
  { path: "/roadmap", label: "Roadmap" },
  { path: "/dashboard", label: "Dashboard" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <NavLink to="/" className="flex items-center gap-2 font-bold">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--raspberry)] text-white shadow-soft">
            <Castle size={21} />
          </span>

          <span className="text-xl tracking-tight">
            Dream<span className="text-[var(--raspberry)]">Castle</span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-7 text-sm font-medium text-[var(--text-muted)] md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? "text-[var(--raspberry)]"
                  : "transition hover:text-[var(--text-main)]"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <NavLink
          to="/create-roadmap"
          className="rounded-full bg-[var(--raspberry)] px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-[var(--raspberry-dark)]"
        >
          Get started
        </NavLink>
      </div>
    </header>
  );
}