"use client";

import { NotificationPreferences } from "@/lib/types";
import Switch from "../../ui/switch";
import { useNotificationSettingContext } from "@/src/contexts/NotificationSettingContext";

export default function PreferenceToggle({
  preference
}: {
  preference: keyof NotificationPreferences;
}) {
  const { preferences, updatePreferences } = useNotificationSettingContext();

  if (!preferences)
    return (
      <div className="bg-gray-200 rounded-full h-[20px] w-[40px] animate-pulse"></div>
    );

  return (
    <Switch
      checked={preferences[preference]}
      onCheckedChange={(v) => updatePreferences({ [preference]: v })}
    />
  );
}
