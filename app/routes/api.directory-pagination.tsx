import type { Route } from "./+types/api.directory-pagination";

export async function loader({ request }: Route.LoaderArgs) {
  // Import Node.js modules only on server-side
  const { FileViewerService } = await import("../services/FileViewerService");
  
  const url = new URL(request.url);
  const requestedRelativePath = url.searchParams.get("path");
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);
  const limit = parseInt(url.searchParams.get("limit") || "50", 10);
  
  console.log('API Pagination request:', { 
    requestedRelativePath, 
    offset, 
    limit,
    decodedPath: requestedRelativePath ? decodeURIComponent(requestedRelativePath) : null
  });
  
  try {
    const fileViewerService = new FileViewerService();
    
    // 全てのディレクトリデータを取得してからページネーション適用
    const allDirectoryData = await fileViewerService.getDirectoryData(requestedRelativePath || undefined);
    const totalItems = allDirectoryData.items.length;
    const paginatedItems = allDirectoryData.items.slice(offset, offset + limit);
    const hasMore = offset + limit < totalItems;
    
    // レスポンスから絶対パス情報を除外し、クライアント用の型に変換
    const sanitizedData = {
      currentPath: allDirectoryData.currentRelativePath,
      parentPath: allDirectoryData.parentRelativePath,
      items: paginatedItems.map(item => {
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
      canGoUp: allDirectoryData.canGoUp,
      hasMore: hasMore,
      total: totalItems,
      offset: offset,
      limit: limit
    };
    
    return Response.json(sanitizedData);
  } catch (error) {
    console.error('API Directory pagination error:', error);
    if (error instanceof Response) {
      throw error;
    }
    const errorMessage = error instanceof Error ? error.message : "Directory not found";
    return Response.json({ error: errorMessage }, { status: 404 });
  }
}