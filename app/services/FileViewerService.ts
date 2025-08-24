import * as fs from "node:fs";
import * as path from "node:path";
import { config } from "dotenv";
import type { 
  DirectoryData, 
  DirectoryItem, 
  FileItem, 
  FolderItem, 
  FileViewerServiceOptions 
} from "../types/fileViewer";

// .envファイルを読み込み
config();

export class FileViewerService {
  private readonly rootFolder: string;
  private readonly imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
  private readonly videoExtensions = /\.(mp4|webm|ogg|mov|avi|mkv)$/i;
  private readonly audioExtensions = /\.(mp3|wav|ogg|aac|flac|m4a)$/i;
  private readonly zipExtensions = /\.(zip)$/i;

  constructor(options: FileViewerServiceOptions = {}) {
    this.rootFolder = options.rootFolder || process.env.ROOT_FOLDER || process.cwd();
  }

  async getDirectoryData(requestedRelativePath?: string): Promise<DirectoryData> {
    const resolvedRootFolder = path.resolve(this.rootFolder);
    
    // 相対パスから絶対パスに変換
    let currentAbsolutePath: string;
    if (requestedRelativePath) {
      // 先頭のスラッシュを除去して、正しい相対パスとして扱う
      const normalizedRelativePath = requestedRelativePath.startsWith('/') 
        ? requestedRelativePath.slice(1) 
        : requestedRelativePath;
      currentAbsolutePath = path.resolve(resolvedRootFolder, normalizedRelativePath);
    } else {
      currentAbsolutePath = resolvedRootFolder;
    }
    
    try {
      await this.validateDirectory(currentAbsolutePath);
      await this.validatePathWithinRoot(currentAbsolutePath);
      const items = await this.readDirectoryItems(currentAbsolutePath);
      
      const parentAbsolutePath = path.dirname(currentAbsolutePath);
      const resolvedCurrentPath = path.resolve(currentAbsolutePath);
      const resolvedParentPath = path.resolve(parentAbsolutePath);
      
      // 相対パスに変換
      const currentRelativePath = this.getRelativePath(resolvedCurrentPath);
      const parentRelativePath = this.getRelativePath(resolvedParentPath);
      
      // ROOT_FOLDERより上に行けないかチェック
      const canGoUp = resolvedCurrentPath !== resolvedRootFolder && 
                      resolvedParentPath.startsWith(resolvedRootFolder) &&
                      resolvedCurrentPath !== path.parse(resolvedCurrentPath).root;
      
      return {
        currentRelativePath,
        currentAbsolutePath,
        parentRelativePath,
        parentAbsolutePath,
        items: await this.processDirectoryItems(items, currentAbsolutePath),
        canGoUp
      };
    } catch (error) {
      throw new Error("Directory not found");
    }
  }

  private async validateDirectory(directoryPath: string): Promise<void> {
    const stats = await fs.promises.stat(directoryPath);
    if (!stats.isDirectory()) {
      throw new Error("Path is not a directory");
    }
  }

  private async validatePathWithinRoot(directoryPath: string): Promise<void> {
    const resolvedPath = path.resolve(directoryPath);
    const resolvedRootFolder = path.resolve(this.rootFolder);
    
    if (!resolvedPath.startsWith(resolvedRootFolder)) {
      throw new Error("Access denied: Path is outside root folder");
    }
  }

  private async readDirectoryItems(directoryPath: string): Promise<fs.Dirent[]> {
    return await fs.promises.readdir(directoryPath, { withFileTypes: true });
  }

  private async processDirectoryItems(
    items: fs.Dirent[], 
    currentPath: string
  ): Promise<DirectoryItem[]> {
    const folders: FolderItem[] = [];
    const files: FileItem[] = [];

    for (const item of items) {
      const itemPath = path.join(currentPath, item.name);
      
      if (item.isDirectory()) {
        const folderItem = await this.createFolderItem(item.name, itemPath);
        folders.push(folderItem);
      } else {
        const fileItem = this.createFileItem(item.name, itemPath);
        files.push(fileItem);
      }
    }

    return [...folders, ...files];
  }

  private async createFolderItem(name: string, itemPath: string): Promise<FolderItem> {
    const previewImagesAbsolute = await this.getFolderPreviewImages(itemPath);
    const previewImages = previewImagesAbsolute.map(imagePath => this.getRelativePath(imagePath));
    
    return {
      name,
      type: "folder",
      relativePath: this.getRelativePath(itemPath),
      absolutePath: itemPath,
      previewImages
    };
  }

  private createFileItem(name: string, itemPath: string): FileItem {
    return {
      name,
      type: "file",
      relativePath: this.getRelativePath(itemPath),
      absolutePath: itemPath,
      isImage: this.imageExtensions.test(name),
      isVideo: this.videoExtensions.test(name),
      isAudio: this.audioExtensions.test(name),
      isZip: this.zipExtensions.test(name)
    };
  }

  private getRelativePath(absolutePath: string): string {
    const resolvedRootFolder = path.resolve(this.rootFolder);
    const resolvedPath = path.resolve(absolutePath);
    
    // ROOT_FOLDERと同じ場合は "/"
    if (resolvedPath === resolvedRootFolder) {
      return "/";
    }
    
    // ROOT_FOLDERからの相対パスを計算
    const relativePath = path.relative(resolvedRootFolder, resolvedPath);
    return "/" + relativePath.replace(/\\/g, "/"); // Windowsパス区切り文字を正規化
  }

  private async getFolderPreviewImages(folderPath: string): Promise<string[]> {
    try {
      const folderContents = await fs.promises.readdir(folderPath, { withFileTypes: true });
      
      return folderContents
        .filter(file => file.isFile() && this.imageExtensions.test(file.name))
        .slice(0, 4)
        .map(file => path.join(folderPath, file.name));
    } catch {
      return [];
    }
  }

  isImageFile(fileName: string): boolean {
    return this.imageExtensions.test(fileName);
  }

  isVideoFile(fileName: string): boolean {
    return this.videoExtensions.test(fileName);
  }

  isAudioFile(fileName: string): boolean {
    return this.audioExtensions.test(fileName);
  }

  isZipFile(fileName: string): boolean {
    return this.zipExtensions.test(fileName);
  }
}