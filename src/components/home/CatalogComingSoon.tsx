import { HiRocketLaunch } from "react-icons/hi2";

export default function CatalogComingSoon({
  children,
  icon = <HiRocketLaunch className="text-3xl" />
}: {
  children?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="w-full relative">
      <div className="flex h-[320px] gap-8 justify-center items-center">
        <div className="w-[240px] h-full bg-gray-200 rounded-md shadow-md"></div>
        <div className="w-[240px] h-full bg-gray-200 rounded-md shadow-md"></div>
        <div className="w-[240px] h-full bg-gray-200 rounded-md shadow-md"></div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-16 py-8 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center gap-4">
        <div className="w-[60px] h-[60px] rounded-full bg-gray-100 flex items-center justify-center">
          {icon}
        </div>
        <h2 className="font-bold text-2xl">Coming Soon!</h2>
        {children}
      </div>
    </div>
  );
}
