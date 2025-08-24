import type { ClientFileItem } from "../types/clientTypes";
import { FileIcon } from "./icons/FileIcon";

interface FileItemProps {
  item: ClientFileItem;
}

export function FileItem({ item }: FileItemProps) {
  return (
    <div className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow duration-200">
      <div className="aspect-square mb-3 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
        {item.isImage ? (
          <img
            src={`/api/image?path=${encodeURIComponent(item.path)}`}
            alt={item.name}
            className="w-full h-full object-cover"
          />
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