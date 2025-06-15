"use client";

import { AlertDialog } from "radix-ui";
import { EditDialogCancel, EditDialogSubmit } from "./EditDialog";
import { useState, useTransition } from "react";
import { deleteAccount } from "@/src/db/actions";
import { createClient } from "@/utils/supabase/client";

export default function DeleteAccountAction() {
  const [isDeleting, startDelete] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const handleDelete = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startDelete(async () => {
      const res = await deleteAccount();
      if (res.success) {
        // log out
        await fetch("/api/auth/logout", {
          method: "POST"
        });
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = "/";
      } else {
        setServerError(res.error || "Failed to delete account");
      }
    });
  };

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button className="text-red-700 hover:bg-red-50 rounded px-2">
          Delete
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-opacity-50 bg-gray-950 fixed inset-0 z-50" />
        <AlertDialog.Content className="fixed z-50 overflow-y-auto inset-0 grid place-items-center">
          <form
            className="my-16 w-[90vw] max-w-md bg-white p-6 rounded-lg shadow-lg"
            onSubmit={handleDelete}
          >
            <AlertDialog.Title className="text-lg font-semibold">
              Are you sure?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-gray-700 mb-4 mt-2">
              This action cannot be undone. Your account and all associated data
              will be permanently deleted.
            </AlertDialog.Description>
            {serverError && (
              <p className="text-red-500 text-sm mt-2">{serverError}</p>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <AlertDialog.Cancel asChild>
                <EditDialogCancel />
              </AlertDialog.Cancel>
              <EditDialogSubmit
                className="bg-red-600 hover:bg-red-700"
                value="Confirm"
                loading={isDeleting}
              />
            </div>
          </form>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
