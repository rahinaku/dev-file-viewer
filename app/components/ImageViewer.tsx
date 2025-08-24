import type { ClientFileItem } from "../types/clientTypes";

interface ImageViewerProps {
  file: ClientFileItem;
}

export function ImageViewer({ file }: ImageViewerProps) {
  return (
    <img
      src={`/api/image?path=${encodeURIComponent(file.path)}`}
      alt={file.name}
      className="w-full h-full object-contain"
      onClick={(e) => e.stopPropagation()}
    />
  );
}