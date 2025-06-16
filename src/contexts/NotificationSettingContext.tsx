"use client";

import { NotificationPreferences } from "@/lib/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import { getNotificationPreferences } from "../db/queries";
import { updateNotificationPreferences } from "../db/actions";

interface NotificationSettingContextType {
  preferences: NotificationPreferences | null;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void;
}

const NotificationSettingContext =
  createContext<NotificationSettingContextType | null>(null);

export const useNotificationSettingContext = () => {
  const context = useContext(NotificationSettingContext);
  if (!context) {
    throw new Error(
      "useNotificationSettingContext must be used within a NotificationSettingProvider"
    );
  }
  return context;
};

export function NotificationSettingProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [preferences, setPreferences] =
    useState<NotificationSettingContextType["preferences"]>(null);
  const updateIssued = useRef(false);

  useEffect(() => {
    (async () => {
      const response = await getNotificationPreferences();
      if (response.success) setPreferences(response.preferences!);
    })();
  }, []);

  const updatePreferences = useCallback(
    (newPreferences: Partial<NotificationPreferences>) => {
      setPreferences((prev) => (prev ? { ...prev, ...newPreferences } : null));
      updateIssued.current = true;
    },
    []
  );

  useEffect(() => {
    if (preferences && updateIssued.current) {
      updateNotificationPreferences(preferences);
    }
  }, [preferences]);

  return (
    <NotificationSettingContext.Provider
      value={{ preferences, updatePreferences }}
    >
      {children}
    </NotificationSettingContext.Provider>
  );
}
