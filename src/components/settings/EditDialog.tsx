import { cn } from "@/utils/styles";
import { Dialog } from "radix-ui";
import { ImSpinner2 } from "react-icons/im";

export function EditDialog({
  children,
  field,
  ...props
}: React.ComponentPropsWithoutRef<typeof Dialog.Root> & {
  field: string;
}) {
  return (
    <Dialog.Root {...props}>
      <Dialog.Trigger asChild>
        <button className="text-blue-700 hover:bg-blue-50 rounded px-2 ml-auto md:ml-0">
          Edit
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-opacity-50 bg-gray-950 fixed inset-0 z-50" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
          <Dialog.Title className="text-lg font-semibold text-center mb-4">
            Edit {field}
          </Dialog.Title>
          <Dialog.Description asChild>{children}</Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function EditDialogCancel({
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLButtonElement>, "children">) {
  return (
    <button
      {...props}
      className={cn(
        className,
        "border rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
      )}
    >
      Cancel
    </button>
  );
}

export function EditDialogConfirm({
  className,
  children = "Confirm",
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        className,
        "rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors flex gap-2 items-center"
      )}
    >
      {children}
    </button>
  );
}

export function EditDialogSubmit({
  className,
  loading,
  ...props
}: Omit<React.HTMLAttributes<HTMLButtonElement>, "children"> & {
  loading?: boolean;
}) {
  return (
    <button
      {...props}
      className={cn(
        className,
        "rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors flex gap-2 items-center",
        loading && "opacity-50 cursor-not-allowed"
      )}
      type="submit"
    >
      {loading ? <ImSpinner2 className="animate-spin" /> : null}
      Apply
    </button>
  );
}
