import { useState, useEffect } from "react";
import { Form } from "react-router";
import type { ClientDirectoryData, ClientFileItem } from "../types/clientTypes";
import { FolderIcon } from "./icons/FolderIcon";
import { FileIcon } from "./icons/FileIcon";
import { EmptyDirectoryView } from "./EmptyDirectoryView";
import { FileViewerHeader } from "./FileViewerHeader";
import { FolderItem } from "./FolderItem";
import { FileItem } from "./FileItem";
import { ImageModal } from "./ImageModal";

interface FileViewerPresenterProps {
  data: ClientDirectoryData;
}

export function FileViewerPresenter({ data }: FileViewerPresenterProps) {
  const [modalImage, setModalImage] = useState<ClientFileItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side rendering for modal
  useEffect(() => {
    setIsClient(true);
    console.log('FileViewerPresenter mounted on client');
  }, []);

  // Extract all images from the directory
  const images = data.items.filter((item): item is ClientFileItem => 
    item.type === "file" && item.isImage
  );

  const openImageModal = (image: ClientFileItem) => {
    console.log('Opening modal for image:', image.name);
    setModalImage(image);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  const navigateToNextImage = () => {
    if (!modalImage) return;
    const currentIndex = images.findIndex(img => img.path === modalImage.path);
    const nextIndex = (currentIndex + 1) % images.length;
    setModalImage(images[nextIndex]);
  };

  const navigateToPrevImage = () => {
    if (!modalImage) return;
    const currentIndex = images.findIndex(img => img.path === modalImage.path);
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setModalImage(images[prevIndex]);
  };

  const downloadFile = (file: ClientFileItem) => {
    console.log('Downloading file:', file.name);
    const fileUrl = `/api/file?path=${encodeURIComponent(file.path)}`;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
                  <FileItem 
                    item={item} 
                    onImageClick={isClient ? openImageModal : undefined}
                    onFileClick={isClient ? downloadFile : undefined}
                  />
                )}
              </div>
            ))}
          </div>

          {data.items.length === 0 && <EmptyDirectoryView />}
        </div>
      </div>

      {isClient && (
        <ImageModal
          isOpen={isModalOpen}
          currentImage={modalImage}
          images={images}
          onClose={closeImageModal}
          onNext={navigateToNextImage}
          onPrev={navigateToPrevImage}
        />
      )}
    </div>
  );
}