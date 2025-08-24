import type { Route } from "./+types/api.extract-zip";
import { config } from "dotenv";
import path from "path";
import { stat, mkdir } from "fs/promises";
import { createReadStream } from "fs";
import { pipeline } from "stream/promises";
import { Extract } from "unzipper";

export async function action({ request }: Route.ActionArgs) {
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
    
    const zipFilePath = path.resolve(resolvedRootFolder, normalizedRelativePath);
    
    // Security check: ensure file is within root folder
    if (!zipFilePath.startsWith(resolvedRootFolder)) {
      throw new Response("Access denied", { status: 403 });
    }
    
    // Check if ZIP file exists and is a file
    const zipStat = await stat(zipFilePath);
    if (!zipStat.isFile()) {
      throw new Response("ZIP file not found", { status: 404 });
    }
    
    // Check if it's actually a ZIP file
    const fileName = path.basename(zipFilePath);
    if (!fileName.toLowerCase().endsWith('.zip')) {
      throw new Response("File is not a ZIP archive", { status: 400 });
    }
    
    // Create extraction directory (same directory as ZIP file, with ZIP name without extension)
    const zipDir = path.dirname(zipFilePath);
    const zipBaseName = path.basename(fileName, '.zip');
    const extractDir = path.join(zipDir, zipBaseName);
    
    // Create extraction directory if it doesn't exist
    await mkdir(extractDir, { recursive: true });
    
    // Extract ZIP file
    const readStream = createReadStream(zipFilePath);
    const extractStream = Extract({ path: extractDir });
    
    await pipeline(readStream, extractStream);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: "ZIP file extracted successfully",
      extractedTo: path.relative(resolvedRootFolder, extractDir)
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
    console.error('ZIP extraction error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: "Failed to extract ZIP file"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}