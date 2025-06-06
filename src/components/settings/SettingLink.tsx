import Link from "next/link";
import { HiChevronRight } from "react-icons/hi";

export default function SettingLink({
  name,
  link,
  description,
  icon
}: {
  name: string;
  link: string;
  description: string;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={link}
      className="bg-white border hover:shadow-lg transition-shadow p-10 rounded-lg shadow-md flex items-center justify-between gap-4"
    >
      {icon}
      <div className="mr-16">
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      <HiChevronRight className="text-3xl" />
    </Link>
  )
}
