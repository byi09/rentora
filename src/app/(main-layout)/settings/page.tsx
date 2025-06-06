import SettingLink from "@/src/components/settings/SettingLink";
import { FaBell, FaCreditCard, FaUserShield } from "react-icons/fa";

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center py-16">
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="py-8 flex flex-col gap-8">
        <SettingLink
          name="Account"
          link="/settings/account"
          description="Manage your account details and security settings"
          icon={<FaUserShield className="text-3xl" />}
        />
        <SettingLink
          name="Notifications"
          link="/settings/notifications"
          description="Manage how you get your housing search updates"
          icon={<FaBell className="text-3xl" />}
        />
        <SettingLink
          name="Billing Preferences"
          link="/settings/billing"
          description="Manage your deposit method and payment settings"
          icon={<FaCreditCard className="text-3xl" />}
        />
      </div>
    </div>
  )
}
