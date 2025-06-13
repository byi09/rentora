import clsx from "clsx";
import { Dialog } from "radix-ui";

export function ProfileFieldEditable({
  children,
  className,
  field,
  value,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  field: string;
  value?: React.ReactNode;
}) {
  return (
    <div
      className={clsx("flex justify-between flex-col md:flex-row", className)}
      {...props}
    >
      <b className="font-medium">{field}</b>
      <div className="flex md:items-center gap-4">
        {value}
        {children}
      </div>
    </div>
  );
}

export function ProfileFieldAction({
  className,
  field,
  action,
  popupTitle,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  field: string;
  action: string;
  popupTitle: string;
}) {
  return (
    <div
      className={clsx("flex justify-between flex-col md:flex-row", className)}
      {...props}
    >
      <b className="font-medium">{field}</b>
      <div className="flex items-center gap-4">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="text-blue-700 hover:ring-2 rounded px-2 ml-auto md:ml-0">
              {action}
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="bg-opacity-50 bg-gray-950 fixed inset-0 z-50" />
            <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
              <Dialog.Title className="text-lg font-semibold text-center mb-4">
                {popupTitle}
              </Dialog.Title>
              {props.children}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}
