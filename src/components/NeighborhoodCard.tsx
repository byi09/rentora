import { HiMapPin } from "react-icons/hi2";

export default function NeighborhoodCard({
  neighborhood
}: {
  neighborhood: {
    name: string;
    avgRent: string;
    rentChange: string;
    propertiesCount: number;
  };
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-600"></div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {neighborhood.name}
        </h3>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {neighborhood.avgRent}
            </p>
            <p className="text-gray-600">Avg. rent</p>
          </div>
          <div className="text-right">
            <p className="text-green-600 font-semibold">
              {neighborhood.rentChange}
            </p>
            <p className="text-gray-600">
              {neighborhood.propertiesCount} properties
            </p>
          </div>
        </div>
        <button className="text-blue-600 font-medium hover:text-blue-800 flex items-center">
          <HiMapPin className="w-4 h-4 mr-1" />
          View available rentals
        </button>
      </div>
    </div>
  );
}
