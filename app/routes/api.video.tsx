import type { Route } from "./+types/api.video";
import { serveFile } from "~/lib/fileServer";

const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"];

function getVideoContentType(ext: string): string {
  switch (ext) {
    case ".mp4":
      return "video/mp4";
    case ".webm":
      return "video/webm";
    case ".ogg":
      return "video/ogg";
    case ".mov":
      return "video/quicktime";
    case ".avi":
      return "video/x-msvideo";
    case ".mkv":
      return "video/x-matroska";
    default:
      return "video/mp4";
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  return serveFile(request, {
    allowedExtensions: videoExtensions,
    getContentType: getVideoContentType,
  });
}