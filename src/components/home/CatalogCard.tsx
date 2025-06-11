import { BsCarFront } from "react-icons/bs";
import { HiHeart, HiLocationMarker } from "react-icons/hi";

export default function CatalogCard() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-br from-green-400 to-teal-600"></div>
        <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
          <HiHeart className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900">$2,750/mo</h3>
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-medium">
            Furnished
          </span>
        </div>
        <p className="text-gray-600 mb-4 flex items-center">
          <HiLocationMarker className="w-4 h-4 mr-1" />
          890 Cedar Ave, Hollywood
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center">
            <span className="font-medium">2 beds</span>
          </span>
          <span className="flex items-center">
            <span className="font-medium">2 baths</span>
          </span>
          <span className="flex items-center">
            <span className="font-medium">1,100 sqft</span>
          </span>
          <span className="flex items-center">
            <BsCarFront className="w-4 h-4 mr-1" />
            <span className="font-medium">Parking</span>
          </span>
        </div>
      </div>
    </div>
  )
}
