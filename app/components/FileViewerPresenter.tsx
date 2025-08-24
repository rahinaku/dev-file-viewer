import { useState, useEffect } from "react";
import type { ClientDirectoryData, ClientFileItem } from "../types/clientTypes";
import { EmptyDirectoryView } from "./EmptyDirectoryView";
import { FileViewerHeader } from "./FileViewerHeader";
import { FolderItem } from "./FolderItem";
import { FileItem } from "./FileItem";
import { MediaModal } from "./MediaModal";

interface FileViewerPresenterProps {
    data: ClientDirectoryData;
}

export function FileViewerPresenter({ data }: FileViewerPresenterProps) {
    const [modalFile, setModalFile] = useState<ClientFileItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    // Ensure client-side rendering for modal
    useEffect(() => {
        setIsClient(true);
        console.log('FileViewerPresenter mounted on client');
    }, []);

    // Extract all media files from the directory
    const mediaFiles = data.items.filter((item): item is ClientFileItem =>
        item.type === "file" && (item.isImage || item.isVideo || item.isAudio)
    );

    const openMediaModal = (file: ClientFileItem) => {
        console.log('Opening modal for file:', file.name);
        setModalFile(file);
        setIsModalOpen(true);
    };

    const closeMediaModal = () => {
        setIsModalOpen(false);
        setModalFile(null);
    };

    const navigateToNextFile = () => {
        if (!modalFile) return;
        const currentIndex = mediaFiles.findIndex(file => file.path === modalFile.path);
        const nextIndex = (currentIndex + 1) % mediaFiles.length;
        setModalFile(mediaFiles[nextIndex]);
    };

    const navigateToPrevFile = () => {
        if (!modalFile) return;
        const currentIndex = mediaFiles.findIndex(file => file.path === modalFile.path);
        const prevIndex = currentIndex === 0 ? mediaFiles.length - 1 : currentIndex - 1;
        setModalFile(mediaFiles[prevIndex]);
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
                                        onImageClick={isClient ? openMediaModal : undefined}
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
                <MediaModal
                    isOpen={isModalOpen}
                    currentFile={modalFile}
                    files={mediaFiles}
                    onClose={closeMediaModal}
                    onNext={navigateToNextFile}
                    onPrev={navigateToPrevFile}
                />
            )}
        </div>
    );
}
