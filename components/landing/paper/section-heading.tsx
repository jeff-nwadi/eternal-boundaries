"use client";

import * as React from "react";

/**
 * Shared section intro — heading + optional subheading. Left-aligned by default
 * so every section's headline is arranged the same way. `centered` opts a single
 * section (the FAQ) into centered-on-desktop / left-on-mobile.
 */
export function SectionHeading({
  title,
  subtitle,
  centered = false,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  centered?: boolean;
  className?: string;
}) {
  return (
    <div
      className={[
        "mb-[28px] max-w-[640px] text-left sm:mb-[44px]",
        centered ? "sm:mx-auto sm:text-center" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <h2 className="text-[30px] font-[620] leading-[1.1] text-balance sm:text-[clamp(30px,3.1vw,40px)]">
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 max-w-[560px] text-[16px] leading-[1.6] text-balance text-[var(--paper-muted)]${
            centered ? " sm:mx-auto" : ""
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
