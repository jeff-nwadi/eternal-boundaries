"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { authInputClass } from "@/components/auth/auth-shell";

/**
 * Password field with a show/hide toggle. Takes the same styling as the other
 * auth inputs and adds an eye button that switches the input between
 * password/text. Accepts all the usual input props (id, value, onChange, …).
 */
export function PasswordInput({
  className,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [show, setShow] = React.useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={show ? "text" : "password"}
        className={cn(authInputClass, "pr-11", className)}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        aria-pressed={show}
        className="absolute inset-y-0 right-0 flex items-center rounded-r-lg px-3 text-muted-foreground/70 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        {show ? (
          <EyeOff className="size-4" strokeWidth={1.75} aria-hidden />
        ) : (
          <Eye className="size-4" strokeWidth={1.75} aria-hidden />
        )}
      </button>
    </div>
  );
}
