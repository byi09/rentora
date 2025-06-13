"use client";

import { AccountDetails } from "@/lib/types";
import { useAccountSetting } from "@/src/contexts/AccountSettingContext";

export default function FieldValue({ field }: { field: keyof AccountDetails }) {
  const { accountDetails } = useAccountSetting();
  return accountDetails ? (
    <p>{accountDetails[field]}</p>
  ) : (
    <div className="h-[20px] w-[64px] rounded-md bg-gray-300 shadow-sm animate-pulse"></div>
  );
}
