import Link from "next/link";

import { BrandMark } from "@/components/landing/brand-mark";

type FooterColumn = {
  title: string;
  links: { label: string; href: string }[];
};

const COLUMNS: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#platform" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Standards", href: "#standards" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Get started", href: "/login" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "#" },
      { label: "Privacy", href: "#" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="px-4 pt-10">
      <div className="mx-auto max-w-[100rem] overflow-hidden rounded-t-[2rem] border border-b-0 border-border bg-card sm:rounded-t-[2.75rem]">
        <div className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-10 sm:py-16">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
            {/* Brand */}
            <div className="flex flex-col gap-3">
              <BrandMark className="text-xl" />
              <p className="max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
                Threat intelligence, vulnerability, and compliance signal — read
                in one place, by the teams accountable for it.
              </p>
            </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground/70">
                  {col.title}
                </span>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="rounded-sm text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm tabular-nums text-muted-foreground">
            © {new Date().getFullYear()} Eternal Boundaries LLC
          </span>
          <div className="flex items-center gap-1">
            <SocialLink label="Eternal Boundaries on X" href="#">
              <XIcon />
            </SocialLink>
            <SocialLink label="Eternal Boundaries on GitHub" href="#">
              <GitHubIcon />
            </SocialLink>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 ease-out hover:bg-accent hover:text-foreground [&>svg]:transition-transform [&>svg]:duration-200 [&>svg]:ease-out hover:[&>svg]:scale-110"
    >
      {children}
    </Link>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.699-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}
