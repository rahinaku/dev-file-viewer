import type { Route } from "./+types/api.image";
import { serveFile } from "~/lib/fileServer";

const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];

function getImageContentType(ext: string): string {
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    case ".svg":
      return "image/svg+xml";
    default:
      return "image/jpeg";
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const thumbnail = url.searchParams.get("thumbnail");
  const preview = url.searchParams.get("preview");
  
  return serveFile(request, {
    allowedExtensions: imageExtensions,
    getContentType: getImageContentType,
    isPreview: thumbnail === "true" || preview === "true",
  });
}