"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SmoothScroll } from "@/components/smooth-scroll";
import { BrandMark } from "@/components/landing/brand-mark";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";

type ShellUser = { name: string; email: string; role: string };

export function DashboardShell({
  user,
  orgName,
  children,
}: {
  user: ShellUser;
  orgName: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={150}>
      <SmoothScroll>
      <div className="min-h-dvh bg-background text-white">
        {/* Desktop sidebar (>= lg) */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 lg:block">
        <SidebarNav user={user} orgName={orgName} />
      </aside>

      {/* Mobile top bar + drawer (< lg) */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between px-4 lg:hidden">
        <BrandMark />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Open menu"
            className="inline-flex size-9 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[260px] border-0 bg-background p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SidebarNav
              user={user}
              orgName={orgName}
              onNavigate={() => setOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </header>

      {/* Main content — keyed by route so each page gently fades/slides in */}
      <main className="lg:pl-60">
        <div
          key={pathname}
          className="mx-auto w-full max-w-6xl px-4 py-6 duration-500 animate-in fade-in-0 slide-in-from-bottom-1 sm:px-6 lg:px-10 lg:py-10"
        >
          {children}
        </div>
      </main>
      </div>
      </SmoothScroll>
    </TooltipProvider>
  );
}
