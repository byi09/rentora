import TwoFactorAction from "@/src/components/settings/account/TwoFactor";
import FieldValue from "@/src/components/settings/account/FieldValue";
import EditEmailForm from "@/src/components/settings/account/forms/EditEmailForm";
import EditNameForm from "@/src/components/settings/account/forms/EditNameForm";
import EditPasswordForm from "@/src/components/settings/account/forms/EditPasswordForm";
import EditUsernameForm from "@/src/components/settings/account/forms/EditUsernameForm";
import { ProfileFieldEditable } from "@/src/components/settings/account/ProfileUI";
import { AccountSettingProvider } from "@/src/contexts/AccountSettingContext";
import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi";
import DeleteAccountAction from "@/src/components/settings/account/DeleteAccountAction";

export default function ProfilePage() {
  return (
    <AccountSettingProvider>
      <div className="flex flex-col items-center py-16 gap-8 w-[400px] md:w-[500px] lg:w-[700px] xl:w-[900px] mx-auto">
        <Link
          href="/settings"
          className="text-blue-700 hover:text-blue-500 flex items-center gap-2 mr-auto"
        >
          <HiChevronLeft /> Back to Settings
        </Link>
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <div className="p-8 flex flex-col gap-24 md:gap-16 rounded-lg border shadow-md w-full">
          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Personal Information</h3>

            {/* first and last name */}
            <ProfileFieldEditable
              field="Name"
              value={
                <div className="flex gap-1">
                  <FieldValue field="firstName" />
                  <FieldValue field="lastName" />
                </div>
              }
            >
              <EditNameForm />
            </ProfileFieldEditable>

            {/* username */}
            <ProfileFieldEditable
              field="Username"
              value={<FieldValue field="username" />}
            >
              <EditUsernameForm />
            </ProfileFieldEditable>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Security</h3>

            {/* email */}
            <ProfileFieldEditable
              field="Email"
              value={<FieldValue field="email" />}
            >
              <EditEmailForm />
            </ProfileFieldEditable>

            {/* password */}
            <ProfileFieldEditable field="Password" value="********">
              <EditPasswordForm />
            </ProfileFieldEditable>

            {/* two-factor authentication */}
            <div className="flex justify-between flex-col md:flex-row">
              <b className="font-medium">Two-Factor Authentication</b>
              <TwoFactorAction />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Manage Account</h3>

            {/* delete account */}
            <div className="flex justify-between flex-col md:flex-row">
              <b className="font-medium">Delete Account</b>
              <DeleteAccountAction />
            </div>
          </section>
        </div>
      </div>
    </AccountSettingProvider>
  );
}
