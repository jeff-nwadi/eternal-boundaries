"use client";

import { useActionState, useState } from "react";
import { ArrowRight } from "lucide-react";
import { requestDemo } from "@/app/actions/demo-request";
import { CLOSING_CTA_CONTENT } from "@/lib/content";
import { demoRequestSchema, type DemoRequestState } from "@/lib/schemas/demo-request";

const initialState: DemoRequestState = { status: "idle" };

export function DemoRequestForm() {
  const [state, formAction, pending] = useActionState(requestDemo, initialState);
  const [emailError, setEmailError] = useState(false);

  function validateBeforeSubmit(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const result = demoRequestSchema.safeParse({ email: formData.get("email") });
    setEmailError(!result.success);
    if (!result.success) event.preventDefault();
  }

  const status = emailError
    ? CLOSING_CTA_CONTENT.invalidEmail
    : state.status === "not_configured"
      ? CLOSING_CTA_CONTENT.notConfigured
      : state.status === "invalid"
        ? CLOSING_CTA_CONTENT.invalidEmail
        : "";

  return (
    <form
      action={formAction}
      onSubmit={validateBeforeSubmit}
      className="mt-7 max-w-xl"
      noValidate
    >
      <label htmlFor="demo-email" className="mb-2 block text-sm font-medium">
        {CLOSING_CTA_CONTENT.emailLabel}
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="demo-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          placeholder={CLOSING_CTA_CONTENT.emailPlaceholder}
          aria-invalid={emailError || state.status === "invalid"}
          aria-describedby="demo-consent demo-status"
          onChange={() => setEmailError(false)}
          className="h-12 w-full min-w-0 rounded-xl border border-foreground/15 bg-background px-4 text-base placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-accent-foreground sm:w-auto sm:flex-1"
        />
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-medium text-primary-foreground transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-accent-foreground disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? CLOSING_CTA_CONTENT.pendingLabel : CLOSING_CTA_CONTENT.submitLabel}
          <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>
      <p id="demo-consent" className="mt-3 text-sm leading-5 text-foreground/65">
        {CLOSING_CTA_CONTENT.consent}
      </p>
      <p id="demo-status" aria-live="polite" className="mt-2 min-h-5 text-sm text-foreground/65">
        {status}
      </p>
      <div className="absolute -left-[10000px] top-auto size-px overflow-hidden" aria-hidden="true">
        <label htmlFor="demo-website">{CLOSING_CTA_CONTENT.honeypotLabel}</label>
        <input id="demo-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
    </form>
  );
}
