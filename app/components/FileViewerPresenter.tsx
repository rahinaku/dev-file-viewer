import { Form } from "react-router";
import type { ClientDirectoryData } from "../types/clientTypes";
import { FolderIcon } from "./icons/FolderIcon";
import { FileIcon } from "./icons/FileIcon";
import { EmptyDirectoryView } from "./EmptyDirectoryView";
import { FileViewerHeader } from "./FileViewerHeader";
import { FolderItem } from "./FolderItem";
import { FileItem } from "./FileItem";

interface FileViewerPresenterProps {
  data: ClientDirectoryData;
}

export function FileViewerPresenter({ data }: FileViewerPresenterProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <FileViewerHeader 
            currentPath={data.currentPath}
            parentPath={data.parentPath}
            canGoUp={data.canGoUp}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {data.items.map((item) => (
              <div key={item.name} className="group">
                {item.type === "folder" ? (
                  <FolderItem item={item} />
                ) : (
                  <FileItem item={item} />
                )}
              </div>
            ))}
          </div>

          {data.items.length === 0 && <EmptyDirectoryView />}
        </div>
      </div>
    </div>
  );
}