import type { ClientFileItem } from "../types/clientTypes";

interface VideoViewerProps {
  file: ClientFileItem;
}

export function VideoViewer({ file }: VideoViewerProps) {
  return (
    <video
      src={`/api/image?path=${encodeURIComponent(file.path)}`}
      className="w-full h-full object-contain"
      controls
      onClick={(e) => e.stopPropagation()}
    />
  );
}