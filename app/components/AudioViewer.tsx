import type { ClientFileItem } from "../types/clientTypes";
import { getFileApiEndpoint } from "~/lib/fileTypeUtils";

interface AudioViewerProps {
  file: ClientFileItem;
}

export function AudioViewer({ file }: AudioViewerProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-8" onClick={(e) => e.stopPropagation()}>
      <div className="bg-gray-800 p-12 rounded-lg max-w-2xl w-full">
        <svg className="w-32 h-32 text-white mb-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 12a7.971 7.971 0 00-1.343-4.243 1 1 0 010-1.414z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M13.828 7.172a1 1 0 011.414 0A5.983 5.983 0 0117 12a5.983 5.983 0 01-1.758 4.828 1 1 0 01-1.414-1.414A3.987 3.987 0 0015 12a3.987 3.987 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        <audio
          src={`${getFileApiEndpoint(file.path)}?path=${encodeURIComponent(file.path)}`}
          className="w-full h-12"
          controls
          preload="metadata"
          style={{ minHeight: '48px' }}
          onLoadedMetadata={(e) => {
            const audio = e.currentTarget;
            console.log('Audio metadata loaded:', {
              duration: audio.duration,
              readyState: audio.readyState,
              networkState: audio.networkState,
              file: file.name,
              src: audio.src
            });
          }}
          onLoadedData={(e) => {
            console.log('Audio data loaded:', {
              duration: e.currentTarget.duration,
              file: file.name
            });
          }}
          onCanPlay={(e) => {
            console.log('Audio can play:', {
              duration: e.currentTarget.duration,
              file: file.name
            });
          }}
          onError={(e) => {
            console.error('Audio loading error:', {
              error: e.currentTarget.error,
              errorCode: e.currentTarget.error?.code,
              networkState: e.currentTarget.networkState,
              readyState: e.currentTarget.readyState,
              file: file.name,
              src: e.currentTarget.src
            });
          }}
          onLoadStart={() => {
            console.log('Audio load started for:', file.name);
          }}
        />
      </div>
    </div>
  );
}