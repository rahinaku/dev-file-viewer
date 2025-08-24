import { useState, useEffect } from "react";
import type { ClientDirectoryData, ClientFileItem, PaginatedClientDirectoryData } from "../types/clientTypes";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { EmptyDirectoryView } from "./EmptyDirectoryView";
import { FileViewerHeader } from "./FileViewerHeader";
import { FolderItem } from "./FolderItem";
import { FileItem } from "./FileItem";
import { MediaModal } from "./MediaModal";

interface FileViewerPresenterProps {
    data: PaginatedClientDirectoryData;
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

    // Use infinite scroll hook
    const { items, loading, hasMore, setTargetRef } = useInfiniteScroll({
        initialData: data,
        currentPath: data.currentPath,
        limit: 50
    });

    // Extract all media files from the current items
    const mediaFiles = items.filter((item): item is ClientFileItem =>
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
                        {items.map((item) => (
                            <div key={`${item.path}-${item.name}`} className="group">
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

                    {/* Loading indicator */}
                    {loading && (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    )}

                    {/* Infinite scroll trigger */}
                    {hasMore && !loading && (
                        <div ref={setTargetRef} className="h-4 w-full" />
                    )}

                    {/* Bottom indicator when no more items */}
                    {!hasMore && !loading && items.length > 0 && (
                        <div className="flex justify-center py-8 text-gray-500">
                            <div className="flex items-center space-x-2">
                                <div className="h-px bg-gray-300 w-8"></div>
                                <span className="text-sm">最下部に到達しました</span>
                                <div className="h-px bg-gray-300 w-8"></div>
                            </div>
                        </div>
                    )}

                    {items.length === 0 && !loading && <EmptyDirectoryView />}
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
