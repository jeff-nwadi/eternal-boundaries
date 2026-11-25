"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { requestDemo } from "@/app/actions/demo-request";
import { GetStartedButton } from "@/components/ui/get-started-button";
import { ConfettiCannon, type ConfettiCannonHandle } from "@/components/ui/motion-confetti";
import { CLOSING_CTA_CONTENT } from "@/lib/content";
import { demoRequestSchema, type DemoRequestState } from "@/lib/schemas/demo-request";

const initialState: DemoRequestState = { status: "idle" };

const ERROR_MESSAGE: Partial<Record<DemoRequestState["status"], string>> = {
  invalid: CLOSING_CTA_CONTENT.invalidEmail,
  rate_limited: "Too many requests — please try again in a few minutes.",
  error: "Something went wrong on our end. Please try again.",
};

export function DemoRequestForm() {
  const [state, formAction, pending] = useActionState(requestDemo, initialState);
  const [emailError, setEmailError] = useState(false);
  const confettiRef = useRef<ConfettiCannonHandle>(null);

  // Celebrate once the request has actually gone through.
  useEffect(() => {
    if (state.status === "success") confettiRef.current?.fire();
  }, [state.status]);

  function validateBeforeSubmit(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const result = demoRequestSchema.safeParse({ email: formData.get("email") });
    setEmailError(!result.success);
    if (!result.success) event.preventDefault();
  }

  if (state.status === "success") {
    return (
      <div className="relative mt-7 max-w-xl">
        <ConfettiCannon ref={confettiRef} className="!left-8 !top-4" />
        <div className="flex items-start gap-3 rounded-2xl border border-foreground/10 bg-background/70 p-5">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#5b2bd2]" strokeWidth={2} aria-hidden />
          <div>
            <p className="text-base font-medium text-foreground">Request received</p>
            <p className="mt-1 text-sm leading-6 text-foreground/70">
              Thanks — we&apos;ve got your request and will email you shortly to set up a
              demo.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const statusMessage = emailError
    ? CLOSING_CTA_CONTENT.invalidEmail
    : (ERROR_MESSAGE[state.status] ?? "");

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
        <GetStartedButton
          type="submit"
          disabled={pending}
          className="h-12 w-full shrink-0 rounded-xl px-5 text-base font-medium disabled:cursor-wait disabled:opacity-70 sm:w-auto"
        >
          {pending ? CLOSING_CTA_CONTENT.pendingLabel : CLOSING_CTA_CONTENT.submitLabel}
        </GetStartedButton>
      </div>
      <p id="demo-consent" className="mt-3 text-sm leading-5 text-foreground/65">
        {CLOSING_CTA_CONTENT.consent}
      </p>
      <p
        id="demo-status"
        aria-live="polite"
        className="mt-2 min-h-5 text-sm text-destructive"
      >
        {statusMessage}
      </p>
      <div className="absolute -left-[10000px] top-auto size-px overflow-hidden" aria-hidden="true">
        <label htmlFor="demo-website">{CLOSING_CTA_CONTENT.honeypotLabel}</label>
        <input id="demo-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
    </form>
  );
}
