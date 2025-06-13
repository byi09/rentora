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
import { useCallback, useState, useTransition } from "react";
import { changeEmail } from "@/src/db/actions";

interface FormValues {
  email: string;
}

const resolver: Resolver<FormValues> = async (values) => {
  const errors: FieldErrors<FormValues> = {};

  if (!values.email) {
    errors.email = {
      type: "required",
      message: "Email is required"
    };
  } else if (!values.email.match(/^.+@.+$/)) {
    errors.email = {
      type: "pattern",
      message: "Email must be a valid email address"
    };
  }

  const hasErrors = Object.keys(errors).length > 0;

  return {
    values: hasErrors ? {} : values,
    errors: hasErrors ? errors : {}
  };
};

export default function EditUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({ resolver });
  const [isLoading, startLoading] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const onSubmit = useCallback(async (data: FormValues) => {
    startLoading(async () => {
      setServerError(null);
      setEmailSent(false);

      const res = await changeEmail(data.email);
      if (res.success === false) {
        setServerError(res.error || "Failed to update email");
        return;
      }

      setEmailSent(true);
    });
  }, []);

  return (
    <EditDialog field="Email" open={isOpen} onOpenChange={setIsOpen}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-1">
          {serverError && (
            <p className="text-red-500 text-sm mb-2">{serverError}</p>
          )}
          {emailSent && (
            <p className="text-green-500 text-sm mb-2">
              Confirmation emails have been sent to both your old and new email
              addresses. Please confirm both emails to proceed.
            </p>
          )}
          <label htmlFor="email">New Email</label>
          <Input {...register("email")} />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
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
