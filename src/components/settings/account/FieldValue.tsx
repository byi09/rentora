"use client";

import { AccountDetails } from "@/lib/types";
import { useAccountSetting } from "@/src/contexts/AccountSettingContext";
import { Skeleton } from "../../ui/LoadingSkeleton";

export default function FieldValue({ field }: { field: keyof AccountDetails }) {
  const { accountDetails } = useAccountSetting();
  return accountDetails ? (
    <p>{accountDetails[field]}</p>
  ) : (
    <Skeleton className="h-[20px] w-[64px]" />
  );
}
