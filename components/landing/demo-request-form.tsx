"use client";

import { useActionState, useRef, useState } from "react";
import { requestDemo } from "@/app/actions/demo-request";
import { GetStartedButton } from "@/components/ui/get-started-button";
import { ConfettiCannon, type ConfettiCannonHandle } from "@/components/ui/motion-confetti";
import { CLOSING_CTA_CONTENT } from "@/lib/content";
import { demoRequestSchema, type DemoRequestState } from "@/lib/schemas/demo-request";

const initialState: DemoRequestState = { status: "idle" };

export function DemoRequestForm() {
  const [state, formAction, pending] = useActionState(requestDemo, initialState);
  const [emailError, setEmailError] = useState(false);
  const confettiRef = useRef<ConfettiCannonHandle>(null);

  function validateBeforeSubmit(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const result = demoRequestSchema.safeParse({ email: formData.get("email") });
    setEmailError(!result.success);
    if (!result.success) {
      event.preventDefault();
      return;
    }
    // Valid submission — celebrate.
    confettiRef.current?.fire();
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
        <div className="relative w-full shrink-0 sm:w-auto">
          <ConfettiCannon ref={confettiRef} />
          <GetStartedButton
            type="submit"
            disabled={pending}
            className="h-12 w-full rounded-xl px-5 text-base font-medium disabled:cursor-wait disabled:opacity-70"
          >
            {pending ? CLOSING_CTA_CONTENT.pendingLabel : CLOSING_CTA_CONTENT.submitLabel}
          </GetStartedButton>
        </div>
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
