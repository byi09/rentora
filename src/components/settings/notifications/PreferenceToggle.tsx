"use client";

import { NotificationPreferences } from "@/lib/types";
import Switch from "../../ui/switch";
import { useNotificationSettingContext } from "@/src/contexts/NotificationSettingContext";
import { Skeleton } from "../../ui/LoadingSkeleton";

export default function PreferenceToggle({
  preference
}: {
  preference: keyof NotificationPreferences;
}) {
  const { preferences, updatePreferences } = useNotificationSettingContext();

  if (!preferences)
    return (
      <Skeleton className="h-[20px] w-[40px] rounded-full" />
    );

  return (
    <Switch
      checked={preferences[preference]}
      onCheckedChange={(v) => updatePreferences({ [preference]: v })}
    />
  );
}
