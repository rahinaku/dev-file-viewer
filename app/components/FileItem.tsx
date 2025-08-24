import type { ClientFileItem } from "../types/clientTypes";
import { FileIcon } from "./icons/FileIcon";
import { LoadingSpinner } from "./LoadingSpinner";
import { useState } from "react";

interface FileItemProps {
  item: ClientFileItem;
  onImageClick?: (file: ClientFileItem) => void;
  onFileClick?: (file: ClientFileItem) => void;
}

export function FileItem({ item, onImageClick, onFileClick }: FileItemProps) {
  const [isExtracting, setIsExtracting] = useState(false);
  
  const handleClick = async () => {
    if (isExtracting) return; // 解凍中はクリックを無効化
    
    console.log('FileItem clicked:', { isImage: item.isImage, isVideo: item.isVideo, isAudio: item.isAudio, isZip: item.isZip, hasImageCallback: !!onImageClick, hasFileCallback: !!onFileClick, name: item.name });
    
    if (item.isZip) {
      setIsExtracting(true);
      try {
        const response = await fetch(`/api/extract-zip?path=${encodeURIComponent(item.path)}`, {
          method: 'POST'
        });
        
        if (response.ok) {
          // ZIP extraction completed, reload the page
          window.location.reload();
        } else {
          console.error('Failed to extract ZIP file:', response.statusText);
          setIsExtracting(false);
        }
      } catch (error) {
        console.error('Error extracting ZIP file:', error);
        setIsExtracting(false);
      }
    } else if ((item.isImage || item.isVideo || item.isAudio) && onImageClick) {
      onImageClick(item);
    } else if (onFileClick) {
      onFileClick(item);
    }
  };

  return (
    <div className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow duration-200">
      <div 
        className={`aspect-square mb-3 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden ${
          isExtracting ? 'cursor-wait' : 
          ((item.isImage || item.isVideo || item.isAudio) && onImageClick) || onFileClick ? 'cursor-pointer hover:scale-[1.02] transition-transform duration-200' : ''
        }`}
        onClick={handleClick}
      >
        {item.isImage ? (
          <img
            src={`/api/image?path=${encodeURIComponent(item.path)}`}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : isExtracting ? (
          <div className="flex flex-col items-center gap-2">
            <LoadingSpinner />
            <span className="text-xs text-gray-500">解凍中...</span>
          </div>
        ) : (
          <FileIcon />
        )}
      </div>
      <p className="text-sm font-medium text-gray-900 truncate" title={item.name}>
        {item.name}
      </p>
      <p className="text-xs text-gray-500">File</p>
    </div>
  );
}