'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/src/components/ui/Toast';
import InteractiveProgressBar from '@/src/components/ui/InteractiveProgressBar';

interface UploadedFile {
  file: File;
  url?: string | null;
  uploading: boolean;
  error?: string;
}

export default function MediaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('property_id');
  const { success, error: showError } = useToast();
  
  const [photos, setPhotos] = useState<UploadedFile[]>([]);
  const [tourFile, setTourFile] = useState<UploadedFile | null>(null);
  const [uploading, setUploading] = useState(false);

  // Initialize Supabase Storage buckets
  useEffect(() => {
    const initializeStorage = async () => {
      try {
        const response = await fetch('/api/storage/init', {
          method: 'POST',
        });
        
        if (!response.ok) {
          console.error('Failed to initialize storage buckets');
          return;
        }

        const result = await response.json();
        console.log('Storage initialization result:', result);
      } catch (error) {
        console.error('Error initializing storage:', error);
      }
    };

    initializeStorage();
  }, []);

  const uploadFile = async (file: File, bucketName: string, folder: string): Promise<{ publicUrl: string; s3Key: string } | null> => {
    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${propertyId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      return { publicUrl, s3Key: fileName };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !propertyId) return;

    const files = Array.from(e.target.files);
    const newPhotos: UploadedFile[] = files.map(file => ({
      file,
      uploading: true
    }));

    setPhotos(prev => [...prev, ...newPhotos]);
    setUploading(true);

    // Upload files one by one
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        const uploadResult = await uploadFile(file, 'property-images', 'listings');
        
        if (!uploadResult) {
          throw new Error('Failed to get upload URL');
        }
        
        const { publicUrl, s3Key } = uploadResult;
        
        // Save image record to database
        const supabase = createClient();
        const { error: dbError } = await supabase
          .from('property_images')
          .insert({
            property_id: propertyId,
            s3_key: s3Key,
            image_order: photos.length + i,
            is_primary: photos.length === 0 && i === 0, // First image is primary
            alt_text: `Property photo ${photos.length + i + 1}`
          });

        if (dbError) {
          console.error('Error saving image to database:', dbError);
          throw new Error('Failed to save image record');
        }
        
        setPhotos(prev => prev.map((photo, index) => {
          if (index === prev.length - files.length + i) {
            return { ...photo, url: publicUrl, uploading: false };
          }
          return photo;
        }));

        success('Image uploaded successfully!');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        
        setPhotos(prev => prev.map((photo, index) => {
          if (index === prev.length - files.length + i) {
            return { ...photo, uploading: false, error: errorMessage };
          }
          return photo;
        }));

        showError('Upload failed', errorMessage);
      }
    }

    setUploading(false);
    // Clear the input
    e.target.value = '';
  };

  const handleTourUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !propertyId) return;

    const file = e.target.files[0];
    const newTourFile: UploadedFile = {
      file,
      uploading: true
    };

    setTourFile(newTourFile);
    setUploading(true);

    try {
      const uploadResult = await uploadFile(file, 'property-3d-tours', 'listings');
      
      if (!uploadResult) {
        throw new Error('Failed to get upload URL');
      }
      
      const { publicUrl } = uploadResult;
      
      setTourFile(prev => prev ? { ...prev, url: publicUrl, uploading: false } : null);
      success('3D tour uploaded successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      setTourFile(prev => prev ? { ...prev, uploading: false, error: errorMessage } : null);
      showError('Upload failed', errorMessage);
    }

    setUploading(false);
    // Clear the input
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const removeTour = () => {
    setTourFile(null);
  };

  // Redirect if no property ID
  useEffect(() => {
    if (!propertyId) {
      router.push('/sell/create');
    }
  }, [propertyId, router]);

  if (!propertyId) {
    return <div>Loading...</div>;
  }

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
        <InteractiveProgressBar currentStep={2} propertyId={propertyId} />

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column - Photos */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Add Photos</h2>
            <p className="text-gray-600 mb-6">More photos = more informed renters</p>
            
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 flex flex-col items-center justify-center min-h-[200px] mb-4">
              <input
                type="file"
                id="photos"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={uploading}
              />
              <label
                htmlFor="photos"
                className={`px-6 py-3 rounded-md transition-colors cursor-pointer ${
                  uploading 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {uploading ? 'Uploading...' : 'Upload From Computer'}
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Supports JPEG, PNG, WebP (max 5MB each)
              </p>
            </div>

            {/* Uploaded Photos */}
            {photos.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700">Uploaded Photos ({photos.length})</h3>
                <div className="grid grid-cols-2 gap-3">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative border rounded-lg p-3 bg-white">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 truncate flex-1">
                          {photo.file.name}
                        </span>
                        <button
                          onClick={() => removePhoto(index)}
                          className="text-red-500 hover:text-red-700 ml-2"
                          disabled={photo.uploading}
                        >
                          ×
                        </button>
                      </div>
                      
                      {photo.uploading && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full animate-pulse w-full"></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Uploading...</p>
                        </div>
                      )}
                      
                      {photo.error && (
                        <p className="text-xs text-red-500 mt-1">{photo.error}</p>
                      )}
                      
                      {photo.url && !photo.uploading && (
                        <p className="text-xs text-green-600 mt-1">✓ Uploaded successfully</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - 3D Tour */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Add 3D Tour</h2>
            <p className="text-gray-600 mb-6">A tour can save time from in-person visits</p>
            
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 flex flex-col items-center justify-center min-h-[200px] mb-4">
              <input
                type="file"
                id="tour"
                accept=".glb,.gltf"
                onChange={handleTourUpload}
                className="hidden"
                disabled={uploading || !!tourFile}
              />
              <label
                htmlFor="tour"
                className={`px-6 py-3 rounded-md transition-colors cursor-pointer ${
                  uploading || tourFile
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {uploading ? 'Uploading...' : tourFile ? 'File Selected' : 'Upload From Computer'}
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Supports GLB, GLTF (max 50MB)
              </p>
            </div>

            {/* Uploaded Tour */}
            {tourFile && (
              <div className="border rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate flex-1">
                    {tourFile.file.name}
                  </span>
                  <button
                    onClick={removeTour}
                    className="text-red-500 hover:text-red-700 ml-2"
                    disabled={tourFile.uploading}
                  >
                    ×
                  </button>
                </div>
                
                {tourFile.uploading && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full animate-pulse w-full"></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Uploading...</p>
                  </div>
                )}
                
                {tourFile.error && (
                  <p className="text-xs text-red-500 mt-1">{tourFile.error}</p>
                )}
                
                {tourFile.url && !tourFile.uploading && (
                  <p className="text-xs text-green-600 mt-1">✓ Uploaded successfully</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-end mt-12">
          <button 
            onClick={() => router.push(`/sell/create/amenities?property_id=${propertyId}`)}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Next'}
          </button>
        </div>
      </div>
    </main>
  );
}
