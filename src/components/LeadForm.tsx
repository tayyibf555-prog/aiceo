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

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-accent px-6 py-3 font-bold text-accent-on shadow-[3px_3px_0_rgba(10,10,10,0.9)] transition-all duration-150 hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-accent-hover hover:shadow-[2px_2px_0_rgba(10,10,10,0.9)] disabled:cursor-wait disabled:opacity-80"
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
}: {
  source: string;
  cta: string;
}) {
  const [state, action] = useActionState(submitLead, initial);
  const timeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (timeRef.current) timeRef.current.value = String(Date.now());
  }, []);

  if (state.status === "success") {
    return (
      <div className="border border-accent bg-accent-soft p-5">
        <p className="font-mono text-[12px] tracking-[0.12em] text-accent">
          {leadForm.success}
          <span className="hud-cursor ml-2 inline-block h-[12px] w-[6px] bg-accent align-middle" />
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-body">
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
        <span className="font-mono text-[10px] tracking-[0.18em] text-ink-muted">
          {leadForm.nameLabel}
        </span>
        <input
          type="text"
          name="name"
          required
          maxLength={120}
          placeholder={leadForm.namePlaceholder}
          className="mt-1 w-full border border-line bg-bg px-3 py-2.5 font-mono text-[14px] text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
        />
      </label>
      <label className="block">
        <span className="font-mono text-[10px] tracking-[0.18em] text-ink-muted">
          {leadForm.emailLabel}
        </span>
        <input
          type="email"
          name="email"
          required
          placeholder={leadForm.emailPlaceholder}
          className="mt-1 w-full border border-line bg-bg px-3 py-2.5 font-mono text-[14px] text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
        />
      </label>
      <SubmitButton label={cta} />
      {state.status === "error" && (
        <p
          role="alert"
          className="font-mono text-[11px] tracking-[0.06em] text-accent"
        >
          ✕ {state.message === "invalid" ? leadForm.invalid : leadForm.error}
        </p>
      )}
    </form>
  );
}
