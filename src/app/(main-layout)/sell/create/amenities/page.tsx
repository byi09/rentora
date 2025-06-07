'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AmenitiesPage() {
  const router = useRouter();
  const [customAmenities, setCustomAmenities] = useState('');

  const steps = [
    'Property Info',
    'Rent Details',
    'Media',
    'Amenities',
    'Screening',
    'Costs and Fees',
    'Final details',
    'Review',
    'Publish'
  ];

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Amenities</h1>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Save and Exit
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-12 relative">
          <div className="h-2 bg-blue-100 rounded-full">
            <div className="h-full w-4/9 bg-blue-600 rounded-full"></div>
          </div>
          <div className="flex justify-between absolute w-full" style={{ top: '-8px' }}>
            {steps.map((step, index) => (
              <div 
                key={step}
                className={`w-4 h-4 rounded-full ${index <= 3 ? 'bg-blue-600' : 'bg-blue-200'}`}
              >
                <div className="text-xs text-gray-600 mt-6 -ml-4 w-20 text-center">
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Highlight the Key Features of Your Home</h2>
          <p className="text-gray-600 mb-8">Showcase your amenities</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Laundry */}
            <div>
              <h3 className="font-semibold mb-4">Laundry</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input type="radio" name="laundry" className="form-radio text-blue-600" />
                  <span>In unit</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="radio" name="laundry" className="form-radio text-blue-600" />
                  <span>In building</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="radio" name="laundry" className="form-radio text-blue-600" />
                  <span>No facilities</span>
                </label>
              </div>
            </div>

            {/* Appliances */}
            <div>
              <h3 className="font-semibold mb-4">Appliances</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="form-checkbox text-blue-600" />
                  <span>Dishwasher</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="form-checkbox text-blue-600" />
                  <span>Freezer</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="form-checkbox text-blue-600" />
                  <span>Microwave</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="form-checkbox text-blue-600" />
                  <span>Oven</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="form-checkbox text-blue-600" />
                  <span>Refrigerator</span>
                </label>
              </div>
            </div>

            {/* Pets Allowed */}
            <div>
              <h3 className="font-semibold mb-4">Pets Allowed</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input type="radio" name="pets" className="form-radio text-blue-600" />
                  <span>Yes</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="radio" name="pets" className="form-radio text-blue-600" />
                  <span>No</span>
                </label>
              </div>
            </div>

            {/* Cooling */}
            <div>
              <h3 className="font-semibold mb-4">Cooling</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input type="radio" name="cooling" className="form-radio text-blue-600" />
                  <span>Central</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="radio" name="cooling" className="form-radio text-blue-600" />
                  <span>Wall</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="radio" name="cooling" className="form-radio text-blue-600" />
                  <span>Window</span>
                </label>
              </div>
            </div>

            {/* Heating */}
            <div>
              <h3 className="font-semibold mb-4">Heating</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input type="radio" name="heating" className="form-radio text-blue-600" />
                  <span>Baseboard</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="radio" name="heating" className="form-radio text-blue-600" />
                  <span>Forced Air</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="radio" name="heating" className="form-radio text-blue-600" />
                  <span>Heat Pump</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="radio" name="heating" className="form-radio text-blue-600" />
                  <span>Wall</span>
                </label>
              </div>
            </div>

            {/* Flooring */}
            <div>
              <h3 className="font-semibold mb-4">Flooring</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input type="radio" name="flooring" className="form-radio text-blue-600" />
                  <span>Carpet</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="radio" name="flooring" className="form-radio text-blue-600" />
                  <span>Hardwood</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="radio" name="flooring" className="form-radio text-blue-600" />
                  <span>Tile</span>
                </label>
              </div>
            </div>

            {/* Other */}
            <div>
              <h3 className="font-semibold mb-4">Other</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="form-checkbox text-blue-600" />
                  <span>Furnished</span>
                </label>
              </div>
            </div>
          </div>

          {/* Custom Amenities */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Add in any other key amenities</h3>
            <textarea
              value={customAmenities}
              onChange={(e) => setCustomAmenities(e.target.value)}
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter additional amenities..."
            />
          </div>

          {/* Next Button */}
          <div className="flex justify-end mt-8">
            <button 
              onClick={() => router.push('/sell/create/screening')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
