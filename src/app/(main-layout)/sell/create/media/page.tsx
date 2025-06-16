'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/src/components/ui/Toast';
import InteractiveProgressBar from '@/src/components/ui/InteractiveProgressBar';

/* eslint-disable @next/next/no-img-element */

interface UploadedFile {
  file: File;
  url?: string | null;
  uploading: boolean;
  error?: string;
}

interface ExistingImage {
  id: string;
  s3_key: string;
  image_order: number;
  alt_text?: string;
  is_primary: boolean;
  image_type?: string;
  room_type?: string;
  url: string;
}

export default function MediaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('property_id');
  const { success, error: showError } = useToast();
  
  const [photos, setPhotos] = useState<UploadedFile[]>([]);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [tourFile, setTourFile] = useState<UploadedFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

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

  // Load existing images from database
  useEffect(() => {
    const loadExistingImages = async () => {
      if (!propertyId) return;
      
      try {
        const supabase = createClient();
        
        // Fetch existing images
        const { data: images, error } = await supabase
          .from('property_images')
          .select('*')
          .eq('property_id', propertyId)
          .order('image_order', { ascending: true });

        if (error) {
          console.error('Error loading existing images:', error);
          showError('Failed to load existing images', error.message);
          return;
        }

        // Generate public URLs for existing images
        const imagesWithUrls = images?.map(image => {
          const { data: { publicUrl } } = supabase.storage
            .from('property-images')
            .getPublicUrl(image.s3_key);
          
          return {
            ...image,
            url: publicUrl
          };
        }) || [];

        setExistingImages(imagesWithUrls);
      } catch (error) {
        console.error('Unexpected error loading images:', error);
        showError('Failed to load images', 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadExistingImages();
  }, [propertyId, showError]);

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

        // Refresh existing images from database to get the correct ID
        const supabaseRefresh = createClient();
        const { data: refreshedImages } = await supabaseRefresh
          .from('property_images')
          .select('*')
          .eq('property_id', propertyId)
          .order('image_order', { ascending: true });

        if (refreshedImages) {
          const imagesWithUrls = refreshedImages.map(image => {
            const { data: { publicUrl } } = supabaseRefresh.storage
              .from('property-images')
              .getPublicUrl(image.s3_key);
            
            return {
              ...image,
              url: publicUrl
            };
          });
          setExistingImages(imagesWithUrls);
        }

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
    // Clear the uploaded photos list and input after successful upload
    setPhotos([]);
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

  const deleteExistingImage = async (imageId: string, s3Key: string) => {
    try {
      setDeleting(imageId);
      const supabase = createClient();

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('property-images')
        .remove([s3Key]);

      if (storageError) {
        console.error('Error deleting from storage:', storageError);
        // Continue with database deletion even if storage fails
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('property_images')
        .delete()
        .eq('id', imageId);

      if (dbError) {
        console.error('Error deleting from database:', dbError);
        throw new Error('Failed to delete image record');
      }

      // Update local state
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      success('Image deleted successfully');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete image';
      showError('Delete failed', errorMessage);
    } finally {
      setDeleting(null);
    }
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

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-gray-600">Loading existing images...</span>
              </div>
            )}

            {/* Empty State */}
            {!loading && existingImages.length === 0 && photos.length === 0 && (
              <div className="text-center py-6">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6 6l-3.5 3.5a2 2 0 01-2.83 0L4 20m16 20l4.586-4.586a2 2 0 012.828 0L32 40m-2-2l1.586-1.586a2 2 0 012.828 0L36 34m-6 6l-3.5 3.5a2 2 0 01-2.83 0L20 36"/>
                </svg>
                <p className="text-sm text-gray-500">No images uploaded yet</p>
                <p className="text-xs text-gray-400 mt-1">Upload some photos to showcase your property</p>
              </div>
            )}

            {/* Existing Images */}
            {!loading && existingImages.length > 0 && (
              <div className="space-y-3 mb-6">
                <h3 className="font-medium text-gray-700">
                  Uploaded Images ({existingImages.length})
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {existingImages.map((image) => (
                    <div key={image.id} className="relative border rounded-lg overflow-hidden bg-white">
                      {/* Image Thumbnail */}
                      <div className="aspect-video relative">
                        <img
                          src={image.url}
                          alt={image.alt_text || 'Property image'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyNkM5LjUwNjU5IDI2IDEgMTcuNzMzIDEgNy43MzNWNkg0MFY3LjczM0M0MCAxNy43MzMgMzAuNDkzNCAyNiAyMCAyNloiIGZpbGw9IiM5Q0E0QUYiLz4KPC9zdmc+Cg==';
                          }}
                        />
                        
                        {/* Primary Badge */}
                        {image.is_primary && (
                          <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                            Primary
                          </div>
                        )}
                        
                        {/* Delete Button */}
                        <button
                          onClick={() => deleteExistingImage(image.id, image.s3_key)}
                          disabled={deleting === image.id}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors disabled:bg-gray-400"
                          title="Delete image"
                        >
                          {deleting === image.id ? (
                            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            '×'
                          )}
                        </button>
                      </div>
                      
                      {/* Image Info */}
                      <div className="p-2">
                        <p className="text-xs text-gray-600 truncate">
                          {image.room_type ? 
                            image.room_type.charAt(0).toUpperCase() + image.room_type.slice(1).replace('_', ' ') : 
                            'Property Image'
                          }
                        </p>
                        <p className="text-xs text-gray-500">
                          Order: {image.image_order + 1}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Currently Uploading Photos */}
            {photos.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700">Currently Uploading ({photos.length})</h3>
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
