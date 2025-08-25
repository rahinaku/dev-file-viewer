import type { ClientFileItem } from "../types/clientTypes";
import { getFileApiEndpoint } from "~/lib/fileTypeUtils";

interface VideoViewerProps {
  file: ClientFileItem;
}

export function VideoViewer({ file }: VideoViewerProps) {
  return (
    <video
      src={`${getFileApiEndpoint(file.path)}?path=${encodeURIComponent(file.path)}`}
      className="w-full h-full object-contain"
      controls
      onClick={(e) => e.stopPropagation()}
    />
  );
}