"use client";

/*
  Name + email capture, mono-chromed to match the terminal language.
  Progressive states via useActionState; the time-trap field is stamped
  on mount so instant bot submissions get silently swallowed.
*/
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { submitLead, type LeadState } from "@/app/actions/lead";
import { leadForm } from "@/content/site";

const initial: LeadState = { status: "idle" };

function SubmitButton({
  label,
  tone = "light",
}: {
  label: string;
  tone?: "light" | "accent";
}) {
  const { pending } = useFormStatus();
  const look =
    tone === "accent"
      ? "bg-bg-dark text-white hover:bg-black"
      : "bg-accent text-accent-on shadow-[3px_3px_0_rgba(10,10,10,0.9)] hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-accent-hover hover:shadow-[2px_2px_0_rgba(10,10,10,0.9)]";
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full rounded-lg px-6 py-3.5 font-bold transition-all duration-150 disabled:cursor-wait disabled:opacity-80 ${look}`}
    >
      {pending ? (
        <span className="font-mono text-[13px] tracking-[0.1em]">
          {leadForm.submitting}
        </span>
      ) : (
        <>
          {label}
          <span className="ml-2">→</span>
        </>
      )}
    </button>
  );
}

export default function LeadForm({
  source,
  cta,
  tone = "light",
}: {
  source: string;
  cta: string;
  /** "accent" restyles the form for the saturated blue pricing card. */
  tone?: "light" | "accent";
}) {
  const [state, action] = useActionState(submitLead, initial);
  const timeRef = useRef<HTMLInputElement>(null);
  const onAccent = tone === "accent";

  useEffect(() => {
    if (timeRef.current) timeRef.current.value = String(Date.now());
  }, []);

  if (state.status === "success") {
    return (
      <div
        className={
          onAccent
            ? "border border-white/60 bg-white/15 p-5"
            : "border border-accent bg-accent-soft p-5"
        }
      >
        <p
          className={`font-mono text-[12px] tracking-[0.12em] ${
            onAccent ? "text-white" : "text-accent"
          }`}
        >
          {leadForm.success}
          <span
            className={`hud-cursor ml-2 inline-block h-[12px] w-[6px] align-middle ${
              onAccent ? "bg-white" : "bg-accent"
            }`}
          />
        </p>
        <p
          className={`mt-2 text-[13px] leading-relaxed ${
            onAccent ? "text-white/85" : "text-ink-body"
          }`}
        >
          {leadForm.successNote}
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-3">
      {/* honeypot: humans never see it, bots fill it */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
      />
      <input ref={timeRef} type="hidden" name="t" defaultValue="0" />
      <input type="hidden" name="source" value={source} />

      <label className="block">
        <span
          className={`font-mono text-[10px] tracking-[0.18em] ${
            onAccent ? "text-white/70" : "text-ink-muted"
          }`}
        >
          {leadForm.nameLabel}
        </span>
        <input
          type="text"
          name="name"
          required
          maxLength={120}
          placeholder={leadForm.namePlaceholder}
          className={`mt-1 w-full border px-3 py-2.5 font-mono text-[14px] focus:outline-none ${
            onAccent
              ? "border-white/30 bg-white/10 text-white placeholder:text-white/50 focus:border-white"
              : "border-line bg-bg text-ink placeholder:text-ink-muted focus:border-accent"
          }`}
        />
      </label>
      <label className="block">
        <span
          className={`font-mono text-[10px] tracking-[0.18em] ${
            onAccent ? "text-white/70" : "text-ink-muted"
          }`}
        >
          {leadForm.emailLabel}
        </span>
        <input
          type="email"
          name="email"
          required
          placeholder={leadForm.emailPlaceholder}
          className={`mt-1 w-full border px-3 py-2.5 font-mono text-[14px] focus:outline-none ${
            onAccent
              ? "border-white/30 bg-white/10 text-white placeholder:text-white/50 focus:border-white"
              : "border-line bg-bg text-ink placeholder:text-ink-muted focus:border-accent"
          }`}
        />
      </label>
      <SubmitButton label={cta} tone={tone} />
      {state.status === "error" && (
        <p
          role="alert"
          className={`font-mono text-[11px] tracking-[0.06em] ${
            onAccent ? "text-white" : "text-accent"
          }`}
        >
          ✕ {state.message === "invalid" ? leadForm.invalid : leadForm.error}
        </p>
      )}
    </form>
  );
}
