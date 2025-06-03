import clsx from "clsx";
import { DropdownMenu } from "radix-ui";
import { HiChevronDown } from "react-icons/hi";

export default function Dropdown({
  children,
  trigger = "Dropdown",
  className,
  align = "start",
  triggerClassName
}: {
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  className?: string;
  triggerClassName?: string;
  align?: "start" | "center" | "end";
}) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        className={clsx("flex items-center gap-2 px-4 py-1 border border-gray-400 rounded-lg outline-none hover:ring-1", triggerClassName)}
      >
        {typeof trigger === 'string' ? (
          <>
            {trigger}
            <HiChevronDown />
          </>
        ) : trigger}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        align={align}
        className={clsx("z-30 px-4 py-2 mt-2 rounded-lg border border-gray-400 shadow-lg bg-white", className)}
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export function DropdownItem({
  children,
  onClick
}: {
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <DropdownMenu.Item
      className="px-2 py-1 text-gray-800 hover:bg-gray-100 cursor-pointer rounded"
      onClick={onClick}
    >
      {children}
    </DropdownMenu.Item>
  )
}
