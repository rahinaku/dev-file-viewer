import type { ClientFileItem } from "../types/clientTypes";
import { getFileApiEndpoint, getMimeType, getSafariCompatibleMimeType } from "~/lib/fileTypeUtils";
import { useState } from "react";

interface AudioViewerProps {
  file: ClientFileItem;
}

export function AudioViewer({ file }: AudioViewerProps) {
  const [duration, setDuration] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('Loading...');
  const mimeType = getMimeType(file.path);
  const safariMimeType = getSafariCompatibleMimeType(file.path);
  const audioUrl = `${getFileApiEndpoint(file.path)}?path=${encodeURIComponent(file.path)}`;

  const formatDuration = (seconds: number): string => {
    if (!isFinite(seconds) || isNaN(seconds)) return '--:--';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-8" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
      <div className="bg-gray-800 p-12 rounded-lg max-w-2xl w-full">
        <svg className="w-32 h-32 text-white mb-4 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 12a7.971 7.971 0 00-1.343-4.243 1 1 0 010-1.414z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M13.828 7.172a1 1 0 011.414 0A5.983 5.983 0 0117 12a5.983 5.983 0 01-1.758 4.828 1 1 0 01-1.414-1.414A3.987 3.987 0 0015 12a3.987 3.987 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        
        {/* File info */}
        <div className="text-center mb-4">
          <h3 className="text-white text-lg font-medium mb-2">{file.name}</h3>
          <div className="flex flex-col items-center gap-2 text-sm text-gray-300">
            <span>Duration: {duration ? formatDuration(duration) : '--:--'}</span>
            <span>MIME: {mimeType}</span>
            <span className="text-xs text-gray-400">{debugInfo}</span>
            {error && <span className="text-red-400">Error: {error}</span>}
          </div>
        </div>
        <audio
          className="w-full h-12"
          controls
          preload="metadata"
          playsInline
          style={{ minHeight: '48px' }}
          onLoadedMetadata={(e: React.SyntheticEvent<HTMLAudioElement>) => {
            const audio = e.currentTarget;
            console.log('Audio metadata loaded:', {
              duration: audio.duration,
              readyState: audio.readyState,
              networkState: audio.networkState,
              file: file.name,
              src: audio.src
            });
            
            setDebugInfo(`Metadata loaded - Duration: ${audio.duration}, ReadyState: ${audio.readyState}`);
            
            if (audio.duration && isFinite(audio.duration)) {
              setDuration(audio.duration);
              setError(null);
            }
          }}
          onLoadedData={(e: React.SyntheticEvent<HTMLAudioElement>) => {
            const audio = e.currentTarget;
            console.log('Audio data loaded:', {
              duration: audio.duration,
              file: file.name
            });
            
            // Backup in case onLoadedMetadata didn't fire
            if (audio.duration && isFinite(audio.duration) && !duration) {
              setDuration(audio.duration);
              setError(null);
            }
          }}
          onCanPlay={(e: React.SyntheticEvent<HTMLAudioElement>) => {
            const audio = e.currentTarget;
            console.log('Audio can play:', {
              duration: audio.duration,
              file: file.name
            });
            
            // Final backup in case other events didn't fire
            if (audio.duration && isFinite(audio.duration) && !duration) {
              setDuration(audio.duration);
              setError(null);
            }
          }}
          onError={(e: React.SyntheticEvent<HTMLAudioElement>) => {
            console.error('Audio loading error:', {
              error: e.currentTarget.error,
              errorCode: e.currentTarget.error?.code,
              networkState: e.currentTarget.networkState,
              readyState: e.currentTarget.readyState,
              file: file.name,
              src: e.currentTarget.src
            });
            
            // Safari error handling - try fallback
            const audio = e.currentTarget;
            if (audio.error && audio.error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
              setError('Format not supported');
              console.warn('Media format not supported, trying fallback approach');
            } else if (audio.error) {
              setError(`Error code: ${audio.error.code}`);
            }
          }}
          onLoadStart={(): void => {
            console.log('Audio load started for:', file.name);
            setDebugInfo('Load started...');
          }}
          onDurationChange={(e: React.SyntheticEvent<HTMLAudioElement>) => {
            const audio = e.currentTarget;
            console.log('Audio duration changed:', {
              duration: audio.duration,
              file: file.name
            });
            
            setDebugInfo(`Duration changed: ${audio.duration}`);
            
            if (audio.duration && isFinite(audio.duration)) {
              setDuration(audio.duration);
              setError(null);
            }
          }}
          onSuspend={(e: React.SyntheticEvent<HTMLAudioElement>) => {
            console.log('Audio loading suspended (normal in Safari):', file.name);
          }}
        >
          {/* Primary source with detailed codec info */}
          <source 
            src={audioUrl}
            type={mimeType}
          />
          {/* Fallback source with simplified MIME type for Safari */}
          {safariMimeType !== mimeType && (
            <source 
              src={audioUrl}
              type={safariMimeType}
            />
          )}
          {/* Final fallback without type attribute */}
          <source src={audioUrl} />
          お使いのブラウザはこの音声形式をサポートしていません。
        </audio>
      </div>
    </div>
  );
}