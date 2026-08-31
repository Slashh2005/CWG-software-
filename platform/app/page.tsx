import { isSupabaseConfigured } from "@/lib/supabase/env";

const BUILD_STEPS = [
  { label: "Project scaffold — Next.js, TypeScript, Tailwind", done: true },
  { label: "Design tokens carried over from the approved mockup", done: true },
  { label: "Database schema + row level security policies", done: true },
  { label: "Supabase connected (accounts, database, file storage)", done: false },
  { label: "Carrier registration and sign-in", done: false },
  { label: "Live load board", done: false },
  { label: "Booking requests and admin approval", done: false },
  { label: "Compliance document uploads", done: false },
  { label: "Notification emails", done: false },
];

export default function Home() {
  const connected = isSupabaseConfigured();

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.17em] text-ink-faint">
        Build in progress
      </p>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Load booking platform</h1>
      <p className="mt-2 max-w-lg text-ink-soft">
        The production build of the approved mockup. This page is a placeholder while the
        real screens are wired up.
      </p>

      <div
        className={`mt-8 rounded-xl border p-4 text-sm ${
          connected
            ? "border-line bg-card text-ink-soft"
            : "border-amber/30 bg-amber-tint text-ink"
        }`}
      >
        <span className="font-semibold">
          {connected ? "Database connected." : "Not connected to a database yet."}
        </span>{" "}
        {connected
          ? "Supabase credentials are present in this environment."
          : "Add the Supabase keys to .env.local — see SETUP.md for the steps."}
      </div>

      <ol className="mt-8 space-y-px overflow-hidden rounded-xl border border-line bg-card">
        {BUILD_STEPS.map((step) => (
          <li
            key={step.label}
            className="flex items-center gap-3 border-b border-line-soft px-4 py-3 last:border-b-0"
          >
            <span
              aria-hidden
              className={`flex size-5 flex-none items-center justify-center rounded-full text-[11px] font-bold ${
                step.done ? "bg-primary text-white" : "border border-line text-ink-faint"
              }`}
            >
              {step.done ? "✓" : ""}
            </span>
            <span className={step.done ? "text-ink" : "text-ink-faint"}>{step.label}</span>
          </li>
        ))}
      </ol>

      <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
        Load booking platform · built for CWG Holdings
      </p>
    </main>
  );
}
