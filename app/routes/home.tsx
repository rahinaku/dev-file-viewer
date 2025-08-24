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
  const { config } = await import("dotenv");
  const { FileViewerService } = await import("../services/FileViewerService");
  
  // .envファイルを読み込み (サーバーサイドのみ)
  config();
  
  const url = new URL(request.url);
  const requestedRelativePath = url.searchParams.get("path");
  
  try {
    const fileViewerService = new FileViewerService();
    
    // 相対パスからDirectoryDataを取得
    const directoryData = await fileViewerService.getDirectoryData(requestedRelativePath || undefined);
    
    // レスポンスから絶対パス情報を除外し、クライアント用の型に変換
    const sanitizedData = {
      currentPath: directoryData.currentRelativePath,
      parentPath: directoryData.parentRelativePath,
      items: directoryData.items.map(item => {
        if (item.type === "file") {
          return {
            name: item.name,
            type: "file" as const,
            path: item.relativePath,
            isImage: item.isImage
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
      canGoUp: directoryData.canGoUp
    };
    
    return sanitizedData;
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    throw new Response("Directory not found", { status: 404 });
  }
}

export default function Home() {
  const data = useLoaderData<typeof loader>();
  
  return <FileViewerPresenter data={data} />;
}
