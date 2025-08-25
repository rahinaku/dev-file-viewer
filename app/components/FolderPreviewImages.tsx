import { getFileApiEndpoint } from "~/lib/fileTypeUtils";

interface FolderPreviewImagesProps {
  images: string[];
}

export function FolderPreviewImages({ images }: FolderPreviewImagesProps) {
  return (
    <div className="grid grid-cols-2 gap-0.5 w-full h-full">
      {images.slice(0, 4).map((imagePath, index) => (
        <div
          key={index}
          className={`bg-cover bg-center ${
            images.length === 1 ? "col-span-2" :
            images.length === 3 && index === 0 ? "col-span-2" : ""
          }`}
          style={{
            backgroundImage: `url("${getFileApiEndpoint(imagePath)}?path=${encodeURIComponent(imagePath)}")`,
            minHeight: images.length === 1 ? "100%" : "50%"
          }}
        />
      ))}
    </div>
  );
}