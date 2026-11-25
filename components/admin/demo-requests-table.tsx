"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { deleteDemoRequest } from "@/app/actions/demo-requests";
import { Button } from "@/components/ui/button";
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

export type DemoRequestRow = {
  id: string;
  email: string;
  status: string;
  createdAt: Date;
};

const statusPill: Record<string, string> = {
  new: "bg-primary/15 text-primary",
  reviewed: "bg-black/[0.06] text-black/60",
  archived: "bg-black/[0.04] text-black/45",
};

function fmt(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function DemoRequestsTable({ requests }: { requests: DemoRequestRow[] }) {
  if (requests.length === 0) {
    return (
      <div className="rounded-2xl bg-black/[0.04] p-6 text-sm text-black/55">
        No demo requests yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-black/[0.04]">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-black/55">
            <th className="px-6 py-3 font-normal">Email</th>
            <th className="px-6 py-3 font-normal">Status</th>
            <th className="px-6 py-3 font-normal">Received</th>
            <th className="px-6 py-3 font-normal text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id} className="border-t border-black/[0.06]">
              <td className="px-6 py-3 font-medium text-black">{r.email}</td>
              <td className="px-6 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    statusPill[r.status] ?? "bg-black/[0.06] text-black/60"
                  }`}
                >
                  {r.status}
                </span>
              </td>
              <td className="px-6 py-3 tabular-nums text-black/55">{fmt(r.createdAt)}</td>
              <td className="px-6 py-3 text-right">
                <RowActions request={r} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RowActions({ request }: { request: DemoRequestRow }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  function onDelete() {
    startTransition(async () => {
      const res = await deleteDemoRequest(request.id);
      if ("error" in res) {
        toast.error(res.error);
        return;
      }
      toast.success("Request deleted.");
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <div className="flex justify-end">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Delete request from ${request.email}`}
        onClick={() => setOpen(true)}
        className="text-black/50 hover:text-destructive"
      >
        <Trash2 strokeWidth={1.75} />
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this request?</AlertDialogTitle>
            <AlertDialogDescription>
              The demo request from{" "}
              <span className="text-foreground">{request.email}</span> will be
              permanently removed. This can&apos;t be undone.
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
              {pending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
