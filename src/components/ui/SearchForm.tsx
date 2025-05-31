import clsx from "clsx";
import { HTMLAttributes } from "react";

export function SearchSelect({
  className,
  options,
  defaultValue = "null",
  ...props
}: Omit<HTMLAttributes<HTMLSelectElement>, "children"> & {
  options: { value: string; label: string }[];
}) {
  return (
    <select
      className={
        clsx(
          "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900",
          className
        )
      }
      defaultValue={defaultValue}
      {...props}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

export function SearchCheckbox({
  id,
  className,
  field,
  ...props
}: HTMLAttributes<HTMLInputElement> & {
  field: string;
}) {
  return (
    <label
      className={clsx("flex items-center space-x-2 text-gray-700", className)}
      htmlFor={id}
    >
      <input
        id={id}
        type="checkbox"
        className="rounded"
        {...props}
      />
      <span>{field}</span>
    </label>
  )
}
