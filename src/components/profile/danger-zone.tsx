"use client";

import { useState, useTransition } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { deleteAccount } from "@/lib/actions/profile";
import { signOut } from "@/lib/actions/auth";

export function DangerZone() {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirmText !== "DELETE") {
      toast.error('Type "DELETE" to confirm');
      return;
    }
    startTransition(async () => {
      await deleteAccount();
    });
  };

  return (
    <>
      <Card className="border-[rgba(239,68,68,0.3)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[rgb(239,68,68)]">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.03)]">
            <div>
              <p className="font-medium text-[rgb(15,23,42)] dark:text-white text-sm">Delete account</p>
              <p className="text-xs text-[rgb(100,116,139)] mt-0.5">
                Permanently delete your account and all habit data. This cannot be undone.
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteOpen(true)}
              className="flex-shrink-0 ml-4"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[rgb(239,68,68)]">Delete Account</DialogTitle>
            <DialogDescription>
              This will permanently delete your account, all habits, and all tracking data.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <Input
              label='Type "DELETE" to confirm'
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
            />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setDeleteOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                loading={isPending}
                disabled={confirmText !== "DELETE"}
                className="flex-1"
              >
                Delete permanently
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
