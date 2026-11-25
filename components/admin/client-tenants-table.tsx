"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreHorizontal, PauseCircle, PlayCircle, Trash2 } from "lucide-react";

import { suspendTenant, reactivateTenant, deleteTenant } from "@/app/actions/invites";
import { Button } from "@/components/ui/button";
import { StatusPill, type Tone } from "@/components/dashboard/status-pill";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

export type ClientTenant = {
  id: string;
  name: string;
  status: string;
};

function statusTone(status: string): Tone {
  return status === "suspended" ? "critical" : "positive";
}

function statusLabel(status: string): string {
  return status === "suspended" ? "Suspended" : "Active";
}

export function ClientTenantsTable({ tenants }: { tenants: ClientTenant[] }) {
  if (tenants.length === 0) {
    return (
      <div className="rounded-2xl bg-black/[0.04] p-6 text-sm text-black/55">
        No client tenants provisioned yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-black/[0.04]">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-black/55">
            <th className="px-6 py-3 font-normal">Organization</th>
            <th className="px-6 py-3 font-normal">Tenant ID</th>
            <th className="px-6 py-3 font-normal">Status</th>
            <th className="px-6 py-3 font-normal text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((t) => (
            <tr key={t.id} className="border-t border-black/[0.06]">
              <td className="px-6 py-3 font-medium text-black">{t.name}</td>
              <td className="px-6 py-3 font-mono text-black/55">{t.id}</td>
              <td className="px-6 py-3">
                <StatusPill label={statusLabel(t.status)} tone={statusTone(t.status)} />
              </td>
              <td className="px-6 py-3 text-right">
                <TenantRowActions tenant={t} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TenantRowActions({ tenant }: { tenant: ClientTenant }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();
  const isSuspended = tenant.status === "suspended";

  function onConfirm() {
    startTransition(async () => {
      const res = isSuspended
        ? await reactivateTenant(tenant.id)
        : await suspendTenant(tenant.id);
      if ("error" in res) {
        toast.error(res.error);
        return;
      }
      toast.success(
        isSuspended
          ? `${tenant.name} reactivated.`
          : `${tenant.name} suspended.`
      );
      setConfirmOpen(false);
      router.refresh();
    });
  }

  function onDelete() {
    startTransition(async () => {
      const res = await deleteTenant(tenant.id);
      if ("error" in res) {
        toast.error(res.error);
        return;
      }
      toast.success(`${tenant.name} deleted.`);
      setDeleteOpen(false);
      router.refresh();
    });
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${tenant.name}`}>
            <MoreHorizontal strokeWidth={1.75} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          {isSuspended ? (
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setConfirmOpen(true);
              }}
            >
              <PlayCircle strokeWidth={1.75} />
              Reactivate tenant
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              variant="destructive"
              onSelect={(e) => {
                e.preventDefault();
                setConfirmOpen(true);
              }}
            >
              <PauseCircle strokeWidth={1.75} />
              Suspend tenant
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onSelect={(e) => {
              e.preventDefault();
              setDeleteOpen(true);
            }}
          >
            <Trash2 strokeWidth={1.75} />
            Delete tenant
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isSuspended
                ? `Reactivate ${tenant.name}?`
                : `Suspend ${tenant.name}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isSuspended ? (
                <>
                  Users in{" "}
                  <span className="text-foreground">{tenant.name}</span> will be
                  able to sign in and use the dashboard again.
                </>
              ) : (
                <>
                  Every user in{" "}
                  <span className="text-foreground">{tenant.name}</span> will be
                  locked out of the dashboard immediately. You can reactivate the
                  tenant at any time — nothing is deleted.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onConfirm();
              }}
              disabled={pending}
              className={
                isSuspended
                  ? undefined
                  : "bg-destructive text-black hover:bg-destructive/90"
              }
            >
              {pending
                ? isSuspended
                  ? "Reactivating…"
                  : "Suspending…"
                : isSuspended
                  ? "Reactivate tenant"
                  : "Suspend tenant"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {tenant.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes{" "}
              <span className="text-foreground">{tenant.name}</span> and{" "}
              <span className="text-foreground">
                all of its users, invites and sessions
              </span>
              . It can&apos;t be undone — suspend instead if you only need to block
              access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onDelete();
              }}
              disabled={pending}
              className="bg-destructive text-black hover:bg-destructive/90"
            >
              {pending ? "Deleting…" : "Delete tenant"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
