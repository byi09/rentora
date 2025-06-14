"use client";

import { Dialog } from "radix-ui";
import {
  EditDialog,
  EditDialogCancel,
  EditDialogConfirm,
  EditDialogSubmit
} from "../EditDialog";
import { Input } from "../../ui/input";
import { FieldErrors, Resolver, useForm } from "react-hook-form";
import { useCallback, useEffect, useState, useTransition } from "react";
import { changePassword } from "@/src/db/actions";

interface FormValues {
  newPassword: string;
  confirmNewPassword: string;
}

const resolver: Resolver<FormValues> = async (values) => {
  const errors: FieldErrors<FormValues> = {};

  // TODO: add password complexity requirements

  if (!values.newPassword) {
    errors.newPassword = {
      type: "required",
      message: "Password is required"
    };
  }

  if (!values.confirmNewPassword) {
    errors.confirmNewPassword = {
      type: "required",
      message: "Confirm password is required"
    };
  } else if (values.newPassword !== values.confirmNewPassword) {
    errors.confirmNewPassword = {
      type: "validate",
      message: "Passwords do not match"
    };
  }

  const hasErrors = Object.keys(errors).length > 0;

  return {
    values: hasErrors ? {} : values,
    errors: hasErrors ? errors : {}
  };
};

export default function EditPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField
  } = useForm<FormValues>({ resolver });
  const [isLoading, startLoading] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setEmailSent(false);
    setServerError(null);
    resetField("newPassword");
    resetField("confirmNewPassword");
  }, [isOpen, resetField]);

  const onSubmit = useCallback(async (data: FormValues) => {
    startLoading(async () => {
      setServerError(null);
      setEmailSent(false);

      const res = await changePassword(data.newPassword);
      if (res.success === false) {
        setServerError(res.error || "Failed to update email");
        return;
      }

      setEmailSent(true);
    });
  }, []);

  return (
    <EditDialog field="Password" open={isOpen} onOpenChange={setIsOpen}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-1">
          {serverError && (
            <p className="text-red-500 text-sm mb-2">{serverError}</p>
          )}
          {emailSent && (
            <p className="text-green-500 text-sm mb-2">
              Your password has been updated successfully.
            </p>
          )}
          <label htmlFor="newPassword">New Password</label>
          <Input
            type="password"
            disabled={emailSent}
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.newPassword.message}
            </p>
          )}
          <label htmlFor="confirmNewPassword">Confirm New Password</label>
          <Input
            type="password"
            disabled={emailSent}
            {...register("confirmNewPassword")}
          />
          {errors.confirmNewPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmNewPassword.message}
            </p>
          )}
        </div>
        <div className="flex gap-4 justify-end">
          <Dialog.Close asChild>
            <EditDialogCancel />
          </Dialog.Close>
          {emailSent ? (
            <Dialog.Close asChild>
              <EditDialogConfirm />
            </Dialog.Close>
          ) : (
            <EditDialogSubmit loading={isLoading} />
          )}
        </div>
      </form>
    </EditDialog>
  );
}
