import { Form } from "react-router";
import type { ClientFolderItem } from "../types/clientTypes";
import { FolderIcon } from "./icons/FolderIcon";
import { FolderPreviewImages } from "./FolderPreviewImages";

interface FolderItemProps {
  item: ClientFolderItem;
}

export function FolderItem({ item }: FolderItemProps) {
  return (
    <Form method="get">
      <input type="hidden" name="path" value={item.path} />
      <button
        type="submit"
        className="w-full p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md hover:scale-[1.02] transition-all duration-200 text-left group-hover:bg-blue-50"
      >
        <div className="aspect-square mb-3 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
          {item.previewImages && item.previewImages.length > 0 ? (
            <FolderPreviewImages images={item.previewImages} />
          ) : (
            <FolderIcon />
          )}
        </div>
        <p className="text-sm font-medium text-gray-900 truncate" title={item.name}>
          {item.name}
        </p>
        <p className="text-xs text-gray-500">Folder</p>
      </button>
    </Form>
  );
}