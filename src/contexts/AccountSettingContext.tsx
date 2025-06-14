"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getUserAccountDetails } from "../db/queries";
import { AccountDetails } from "@/lib/types";
import { getMFAStatus } from "../db/actions";

interface AccountSettingContextProps {
  accountDetails: AccountDetails | null;
  updateAccountDetails: (details: Partial<AccountDetails>) => void;
  mfaEnabled: boolean | null;
  setMfaEnabled: (enabled: boolean) => void;
}

const AccountSettingContext = createContext<AccountSettingContextProps | null>(
  null
);

export const useAccountSetting = () => {
  const context = useContext(AccountSettingContext);
  if (!context) {
    throw new Error(
      "useAccountSetting must be used within an AccountSettingProvider"
    );
  }
  return context;
};

export function AccountSettingProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(
    null
  );
  const [mfaEnabled, setMfaEnabled] = useState<boolean | null>(null);

  const updateAccountDetails = (details: Partial<AccountDetails>) => {
    if (accountDetails === null) return;
    setAccountDetails((prev) =>
      prev === null
        ? null
        : {
            ...prev,
            ...details
          }
    );
  };

  useEffect(() => {
    (async () => {
      const [accDeets, mfaStatus] = await Promise.all([
        getUserAccountDetails(),
        getMFAStatus()
      ]);

      setAccountDetails(accDeets.accountDetails || null);
      setMfaEnabled(mfaStatus.success ? mfaStatus.hasMFA! : null);
    })();
  }, []);

  return (
    <AccountSettingContext.Provider
      value={{
        accountDetails,
        updateAccountDetails,
        mfaEnabled,
        setMfaEnabled
      }}
    >
      {children}
    </AccountSettingContext.Provider>
  );
}
