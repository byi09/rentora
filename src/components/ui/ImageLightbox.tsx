'use client';
import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxImage {
  src: string;
  alt?: string;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  startIndex?: number;
  onClose: () => void;
}

export default function ImageLightbox({ images, startIndex = 0, onClose }: ImageLightboxProps) {
  const [current, setCurrent] = useState(startIndex);

  const prev = useCallback(() => {
    setCurrent((prevIdx) => (prevIdx - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setCurrent((prevIdx) => (prevIdx + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        next();
      } else if (e.key === 'ArrowLeft') {
        prev();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [next, prev, onClose]);

  if (!images || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-200 focus:outline-none"
      >
        <X size={32} />
      </button>

      {/* Prev / Next */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 md:left-8 text-white hover:text-gray-200 focus:outline-none"
            aria-label="Previous image"
          >
            <ChevronLeft size={48} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 md:right-8 text-white hover:text-gray-200 focus:outline-none"
            aria-label="Next image"
          >
            <ChevronRight size={48} />
          </button>
        </>
      )}

      {/* Image */}
      <img
        src={images[current].src}
        alt={images[current].alt || ''}
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-xl"
      />
    </div>
  );
} 