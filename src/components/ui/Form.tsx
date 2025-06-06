'use client';

import clsx from "clsx";
import { HiLocationMarker, HiSearch } from "react-icons/hi";
import { ToggleGroup as RadixToggleGroup } from "radix-ui";
import { useState } from "react";

//
// text inputs
//

export function LocationSearchInput({
  children,
  defaultValue = "San Francisco, CA",
  placeholder = "Enter city, neighborhood, or address",
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { children?: React.ReactNode }) {
  return (
    <div className="relative">
      <HiLocationMarker className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={clsx("w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900", className)}
        {...props}
      />
      {children}
    </div>
  )
}

export function SearchInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative w-96">
      <HiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        className={clsx("w-full pr-10 pl-2 py-1 border border-gray-300 rounded-lg focus:ring-2 hover:ring-1 focus:ring-blue-500 focus:border-transparent outline-none [&:not(:placeholder-shown)]:border-gray-500", className)}
        {...props}
      />
    </div>
  )
}

export function TextInput({
  className,
  placeholder,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className={clsx("w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900", className)}
      {...props}
    />
  )
}

//
// select inputs
// 

export function SearchSelect({
  className,
  options,
  defaultValue = "null",
  ...props
}: Omit<React.HTMLAttributes<HTMLSelectElement>, "children"> & {
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

//
// checkbox inputs
// 

export function Checkbox({
  id,
  className,
  field,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  field: string;
}) {
  return (
    <label
      className={clsx("flex items-center space-x-2 text-gray-700 select-none", className)}
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

export function CheckboxGroup({
  options,
  className,
  defaultValue,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "defaultValue"> & {
  options: { value: string; label: string }[];
  defaultValue?: Record<string, boolean>;
}) {
  return (
    <div className="flex flex-col space-y-2">
      {options.map(opt => (
        <Checkbox
          key={opt.value}
          id={opt.value}
          field={opt.label}
          className={className}
          value={opt.value}
          defaultChecked={defaultValue?.[opt.value] || false}
          {...props}
        />
      ))}
    </div>
  )
}

//
// radio inputs
//

export function RadioInput({
  className,
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) {
  return (
    <label className="flex items-center space-x-2 text-gray-700 select-none">
      <input
        type="radio"
        className={className}
        {...props}
      />
      <span>{label}</span>
    </label>
  )
}

export function RadioGroup({
  options,
  name,
  className,
  defaultValue,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  options: { value: string; label: string }[];
  name: string;
}) {
  return (
    <div className={clsx("flex flex-col space-y-2", className)}>
      {options.map(opt => (
        <RadioInput
          key={opt.value}
          value={opt.value}
          label={opt.label}
          name={name}
          checked={defaultValue === opt.value}
          {...props}
        />
      ))}
    </div>
  )
}

//
// toggles
//

export function ToggleGroup({
  options,
  onChange,
  defaultValue
}: {
  options: { value: string; label: string }[];
  onChange?: (value: string) => void;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue || options[0].value);

  const handleChange = (newValue: string) => {
    if (newValue)
      setValue(newValue);
    onChange?.(newValue);
  }

  return (
    <RadixToggleGroup.Root
      type="single"
      onValueChange={handleChange}
      value={value}
    >
      {options.map(opt => (
        <RadixToggleGroup.Item
          key={opt.value}
          value={opt.value}
          className="w-16 p-2 border border-gray-300 first:rounded-tl-md first:rounded-bl-md last:rounded-tr-md last:rounded-br-md hover:bg-gray-100 data-[state='on']:bg-blue-50 data-[state='on']:border-2 data-[state='on']:border-blue-500 outline-none"
        >
          {opt.label}
        </RadixToggleGroup.Item>
      ))}
    </RadixToggleGroup.Root>
  )
}
