"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Brand pill button with an expanding-circle hover: a white circle grows to fill
 * the button, inverting it from a solid purple fill to an outlined purple button.
 * Adapted from the "Get started" component — brand purple, no icon.
 *
 * Renders an <a> (Next Link) when `href` is given, otherwise a <button>. Size and
 * padding come from `className` so each placement keeps its own dimensions.
 */
const base =
  "group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-[#5b2bd2] bg-[#5b2bd2] font-[650] !text-white transition-colors duration-300 hover:!text-[#5b2bd2] focus-visible:!text-[#5b2bd2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5b2bd2]/40 focus-visible:ring-offset-2";

function Inner({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-white transition-transform duration-500 ease-out group-hover:scale-[40] group-focus-visible:scale-[40]"
      />
      <span className="relative z-10">{children}</span>
    </>
  );
}

type GetStartedButtonProps = {
  href?: string;
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function GetStartedButton({
  href,
  children,
  className,
  ...rest
}: GetStartedButtonProps) {
  if (href) {
    return (
      <Link href={href} className={cn(base, "h-11 px-5 text-[13px]", className)}>
        <Inner>{children}</Inner>
      </Link>
    );
  }
  return (
    <button {...rest} type={rest.type ?? "button"} className={cn(base, "h-11 px-5 text-[13px]", className)}>
      <Inner>{children}</Inner>
    </button>
  );
}

export default GetStartedButton;
