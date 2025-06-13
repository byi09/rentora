"use client";

import { Dialog } from "radix-ui";
import { EditDialog, EditDialogCancel, EditDialogSubmit } from "../EditDialog";
import { Input } from "../../ui/input";
import { FieldErrors, Resolver, useForm } from "react-hook-form";
import { useCallback, useState, useTransition } from "react";
import { changeUsername } from "@/src/db/actions";
import { useAccountSetting } from "@/src/contexts/AccountSettingContext";

interface FormValues {
  username: string;
}

const resolver: Resolver<FormValues> = async (values) => {
  const errors: FieldErrors<FormValues> = {};

  if (!values.username) {
    errors.username = {
      type: "required",
      message: "Username is required"
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
  const { updateAccountDetails } = useAccountSetting();

  const onSubmit = useCallback(
    async (data: FormValues) => {
      startLoading(async () => {
        await changeUsername(data.username);
        setIsOpen(false);
        updateAccountDetails({
          username: data.username
        });
      });
    },
    [updateAccountDetails]
  );

  return (
    <EditDialog field="Username" open={isOpen} onOpenChange={setIsOpen}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-1">
          <label htmlFor="username">Username</label>
          <Input {...register("username")} />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>
        <div className="flex gap-4 justify-end">
          <Dialog.Close asChild>
            <EditDialogCancel />
          </Dialog.Close>
          <EditDialogSubmit loading={isLoading} />
        </div>
      </form>
    </EditDialog>
  );
}
