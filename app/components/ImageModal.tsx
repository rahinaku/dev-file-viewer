import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { ClientFileItem } from "../types/clientTypes";

interface ImageModalProps {
  isOpen: boolean;
  currentImage: ClientFileItem | null;
  images: ClientFileItem[];
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

function downloadImage(image: ClientFileItem) {
  const imageUrl = `/api/image?path=${encodeURIComponent(image.path)}`;
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = image.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function ImageModal({ isOpen, currentImage, images, onClose, onNext, onPrev }: ImageModalProps) {
  console.log('ImageModal render:', { isOpen, currentImage: currentImage?.name, imageCount: images.length });
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowRight") {
        onNext();
      } else if (event.key === "ArrowLeft") {
        onPrev();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  // Debug: Always show if we have a current image for testing
  console.log('ImageModal conditions:', { 
    isOpen, 
    hasCurrentImage: !!currentImage, 
    hasDocument: typeof document !== 'undefined' 
  });
  
  if (!currentImage || typeof document === 'undefined') return null;

  const currentIndex = images.findIndex(img => img.path === currentImage.path);
  const hasNext = currentIndex < images.length - 1;
  const hasPrev = currentIndex > 0;

  const modal = (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black ${isOpen ? 'bg-opacity-90' : 'bg-opacity-0 pointer-events-none'}`}>
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        aria-label="Close modal"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Download button */}
      <button
        onClick={() => downloadImage(currentImage)}
        className="absolute top-4 right-16 text-white hover:text-gray-300 z-10"
        aria-label="Download image"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </button>

      {/* Navigation buttons */}
      {hasPrev && (
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
          aria-label="Previous image"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {hasNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
          aria-label="Next image"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Image container */}
      <div 
        className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        onClick={onClose}
      >
        <img
          src={`/api/image?path=${encodeURIComponent(currentImage.path)}`}
          alt={currentImage.name}
          className="max-w-full max-h-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Image info */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
        <p className="text-lg font-medium">{currentImage.name}</p>
        <p className="text-sm text-gray-300">
          {currentIndex + 1} / {images.length}
        </p>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}