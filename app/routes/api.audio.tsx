import type { Route } from "./+types/api.audio";
import { serveFile } from "~/lib/fileServer";

const audioExtensions = [".mp3", ".wav", ".aac", ".flac", ".m4a", ".ogg"];

function getAudioContentType(ext: string): string {
  switch (ext) {
    case ".mp3":
      return "audio/mpeg";
    case ".wav":
      return "audio/wav";
    case ".aac":
      return "audio/aac";
    case ".flac":
      return "audio/flac";
    case ".m4a":
      return "audio/mp4";
    case ".ogg":
      return "audio/ogg";
    default:
      return "audio/mpeg";
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  return serveFile(request, {
    allowedExtensions: audioExtensions,
    getContentType: getAudioContentType,
  });
}