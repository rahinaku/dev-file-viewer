import type { ClientFileItem } from "../types/clientTypes";
import { FileIcon } from "./icons/FileIcon";
import { VideoIcon } from "./icons/VideoIcon";
import { AudioIcon } from "./icons/AudioIcon";
import { LoadingSpinner } from "./LoadingSpinner";
import { useState } from "react";
import { getFileApiEndpoint } from "~/lib/fileTypeUtils";

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
    <div className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow duration-200 relative">
      {/* Media type badge */}
      {(item.isVideo || item.isAudio) && (
        <div className={`absolute top-1 right-1 z-10 px-2 py-1 rounded-full text-xs font-bold text-white ${
          item.isVideo ? 'bg-blue-500' : 'bg-green-500'
        }`}>
          {item.isVideo ? 'VIDEO' : 'AUDIO'}
        </div>
      )}
      <div 
        className={`aspect-square mb-3 rounded-lg flex items-center justify-center overflow-hidden ${
          item.isVideo ? 'bg-blue-50' :
          item.isAudio ? 'bg-green-50' :
          'bg-gray-50'
        } ${
          isExtracting ? 'cursor-wait' : 
          ((item.isImage || item.isVideo || item.isAudio) && onImageClick) || onFileClick ? 'cursor-pointer hover:scale-[1.02] transition-transform duration-200' : ''
        }`}
        onClick={handleClick}
      >
        {item.isImage ? (
          <img
            src={`${getFileApiEndpoint(item.path)}?path=${encodeURIComponent(item.path)}&thumbnail=true`}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : isExtracting ? (
          <div className="flex flex-col items-center gap-2">
            <LoadingSpinner />
            <span className="text-xs text-gray-500">解凍中...</span>
          </div>
        ) : item.isVideo ? (
          <div className="flex flex-col items-center gap-1">
            <VideoIcon />
          </div>
        ) : item.isAudio ? (
          <div className="flex flex-col items-center gap-1">
            <AudioIcon />
          </div>
        ) : (
          <FileIcon />
        )}
      </div>
      
      <div className="text-sm text-gray-900 font-medium truncate">
        {item.name}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {new Date(item.modifiedDate).toLocaleDateString()}
      </div>
    </div>
  );
}