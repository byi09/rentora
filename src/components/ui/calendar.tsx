/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import DatePicker from "react-datepicker";
import type { ComponentProps } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { cn } from "@/utils/styles";

// Derive prop types directly to avoid relying on type re-export from the lib
type ReactDatePickerProps = ComponentProps<typeof DatePicker>;

// Limited wrapper props – we only expose what the app currently uses.
export interface CalendarProps {
  /** Selected date (single-date mode only). */
  selected?: Date;
  /** Callback when a date is chosen. */
  onSelect?: (date: Date | null) => void;
  /** Disable a date – wrapper converts to react-datepicker filterDate */
  disabled?: (date: Date) => boolean;

  /** Props carried over from the old DayPicker wrapper so existing code compiles */
  mode?: "single";
  numberOfMonths?: number;
  defaultMonth?: Date;
  className?: string;

  /** Any extra props supported by react-datepicker */
  [key: string]: unknown;
}

function Calendar({
  className,
  selected,
  onSelect,
  disabled,
  numberOfMonths,
  defaultMonth,
  ...rest
}: CalendarProps) {
  return (
    <DatePicker
      inline
      selected={selected}
      onChange={((date: any) => onSelect?.(Array.isArray(date) ? date[0] : date)) as any}
      {...(numberOfMonths && numberOfMonths > 1
        ? { monthsShown: numberOfMonths }
        : {})}
      openToDate={defaultMonth}
      wrapperClassName={cn(className)}
      {...(disabled ? { filterDate: (date: Date) => !disabled(date) } : {})}
      {...(rest as ReactDatePickerProps)}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
