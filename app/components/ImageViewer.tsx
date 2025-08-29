import { useState } from "react";
import type { ClientFileItem } from "../types/clientTypes";
import { getFileApiEndpoint } from "~/lib/fileTypeUtils";

interface ImageViewerProps {
  file: ClientFileItem;
}

export function ImageViewer({ file }: ImageViewerProps) {
  const [isFullImageLoaded, setIsFullImageLoaded] = useState(false);
  const [fullImageError, setFullImageError] = useState(false);
  
  const thumbnailSrc = `${getFileApiEndpoint(file.path)}?path=${encodeURIComponent(file.path)}&thumbnail=true`;
  const fullSrc = `${getFileApiEndpoint(file.path)}?path=${encodeURIComponent(file.path)}`;
  
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Thumbnail image - always visible, hidden when full image loads */}
      <img
        src={thumbnailSrc}
        alt={file.name}
        className={`w-full h-full object-contain transition-opacity duration-300 ${
          isFullImageLoaded ? 'opacity-0 absolute' : 'opacity-100'
        }`}
      />
      
      {/* Full resolution image - loads in background */}
      <img
        src={fullSrc}
        alt={file.name}
        className={`w-full h-full object-contain transition-opacity duration-300 ${
          isFullImageLoaded ? 'opacity-100' : 'opacity-0 absolute'
        }`}
        onLoad={() => setIsFullImageLoaded(true)}
        onError={() => setFullImageError(true)}
      />
      
      {/* Loading indicator */}
      {!isFullImageLoaded && !fullImageError && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          Loading full image...
        </div>
      )}
      
      {/* Error fallback */}
      {fullImageError && !isFullImageLoaded && (
        <div className="absolute top-4 left-4 bg-red-500 bg-opacity-75 text-white px-2 py-1 rounded text-sm">
          Failed to load full image
        </div>
      )}
    </div>
  );
}