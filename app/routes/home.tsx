import type { Route } from "./+types/home";
import { useLoaderData } from "react-router";
import { FileViewerPresenter } from "../components/FileViewerPresenter";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "File Viewer" },
    { name: "description", content: "Browse and view files in directories" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  // Import Node.js modules only on server-side
  const { FileViewerService } = await import("../services/FileViewerService");
  
  const url = new URL(request.url);
  const requestedRelativePath = url.searchParams.get("path");
  
  try {
    const fileViewerService = new FileViewerService();
    
    // 相対パスからDirectoryDataを取得
    const directoryData = await fileViewerService.getDirectoryData(requestedRelativePath || undefined);
    
    // 通常のページリクエストの場合
    const totalItems = directoryData.items.length;
    const initialLimit = 50;
    const shouldUsePagination = totalItems > initialLimit;
    
    const sanitizedData = {
      currentPath: directoryData.currentRelativePath,
      parentPath: directoryData.parentRelativePath,
      items: directoryData.items.slice(0, initialLimit).map(item => {
        if (item.type === "file") {
          return {
            name: item.name,
            type: "file" as const,
            path: item.relativePath,
            isImage: item.isImage,
            isVideo: item.isVideo,
            isAudio: item.isAudio,
            isZip: item.isZip
          };
        } else {
          return {
            name: item.name,
            type: "folder" as const,
            path: item.relativePath,
            previewImages: item.previewImages
          };
        }
      }),
      canGoUp: directoryData.canGoUp,
      hasMore: shouldUsePagination,
      total: totalItems,
      offset: 0,
      limit: initialLimit
    };
    
    return sanitizedData;
  } catch (error) {
    console.error('Directory loading error:', error);
    if (error instanceof Response) {
      throw error;
    }
    const errorMessage = error instanceof Error ? error.message : "Directory not found";
    throw new Response(errorMessage, { status: 404 });
  }
}

export default function Home() {
  const data = useLoaderData<typeof loader>();
  
  return <FileViewerPresenter data={data} />;
}
