import { HiRocketLaunch, HiHome, HiMapPin, HiCurrencyDollar } from "react-icons/hi2";

export default function CatalogComingSoon({
  children,
  icon = <HiRocketLaunch className="text-3xl" />
}: {
  children?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="w-full">
      {/* Beautiful gradient background with pattern */}
      <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-12 overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-600 rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-purple-600 rounded-full"></div>
          <div className="absolute bottom-20 left-32 w-12 h-12 bg-indigo-600 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-blue-400 rounded-full"></div>
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          {/* Icon with gradient background */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
            {icon}
          </div>

          {/* Title */}
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Amazing Rentals Coming to Students Soon!
          </h2>

          {/* Description */}
          <div className="text-lg text-gray-600 mb-8 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
