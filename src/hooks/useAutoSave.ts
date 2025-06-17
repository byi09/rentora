import { useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

type FormDataValue = string | number | boolean | null | undefined;
type FormData = Record<string, FormDataValue>;

interface AutoSaveOptions {
  propertyId: string | null;
  formData: FormData;
  tableName: 'properties' | 'property_listings' | 'property_features';
  debounceMs?: number;
  onSaveSuccess?: () => void;
  onSaveError?: (error: Error) => void;
}

export function useAutoSave({
  propertyId,
  formData,
  tableName,
  debounceMs = 2000,
  onSaveSuccess,
  onSaveError
}: AutoSaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<string>('');
  const isSavingRef = useRef(false);

  const saveData = useCallback(async (data: FormData) => {
    if (!propertyId || isSavingRef.current) return;

    try {
      isSavingRef.current = true;
      const supabase = createClient();

      // Filter out null/undefined values but allow empty strings and prepare data for database
      const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
        // Allow empty strings but filter out null/undefined
        if (value !== null && value !== undefined) {
          // Convert string numbers to actual numbers for numeric fields
          if (typeof value === 'string' && !isNaN(Number(value)) && value.trim() !== '') {
            const numValue = Number(value);
            if (key.includes('rent') || key.includes('deposit') || key.includes('fee') || 
                key.includes('bedrooms') || key.includes('bathrooms') || key.includes('square_footage') ||
                key.includes('year_built') || key.includes('lease_term') || key.includes('score')) {
              acc[key] = numValue;
            } else {
              acc[key] = value;
            }
          } else {
            // For empty strings or non-numeric strings, save as-is
            // Convert empty strings to null for optional numeric fields to avoid database errors
            if (value === '' && (key.includes('rent') || key.includes('deposit') || key.includes('fee') || 
                key.includes('year_built') || key.includes('lease_term') || key.includes('score'))) {
              acc[key] = null;
            } else {
              acc[key] = value;
            }
          }
        }
        return acc;
      }, {} as Record<string, FormDataValue>);

      // Always attempt to save, even if only empty values (important for clearing fields)
      let result;
      
      if (tableName === 'properties') {
        // Update properties table
        result = await supabase
          .from('properties')
          .update(cleanData)
          .eq('id', propertyId);
      } else if (tableName === 'property_listings') {
        // Check if listing exists, then update or insert
        const { data: existingListing } = await supabase
          .from('property_listings')
          .select('id')
          .eq('property_id', propertyId)
          .single();

        if (existingListing) {
          result = await supabase
            .from('property_listings')
            .update({ ...cleanData, property_id: propertyId })
            .eq('property_id', propertyId);
        } else {
          result = await supabase
            .from('property_listings')
            .insert([{ ...cleanData, property_id: propertyId, listing_status: 'pending' }]);
        }
      }

      if (result?.error) {
        throw result.error;
      }

      onSaveSuccess?.();
    } catch (error) {
      console.error('Auto-save error:', error);
      onSaveError?.(error as Error);
    } finally {
      isSavingRef.current = false;
    }
  }, [propertyId, tableName, onSaveSuccess, onSaveError]);

  // Auto-save when form data changes
  useEffect(() => {
    const currentDataString = JSON.stringify(formData);
    
    // Skip if data hasn't changed
    if (currentDataString === previousDataRef.current) return;
    
    previousDataRef.current = currentDataString;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounced save
    timeoutRef.current = setTimeout(() => {
      saveData(formData);
    }, debounceMs);

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [formData, saveData, debounceMs]);

  // Save immediately when navigating away
  const saveImmediately = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    return saveData(formData);
  }, [formData, saveData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { saveImmediately };
} 