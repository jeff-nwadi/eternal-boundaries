"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, MoreHorizontal, ShieldCheck } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { promoteToAuditor } from "@/app/actions/invites";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { StatusPill, type Tone } from "@/components/dashboard/status-pill";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
};

const roleTone: Record<string, Tone> = {
  admin: "positive",
  auditor: "low",
  analyst: "neutral",
};

function fmt(date: Date) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(date)
  );
}

const columns: ColumnDef<AdminUser>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <StatusPill
        label={row.original.role}
        tone={roleTone[row.original.role] ?? "neutral"}
        className="capitalize"
      />
    ),
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    cell: ({ row }) => <UserRowActions user={row.original} />,
  },
];

export function AdminUsersTable({ users }: { users: AdminUser[] }) {
  return (
    <DataTable
      columns={columns}
      data={users}
      searchable
      searchPlaceholder="Search users…"
      emptyMessage="No users yet."
    />
  );
}

function UserRowActions({ user }: { user: AdminUser }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();
  const canPromote = user.role === "analyst";

  function onPromote() {
    startTransition(async () => {
      const res = await promoteToAuditor(user.id);
      if ("error" in res) {
        toast.error(res.error);
        return;
      }
      toast.success(`${user.name} is now an auditor.`);
      setConfirmOpen(false);
      router.refresh();
    });
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${user.name}`}>
            <MoreHorizontal strokeWidth={1.75} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onSelect={() => setDetailsOpen(true)}>
            <Eye strokeWidth={1.75} />
            View details
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!canPromote}
            onSelect={(e) => {
              e.preventDefault();
              setConfirmOpen(true);
            }}
          >
            <ShieldCheck strokeWidth={1.75} />
            Promote to auditor
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Deliberate confirmation — auditor carries compliance weight (§6a). */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Promote {user.name} to auditor?</AlertDialogTitle>
            <AlertDialogDescription>
              Auditors can see sensitive compliance data, and this is the only way
              to grant that role. Promote{" "}
              <span className="text-foreground">{user.email}</span> only if you mean
              to.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onPromote();
              }}
              disabled={pending}
            >
              {pending ? "Promoting…" : "Promote to auditor"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{user.name}</DialogTitle>
            <DialogDescription>{user.email}</DialogDescription>
          </DialogHeader>
          <dl className="grid grid-cols-3 gap-x-3 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Role</dt>
            <dd className="col-span-2 capitalize text-foreground">{user.role}</dd>
            <dt className="text-muted-foreground">Joined</dt>
            <dd className="col-span-2 tabular-nums text-foreground">{fmt(user.createdAt)}</dd>
            <dt className="text-muted-foreground">User id</dt>
            <dd className="col-span-2 font-mono text-xs break-all text-muted-foreground">
              {user.id}
            </dd>
          </dl>
        </DialogContent>
      </Dialog>
    </div>
  );
}
