import FieldValue from "@/src/components/settings/FieldValue";
import EditEmailForm from "@/src/components/settings/forms/EditEmailForm";
import EditNameForm from "@/src/components/settings/forms/EditNameForm";
import EditPasswordForm from "@/src/components/settings/forms/EditPasswordForm";
import EditUsernameForm from "@/src/components/settings/forms/EditUsernameForm";
import {
  ProfileFieldAction,
  ProfileFieldEditable
} from "@/src/components/settings/ProfileUI";
import { AccountSettingProvider } from "@/src/contexts/AccountSettingContext";
import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi";

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
            <ProfileFieldEditable
              field="Username"
              value={<FieldValue field="username" />}
            >
              <EditUsernameForm />
            </ProfileFieldEditable>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Security</h3>
            <ProfileFieldEditable
              field="Email"
              value={<FieldValue field="email" />}
            >
              <EditEmailForm />
            </ProfileFieldEditable>
            <ProfileFieldEditable field="Password" value="********">
              <EditPasswordForm />
            </ProfileFieldEditable>
            <ProfileFieldAction
              field="Two-Factor Authentication"
              action="Enable"
              popupTitle="Enable Two-Factor Authentication"
            >
              <div className="flex flex-col gap-4">
                <p className="text-gray-700">
                  Two-factor authentication adds an extra layer of security to
                  your account.
                </p>
              </div>
            </ProfileFieldAction>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Manage Account</h3>
            <ProfileFieldAction
              field="Delete Account"
              action="Delete"
              popupTitle="Are you sure you want to delete your account?"
            >
              <div className="flex flex-col gap-4">
                <p className="text-red-800">
                  This action is irreversible. All your data will be permanently
                  deleted.
                </p>
              </div>
            </ProfileFieldAction>
          </section>
        </div>
      </div>
    </AccountSettingProvider>
  );
}
