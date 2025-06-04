'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MediaPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<File[]>([]);
  const [tourFile, setTourFile] = useState<File | null>(null);

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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handleTourUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTourFile(e.target.files[0]);
    }
  };

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Media Upload</h1>
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
            <div className="h-full w-3/9 bg-blue-600 rounded-full"></div>
          </div>
          <div className="flex justify-between absolute w-full" style={{ top: '-8px' }}>
            {steps.map((step, index) => (
              <div 
                key={step}
                className={`w-4 h-4 rounded-full ${index <= 2 ? 'bg-blue-600' : 'bg-blue-200'}`}
              >
                <div className="text-xs text-gray-600 mt-6 -ml-4 w-20 text-center">
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column - Photos */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Add Photos</h2>
            <p className="text-gray-600 mb-6">More photos = more informed renters</p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 flex flex-col items-center justify-center min-h-[300px]">
              <input
                type="file"
                id="photos"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <label
                htmlFor="photos"
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Upload From Computer
              </label>
              {photos.length > 0 && (
                <p className="mt-4 text-sm text-gray-600">
                  {photos.length} photo{photos.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>
          </div>

          {/* Right Column - 3D Tour */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Add 3D Tour</h2>
            <p className="text-gray-600 mb-6">A tour can save time from in-person visits</p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 flex flex-col items-center justify-center min-h-[300px]">
              <input
                type="file"
                id="tour"
                accept=".glb,.gltf"
                onChange={handleTourUpload}
                className="hidden"
              />
              <label
                htmlFor="tour"
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Upload From Computer
              </label>
              {tourFile && (
                <p className="mt-4 text-sm text-gray-600">
                  {tourFile.name} selected
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-end mt-12">
          <button 
            onClick={() => router.push('/sell/create/amenities')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}
