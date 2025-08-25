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
        rootFolder: resolvedRootFolder,
        rangeHeader: request.headers.get('range')
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
    const fileSize = stats.size;
    
    // Handle Range requests for media files
    const rangeHeader = request.headers.get('range');
    
    if (rangeHeader) {
      const ranges = parseRange(fileSize, rangeHeader);
      
      if (ranges && ranges.length === 1) {
        const [{ start, end }] = ranges;
        const chunkSize = (end - start) + 1;
        
        const stream = fs.createReadStream(absoluteFilePath, { start, end });
        const chunks: Uint8Array[] = [];
        
        for await (const chunk of stream) {
          chunks.push(new Uint8Array(chunk));
        }
        
        const buffer = new Uint8Array(chunkSize);
        let offset = 0;
        for (const chunk of chunks) {
          buffer.set(chunk, offset);
          offset += chunk.length;
        }
        
        return new Response(buffer, {
          status: 206,
          headers: {
            "Content-Type": contentType,
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunkSize.toString(),
            "Cache-Control": "public, max-age=3600",
          },
        });
      }
    }
    
    // Full file response
    const fileBuffer = await fs.promises.readFile(absoluteFilePath);
    
    return new Response(new Uint8Array(fileBuffer), {
      headers: {
        "Content-Type": contentType,
        "Content-Length": fileSize.toString(),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("File server error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Response(`File not found: ${errorMessage}`, { status: 404 });
  }
}

// Simple range parser
function parseRange(size: number, rangeHeader: string) {
  const ranges = [];
  const rangeParts = rangeHeader.replace(/bytes=/, '').split(',');
  
  for (const rangePart of rangeParts) {
    const [startStr, endStr] = rangePart.trim().split('-');
    let start = parseInt(startStr, 10);
    let end = parseInt(endStr, 10);
    
    if (isNaN(start)) start = size - end;
    if (isNaN(end)) end = size - 1;
    
    if (start >= 0 && end < size && start <= end) {
      ranges.push({ start, end });
    }
  }
  
  return ranges.length > 0 ? ranges : null;
}