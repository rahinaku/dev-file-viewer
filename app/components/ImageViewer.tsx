import type { ClientFileItem } from "../types/clientTypes";
import { getFileApiEndpoint } from "~/lib/fileTypeUtils";

interface ImageViewerProps {
  file: ClientFileItem;
}

export function ImageViewer({ file }: ImageViewerProps) {
  return (
    <img
      src={`${getFileApiEndpoint(file.path)}?path=${encodeURIComponent(file.path)}`}
      alt={file.name}
      className="w-full h-full object-contain"
      onClick={(e) => e.stopPropagation()}
    />
  );
}