"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getUserAccountDetails } from "../db/queries";
import { AccountDetails } from "@/lib/types";

interface AccountSettingContextProps {
  accountDetails: AccountDetails | null;
  updateAccountDetails: (details: Partial<AccountDetails>) => void;
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
      const accDeets = await getUserAccountDetails();
      setAccountDetails(accDeets.accountDetails || null);
    })();
  }, []);

  return (
    <AccountSettingContext.Provider
      value={{ accountDetails, updateAccountDetails }}
    >
      {children}
    </AccountSettingContext.Provider>
  );
}
