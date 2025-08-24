import type { Route } from "./+types/api.image";
import * as fs from "node:fs";
import * as path from "node:path";
import { config } from "dotenv";

// .envファイルを読み込み
config();

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const relativeImagePath = url.searchParams.get("path");
  
  if (!relativeImagePath) {
    throw new Response("Image path is required", { status: 400 });
  }

  try {
    const rootFolder = process.env.ROOT_FOLDER || process.cwd();
    const resolvedRootFolder = path.resolve(rootFolder);
    
    // 相対パスから絶対パスに変換
    const absoluteImagePath = path.resolve(resolvedRootFolder, relativeImagePath.startsWith("/") ? relativeImagePath.slice(1) : relativeImagePath);
    
    // デバッグログ (本番環境では削除)
    if (process.env.NODE_ENV === 'development') {
      console.log("Image request:", { 
        relativeImagePath, 
        absoluteImagePath,
        rootFolder: resolvedRootFolder
      });
    }
    
    // セキュリティチェック: パストラバーサル攻撃を防ぐ
    if (!absoluteImagePath.startsWith(resolvedRootFolder)) {
      console.error("Security check failed:", {
        absoluteImagePath,
        resolvedRootFolder,
        startsWithResult: absoluteImagePath.startsWith(resolvedRootFolder)
      });
      throw new Response("Access denied", { status: 403 });
    }

    const stats = await fs.promises.stat(absoluteImagePath);
    if (!stats.isFile()) {
      throw new Response("Not a file", { status: 404 });
    }

    // ファイル拡張子から MIME タイプを判定
    const ext = path.extname(absoluteImagePath).toLowerCase();
    let contentType = "application/octet-stream";
    
    switch (ext) {
      case ".jpg":
      case ".jpeg":
        contentType = "image/jpeg";
        break;
      case ".png":
        contentType = "image/png";
        break;
      case ".gif":
        contentType = "image/gif";
        break;
      case ".webp":
        contentType = "image/webp";
        break;
      case ".svg":
        contentType = "image/svg+xml";
        break;
    }

    const fileBuffer = await fs.promises.readFile(absoluteImagePath);
    
    return new Response(new Uint8Array(fileBuffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Image API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Response(`Image not found: ${errorMessage}`, { status: 404 });
  }
}