import type { ClientFileItem } from "../types/clientTypes";
import { getFileApiEndpoint, getMimeType, getSafariCompatibleMimeType } from "~/lib/fileTypeUtils";
import { useState } from "react";

interface VideoViewerProps {
  file: ClientFileItem;
}

export function VideoViewer({ file }: VideoViewerProps) {
  const [duration, setDuration] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('Loading...');
  const mimeType = getMimeType(file.path);
  const safariMimeType = getSafariCompatibleMimeType(file.path);
  const videoUrl = `${getFileApiEndpoint(file.path)}?path=${encodeURIComponent(file.path)}`;

  const formatDuration = (seconds: number): string => {
    if (!isFinite(seconds) || isNaN(seconds)) return '--:--';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Video info overlay */}
      <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-70 rounded-lg p-3 text-white text-sm">
        <div className="flex flex-col gap-1">
          <span className="font-medium">{file.name}</span>
          <span>Duration: {duration ? formatDuration(duration) : '--:--'}</span>
          <span className="text-xs opacity-75">MIME: {mimeType.split(';')[0]}</span>
          <span className="text-xs opacity-60">{debugInfo}</span>
          {error && <span className="text-red-400 text-xs">Error: {error}</span>}
        </div>
      </div>
      
      <video
        className="w-full h-full object-contain"
        controls
        preload="metadata"
        playsInline
        {...({ 'webkit-playsinline': 'true' } as any)}
        onClick={(e: React.MouseEvent<HTMLVideoElement>) => e.stopPropagation()}
        onLoadStart={() => {
          console.log('Video load started for:', file.name);
          setDebugInfo('Load started...');
        }}
        onLoadedMetadata={(e: React.SyntheticEvent<HTMLVideoElement>) => {
          const video = e.currentTarget;
          console.log('Video metadata loaded:', {
            duration: video.duration,
            readyState: video.readyState,
            networkState: video.networkState,
            file: file.name,
            src: video.src,
            videoWidth: video.videoWidth,
            videoHeight: video.videoHeight
          });
          
          setDebugInfo(`Metadata loaded - Duration: ${video.duration}, ReadyState: ${video.readyState}`);
          
          if (video.duration && isFinite(video.duration)) {
            setDuration(video.duration);
            setError(null);
          }
        }}
        onLoadedData={(e: React.SyntheticEvent<HTMLVideoElement>) => {
          const video = e.currentTarget;
          console.log('Video data loaded:', {
            duration: video.duration,
            file: file.name
          });
          
          // Backup in case onLoadedMetadata didn't fire
          if (video.duration && isFinite(video.duration) && !duration) {
            setDuration(video.duration);
            setError(null);
          }
        }}
        onCanPlay={(e: React.SyntheticEvent<HTMLVideoElement>) => {
          const video = e.currentTarget;
          console.log('Video can play:', {
            duration: video.duration,
            file: file.name
          });
          
          // Final backup in case other events didn't fire
          if (video.duration && isFinite(video.duration) && !duration) {
            setDuration(video.duration);
            setError(null);
          }
        }}
        onDurationChange={(e: React.SyntheticEvent<HTMLVideoElement>) => {
          const video = e.currentTarget;
          console.log('Video duration changed:', {
            duration: video.duration,
            file: file.name
          });
          
          setDebugInfo(`Duration changed: ${video.duration}`);
          
          if (video.duration && isFinite(video.duration)) {
            setDuration(video.duration);
            setError(null);
          }
        }}
        onError={(e: React.SyntheticEvent<HTMLVideoElement>) => {
          console.error('Video loading error:', {
            error: e.currentTarget.error,
            errorCode: e.currentTarget.error?.code,
            networkState: e.currentTarget.networkState,
            readyState: e.currentTarget.readyState,
            file: file.name,
            src: e.currentTarget.src
          });
          
          // Safari error handling - try fallback
          const video = e.currentTarget;
          if (video.error && video.error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
            setError('Format not supported');
            console.warn('Media format not supported, trying fallback approach');
          } else if (video.error) {
            setError(`Error code: ${video.error.code}`);
          }
        }}
        onSuspend={() => {
          console.log('Video loading suspended (normal in Safari):', file.name);
        }}
      >
        {/* Primary source with detailed codec info */}
        <source 
          src={videoUrl}
          type={mimeType}
        />
        {/* Fallback source with simplified MIME type for Safari */}
        {safariMimeType !== mimeType && (
          <source 
            src={videoUrl}
            type={safariMimeType}
          />
        )}
        {/* Final fallback without type attribute */}
        <source src={videoUrl} />
        お使いのブラウザはこの動画形式をサポートしていません。
      </video>
    </div>
  );
}