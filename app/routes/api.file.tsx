import type { Route } from "./+types/api.file";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import * as path from "node:path";

export async function loader({ request }: Route.LoaderArgs) {
  // Import Node.js modules only on server-side
  const { config } = await import("dotenv");
  
  // .envファイルを読み込み (サーバーサイドのみ)
  config();
  
  const url = new URL(request.url);
  const requestedRelativePath = url.searchParams.get("path");
  
  if (!requestedRelativePath) {
    throw new Response("Path parameter is required", { status: 400 });
  }
  
  try {
    const rootFolder = process.env.ROOT_FOLDER || process.cwd();
    const resolvedRootFolder = path.resolve(rootFolder);
    
    // Remove leading slash and resolve relative to root folder
    const normalizedRelativePath = requestedRelativePath.startsWith('/') 
      ? requestedRelativePath.slice(1) 
      : requestedRelativePath;
    
    const filePath = path.resolve(resolvedRootFolder, normalizedRelativePath);
    
    // Security check: ensure file is within root folder
    if (!filePath.startsWith(resolvedRootFolder)) {
      throw new Response("Access denied", { status: 403 });
    }
    
    // Check if file exists and is a file
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      throw new Response("File not found", { status: 404 });
    }
    
    // Get file info
    const fileName = path.basename(filePath);
    const fileSize = fileStat.size;
    
    // Create read stream
    const fileStream = createReadStream(filePath);
    
    // Determine content type based on file extension
    const ext = path.extname(fileName).toLowerCase();
    let contentType = 'application/octet-stream';
    
    const contentTypes: { [key: string]: string } = {
      '.txt': 'text/plain',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.zip': 'application/zip',
      '.rar': 'application/x-rar-compressed',
      '.7z': 'application/x-7z-compressed',
      '.json': 'application/json',
      '.xml': 'application/xml',
      '.csv': 'text/csv',
    };
    
    if (contentTypes[ext]) {
      contentType = contentTypes[ext];
    }
    
    // Return file as download
    return new Response(fileStream as any, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileSize.toString(),
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
        'Cache-Control': 'no-cache',
      },
    });
    
  } catch (error) {
    console.error('File download error:', error);
    throw new Response("File not found", { status: 404 });
  }
}