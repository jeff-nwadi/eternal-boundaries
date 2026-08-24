"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ClipboardCheck, LayoutDashboard, Radar, Shield, ShieldAlert } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

/** Event name other components dispatch to open the palette (e.g. a header button). */
export const OPEN_COMMAND_MENU = "eb:open-command-menu";

export function CommandMenu({ isAdmin = false }: { isAdmin?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    document.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_COMMAND_MENU, onOpen);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_COMMAND_MENU, onOpen);
    };
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command menu"
      description="Jump to a view or action"
    >
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => go("/dashboard")}>
            <LayoutDashboard />
            Overview
          </CommandItem>
          <CommandItem onSelect={() => go("/dashboard/threat")}>
            <Radar />
            Threat Intelligence
          </CommandItem>
          <CommandItem onSelect={() => go("/dashboard/vulnerabilities")}>
            <ShieldAlert />
            Vulnerabilities
          </CommandItem>
          <CommandItem onSelect={() => go("/dashboard/compliance")}>
            <ClipboardCheck />
            Compliance
          </CommandItem>
        </CommandGroup>
        {isAdmin && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Admin">
              <CommandItem onSelect={() => go("/admin")}>
                <Shield />
                Admin console
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
