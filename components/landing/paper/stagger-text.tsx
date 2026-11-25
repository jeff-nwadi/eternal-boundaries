import * as React from "react";

/**
 * Static headline. (Per-word text animation was removed by request.) Renders the
 * lines with <br> between them. Keeps data-stagger-text so the hero motion
 * entrance continues to skip this node.
 */
export function StaggerText({
  lines,
  className,
}: {
  lines: string[];
  className?: string;
}) {
  return (
    <h1 className={className} data-stagger-text>
      {lines.map((line, i) => (
        <React.Fragment key={line}>
          {i > 0 ? <br /> : null}
          {line}
        </React.Fragment>
      ))}
    </h1>
  );
}
