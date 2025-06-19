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
        className={clsx(
          "flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg outline-none transition-all duration-200",
          "hover:border-gray-400 hover:shadow-sm hover:bg-gray-50",
          "focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:border-blue-500",
          "data-[state=open]:border-blue-500 data-[state=open]:ring-2 data-[state=open]:ring-blue-500 data-[state=open]:ring-offset-1",
          triggerClassName
        )}
      >
        {typeof trigger === 'string' ? (
          <>
            <span className="text-sm font-medium">{trigger}</span>
            <HiChevronDown className="w-4 h-4 transition-transform duration-200 data-[state=open]:rotate-180" />
          </>
        ) : (
          <>
            {trigger}
            <HiChevronDown className="w-4 h-4 transition-transform duration-200 data-[state=open]:rotate-180" />
          </>
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        align={align}
        className={clsx(
          "z-50 min-w-[8rem] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "p-1 mt-2",
          className
        )}
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export function DropdownItem({
  children,
  onClick,
  className,
  disabled = false
}: {
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <DropdownMenu.Item
      className={clsx(
        "relative flex cursor-default select-none items-center rounded-md px-3 py-2 text-sm outline-none transition-colors duration-150",
        "hover:bg-gray-100 focus:bg-gray-100",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </DropdownMenu.Item>
  )
}

export function DropdownSeparator({ className }: { className?: string }) {
  return (
    <DropdownMenu.Separator
      className={clsx("-mx-1 my-1 h-px bg-gray-200", className)}
    />
  )
}

export function DropdownLabel({ 
  children, 
  className 
}: { 
  children?: React.ReactNode; 
  className?: string; 
}) {
  return (
    <DropdownMenu.Label
      className={clsx("px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider", className)}
    >
      {children}
    </DropdownMenu.Label>
  )
}
