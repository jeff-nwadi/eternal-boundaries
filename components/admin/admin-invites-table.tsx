"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { revokeInvite } from "@/app/actions/invites";
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

export type AdminInvite = {
  id: string;
  email: string;
  role: string;
  invitedByAdminId: string;
  createdAt: Date;
  expiresAt: Date;
  redeemedAt: Date | null;
};

type InviteState = { label: string; tone: Tone };

function inviteState(row: AdminInvite): InviteState {
  if (row.redeemedAt) return { label: "Redeemed", tone: "positive" };
  if (new Date(row.expiresAt).getTime() < Date.now())
    return { label: "Expired", tone: "neutral" };
  return { label: "Pending", tone: "medium" };
}

function fmt(date: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(date)
  );
}

const columns: ColumnDef<AdminInvite>[] = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.original.email}</span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <span className="capitalize text-muted-foreground">{row.original.role}</span>
    ),
  },
  {
    id: "status",
    header: "Status",
    accessorFn: (row) => inviteState(row).label,
    cell: ({ row }) => {
      const s = inviteState(row.original);
      return <StatusPill label={s.label} tone={s.tone} />;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <span className="tabular-nums text-muted-foreground">{fmt(row.original.createdAt)}</span>
    ),
  },
  {
    accessorKey: "expiresAt",
    header: "Expires",
    cell: ({ row }) => (
      <span className="tabular-nums text-muted-foreground">{fmt(row.original.expiresAt)}</span>
    ),
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    cell: ({ row }) => <InviteRowActions invite={row.original} />,
  },
];

export function AdminInvitesTable({ invites }: { invites: AdminInvite[] }) {
  return (
    <DataTable
      columns={columns}
      data={invites}
      searchable
      searchPlaceholder="Search invites…"
      emptyMessage="No invites yet."
    />
  );
}

function InviteRowActions({ invite }: { invite: AdminInvite }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();
  const canRevoke = !invite.redeemedAt;

  function onRevoke() {
    startTransition(async () => {
      const res = await revokeInvite(invite.id);
      if ("error" in res) {
        toast.error(res.error);
        return;
      }
      toast.success(`Invite to ${invite.email} revoked.`);
      setConfirmOpen(false);
      router.refresh();
    });
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${invite.email}`}>
            <MoreHorizontal strokeWidth={1.75} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onSelect={() => setDetailsOpen(true)}>
            <Eye strokeWidth={1.75} />
            View details
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            disabled={!canRevoke}
            onSelect={(e) => {
              e.preventDefault();
              setConfirmOpen(true);
            }}
          >
            <Trash2 strokeWidth={1.75} />
            Revoke invite
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke this invite?</AlertDialogTitle>
            <AlertDialogDescription>
              The invite link for{" "}
              <span className="text-foreground">{invite.email}</span> will stop
              working immediately. This can&apos;t be undone — you&apos;d need to
              issue a new invite.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onRevoke();
              }}
              disabled={pending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {pending ? "Revoking…" : "Revoke invite"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite details</DialogTitle>
            <DialogDescription>{invite.email}</DialogDescription>
          </DialogHeader>
          <dl className="grid grid-cols-3 gap-x-3 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Role</dt>
            <dd className="col-span-2 capitalize text-foreground">{invite.role}</dd>
            <dt className="text-muted-foreground">Status</dt>
            <dd className="col-span-2 text-foreground">{inviteState(invite).label}</dd>
            <dt className="text-muted-foreground">Created</dt>
            <dd className="col-span-2 tabular-nums text-foreground">{fmt(invite.createdAt)}</dd>
            <dt className="text-muted-foreground">Expires</dt>
            <dd className="col-span-2 tabular-nums text-foreground">{fmt(invite.expiresAt)}</dd>
            <dt className="text-muted-foreground">Issued by</dt>
            <dd className="col-span-2 font-mono text-xs break-all text-muted-foreground">
              {invite.invitedByAdminId}
            </dd>
          </dl>
        </DialogContent>
      </Dialog>
    </div>
  );
}
