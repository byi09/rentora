import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi";

export default function NotificationsPage() {
  return (
    <div className="flex flex-col items-center py-16 gap-8 w-[400px] md:w-[500px] lg:w-[700px] xl:w-[900px] mx-auto">
      <Link href="/settings" className="text-blue-700 hover:text-blue-500 flex items-center gap-2 mr-auto">
        <HiChevronLeft />
        Back to Settings
      </Link>
      <h1 className="text-3xl font-bold">Notifications</h1>
      <p className="text-center text-gray-600 w-full md:w-4/6">
        Manage how you receive updates about your housing search. You can choose to get notifications via email, push notifications, or both.
      </p>
      <div className="p-8 flex flex-col gap-16 rounded-lg border shadow-md w-full">
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Updates to saved properties</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Email</span>
              <input type="checkbox" defaultChecked className="toggle toggle-primary" />
            </div>
            <div className="flex items-center justify-between">
              <span>Push</span>
              <input type="checkbox" defaultChecked className="toggle toggle-primary" />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">New properties that match your preferences</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Email</span>
              <input type="checkbox" defaultChecked className="toggle toggle-primary" />
            </div>
            <div className="flex items-center justify-between">
              <span>Push</span>
              <input type="checkbox" defaultChecked className="toggle toggle-primary" />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Direct messages</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Email</span>
              <input type="checkbox" defaultChecked className="toggle toggle-primary" />
            </div>
            <div className="flex items-center justify-between">
              <span>Push</span>
              <input type="checkbox" defaultChecked className="toggle toggle-primary" />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">News from Rentora</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Email</span>
              <input type="checkbox" defaultChecked className="toggle toggle-primary" />
            </div>
            <div className="flex items-center justify-between">
              <span>Push</span>
              <input type="checkbox" defaultChecked className="toggle toggle-primary" />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
