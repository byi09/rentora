import clsx from "clsx";

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
