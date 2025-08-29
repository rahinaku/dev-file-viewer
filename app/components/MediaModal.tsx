import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ClientFileItem } from "../types/clientTypes";
import { ImageViewer } from "./ImageViewer";
import { VideoViewer } from "./VideoViewer";
import { AudioViewer } from "./AudioViewer";
import { getFileApiEndpoint, getFileType } from "~/lib/fileTypeUtils";

interface MediaModalProps {
  isOpen: boolean;
  currentFile: ClientFileItem | null;
  files: ClientFileItem[];
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

function downloadFile(file: ClientFileItem) {
  const fileUrl = `${getFileApiEndpoint(file.path)}?path=${encodeURIComponent(file.path)}`;
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function MediaModal({ isOpen, currentFile, files, onClose, onNext, onPrev }: MediaModalProps) {
  console.log('MediaModal render:', { isOpen, currentFile: currentFile?.name, fileCount: files.length });
  
  // Swipe state management
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchMove, setTouchMove] = useState<{ x: number; y: number } | null>(null);
  const [isSwipe, setIsSwipe] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchMove(null);
    setIsSwipe(false);
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    setTouchMove({ x: touch.clientX, y: touch.clientY });
    
    // Determine if this is a horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      setIsSwipe(true);
      e.preventDefault(); // Prevent scrolling
      
      // Apply visual feedback during swipe
      if (containerRef.current) {
        const clampedDelta = Math.max(-100, Math.min(100, deltaX * 0.3)); // Limit and reduce movement
        containerRef.current.style.transform = `translateX(${clampedDelta}px)`;
        containerRef.current.style.transition = 'none';
      }
    }
  };

  // Handle touch end
  const handleTouchEnd = () => {
    // Reset visual transform with animation
    if (containerRef.current) {
      containerRef.current.style.transition = 'transform 0.3s ease-out';
      containerRef.current.style.transform = 'translateX(0)';
    }

    if (!touchStart || !touchMove || !isSwipe) {
      setTouchStart(null);
      setTouchMove(null);
      setIsSwipe(false);
      return;
    }

    const deltaX = touchMove.x - touchStart.x;
    const threshold = 50; // Minimum swipe distance

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        // Swipe right - go to previous image
        const currentIndex = files.findIndex(file => file.path === currentFile?.path);
        if (currentIndex > 0) {
          onPrev();
        }
      } else {
        // Swipe left - go to next image
        const currentIndex = files.findIndex(file => file.path === currentFile?.path);
        if (currentIndex < files.length - 1) {
          onNext();
        }
      }
    }

    setTouchStart(null);
    setTouchMove(null);
    setIsSwipe(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (event.key === "ArrowRight") {
        onNext();
      } else if (event.key === "ArrowLeft") {
        onPrev();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  // Debug: Always show if we have a current file for testing
  console.log('MediaModal conditions:', { 
    isOpen, 
    hasCurrentFile: !!currentFile, 
    hasDocument: typeof document !== 'undefined' 
  });
  
  if (!currentFile || typeof document === 'undefined') return null;

  const currentIndex = files.findIndex(file => file.path === currentFile.path);
  const hasNext = currentIndex < files.length - 1;
  const hasPrev = currentIndex > 0;
  const fileType = getFileType(currentFile.path);

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
        onClick={() => downloadFile(currentFile)}
        className="absolute top-4 right-16 text-white hover:text-gray-300 z-10"
        aria-label="Download file"
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
          aria-label="Previous file"
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
          aria-label="Next file"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Media container */}
      <div 
        ref={containerRef}
        className="relative w-[90vw] h-[90vh] flex items-center justify-center p-4 touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {fileType === 'image' && <ImageViewer file={currentFile} />}
        {fileType === 'video' && <VideoViewer file={currentFile} />}
        {fileType === 'audio' && <AudioViewer file={currentFile} />}
        
        {/* Swipe indicators */}
        {isSwipe && touchStart && touchMove && (
          <>
            {touchMove.x - touchStart.x > 30 && (
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 rounded-full p-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            )}
            {touchStart.x - touchMove.x > 30 && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 rounded-full p-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </>
        )}
      </div>

      {/* File info */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
        <p className="text-lg font-medium">{currentFile.name}</p>
        <p className="text-sm text-gray-300">
          {currentIndex + 1} / {files.length}
        </p>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}