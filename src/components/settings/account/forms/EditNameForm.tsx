"use client";

import { FieldErrors, Resolver, useForm } from "react-hook-form";
import { Input } from "../../../ui/input";
import { EditDialog, EditDialogCancel, EditDialogSubmit } from "../EditDialog";
import { Dialog } from "radix-ui";
import { useCallback, useState, useTransition } from "react";
import { changeName } from "@/src/db/actions";
import { useAccountSetting } from "@/src/contexts/AccountSettingContext";

interface FormValues {
  firstName: string;
  lastName: string;
}

const resolver: Resolver<FormValues> = async (values) => {
  const errors: FieldErrors<FormValues> = {};

  if (!values.firstName) {
    errors.firstName = {
      type: "required",
      message: "First name is required"
    };
  }

  if (!values.lastName) {
    errors.lastName = {
      type: "required",
      message: "Last name is required"
    };
  }

  const hasErrors = Object.keys(errors).length > 0;

  return {
    values: hasErrors ? {} : values,
    errors: hasErrors ? errors : {}
  };
};

export default function EditNameForm() {
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
        await changeName(data.firstName, data.lastName);
        setIsOpen(false);
        updateAccountDetails({
          firstName: data.firstName,
          lastName: data.lastName
        });
      });
    },
    [updateAccountDetails]
  );

  return (
    <EditDialog field="Name" open={isOpen} onOpenChange={setIsOpen}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-4">
          <div className="space-y-1">
            <label htmlFor="firstName">First Name</label>
            <Input {...register("firstName")} />
            {errors.firstName && (
              <p className="text-red-600 text-sm">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <label htmlFor="lastName">Last Name</label>
            <Input {...register("lastName")} />
            {errors.lastName && (
              <p className="text-red-600 text-sm">{errors.lastName.message}</p>
            )}
          </div>
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
