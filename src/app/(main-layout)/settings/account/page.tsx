'use client';

import { ProfileFieldAction, ProfileFieldEditable } from "@/src/components/settings/ProfileUI";
import { TextInput } from "@/src/components/ui/Form";
import Link from "next/link";
import { Dialog } from "radix-ui";
import { HiChevronLeft } from "react-icons/hi";

export default function ProfilePage() {
  return (
    <div className="flex flex-col items-center py-16 gap-8 w-[400px] md:w-[500px] lg:w-[700px] xl:w-[900px] mx-auto">
      <Link href="/settings" className="text-blue-700 hover:text-blue-500 flex items-center gap-2 mr-auto">
        <HiChevronLeft /> Back to Settings
      </Link>
      <h1 className="text-3xl font-bold">Account Settings</h1>
      <div className="p-8 flex flex-col gap-24 md:gap-16 rounded-lg border shadow-md w-full">
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Personal Information</h3>
          <ProfileFieldEditable
            field="Name"
            value="John Doe"
          >
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div>
                  <label htmlFor="firstName">First Name</label>
                  <TextInput name="firstName" />
                </div>
                <div>
                  <label htmlFor="lastName">Last Name</label>
                  <TextInput name="lastName" />
                </div>
              </div>
              <div className="flex gap-4 justify-end">
                <Dialog.Close asChild>
                  <button className="border rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <button className="rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors">Apply</button>
                </Dialog.Close>
              </div>
            </div>
          </ProfileFieldEditable>
          <ProfileFieldEditable
            field="Username"
            value="johndoe123"
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="username">Username</label>
                <TextInput name="username" />
              </div>
              <div className="flex gap-4 justify-end">
                <Dialog.Close asChild>
                  <button className="border rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <button className="rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors">Apply</button>
                </Dialog.Close>
              </div>
            </div>
          </ProfileFieldEditable>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Security</h3>
          <ProfileFieldEditable
            field="Email"
            value="john.doe@example.com"
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="email">Email</label>
                <TextInput name="email" />
              </div>
              <div className="flex gap-4 justify-end">
                <Dialog.Close asChild>
                  <button className="border rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <button className="rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors">Apply</button>
                </Dialog.Close>
              </div>
            </div>
          </ProfileFieldEditable>
          <ProfileFieldEditable
            field="Password"
            value="********"
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="oldPassword">Old Password</label>
                <TextInput name="oldPassword" />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="newPassword">New Password</label>
                <TextInput name="newPassword" />
              </div>
              <div className="flex gap-4 justify-end">
                <Dialog.Close asChild>
                  <button className="border rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <button className="rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors">Apply</button>
                </Dialog.Close>
              </div>
            </div>
          </ProfileFieldEditable>
          <ProfileFieldAction
            field="Two-Factor Authentication"
            action="Enable"
            popupTitle="Enable Two-Factor Authentication"
          >
            <div className="flex flex-col gap-4">
              <p className="text-gray-700">Two-factor authentication adds an extra layer of security to your account.</p>
              <div className="flex gap-4 justify-end">
                <Dialog.Close asChild>
                  <button className="border rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <button className="rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors">Enable</button>
                </Dialog.Close>
              </div>
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
              <p className="text-red-800">This action is irreversible. All your data will be permanently deleted.</p>
              <div className="flex gap-4 justify-end">
                <Dialog.Close asChild>
                  <button className="border rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <button className="rounded-md bg-red-600 text-white px-4 py-2 hover:bg-red-700 transition-colors">Delete Account</button>
                </Dialog.Close>
              </div>
            </div>
          </ProfileFieldAction>
        </section>
      </div>
    </div>
  )
}
