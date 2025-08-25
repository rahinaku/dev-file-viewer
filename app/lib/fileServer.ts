import * as fs from "node:fs";
import * as path from "node:path";
import { config } from "dotenv";

config();

interface FileServerOptions {
  allowedExtensions: string[];
  getContentType: (ext: string) => string;
}

export async function serveFile(request: Request, options: FileServerOptions) {
  const url = new URL(request.url);
  const relativeFilePath = url.searchParams.get("path");
  
  if (!relativeFilePath) {
    throw new Response("File path is required", { status: 400 });
  }

  try {
    const rootFolder = process.env.ROOT_FOLDER || process.cwd();
    const resolvedRootFolder = path.resolve(rootFolder);
    
    const absoluteFilePath = path.resolve(resolvedRootFolder, relativeFilePath.startsWith("/") ? relativeFilePath.slice(1) : relativeFilePath);
    
    if (process.env.NODE_ENV === 'development') {
      console.log("File request:", { 
        relativeFilePath, 
        absoluteFilePath,
        rootFolder: resolvedRootFolder
      });
    }
    
    if (!absoluteFilePath.startsWith(resolvedRootFolder)) {
      console.error("Security check failed:", {
        absoluteFilePath,
        resolvedRootFolder,
        startsWithResult: absoluteFilePath.startsWith(resolvedRootFolder)
      });
      throw new Response("Access denied", { status: 403 });
    }

    const stats = await fs.promises.stat(absoluteFilePath);
    if (!stats.isFile()) {
      throw new Response("Not a file", { status: 404 });
    }

    const ext = path.extname(absoluteFilePath).toLowerCase();
    
    if (!options.allowedExtensions.includes(ext)) {
      throw new Response("File type not supported", { status: 415 });
    }

    const contentType = options.getContentType(ext);
    const fileBuffer = await fs.promises.readFile(absoluteFilePath);
    
    return new Response(new Uint8Array(fileBuffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("File server error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Response(`File not found: ${errorMessage}`, { status: 404 });
  }
}