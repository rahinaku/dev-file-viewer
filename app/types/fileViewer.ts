export interface FileItem {
  name: string;
  type: "file";
  relativePath: string;  // 相対パス（表示用）
  absolutePath: string;  // 絶対パス（内部処理用）
  isImage: boolean;
  isVideo: boolean;
  isAudio: boolean;
  isZip: boolean;
  modifiedDate: Date;    // ファイル更新日時
}

export interface FolderItem {
  name: string;
  type: "folder";
  relativePath: string;  // 相対パス（表示用）
  absolutePath: string;  // 絶対パス（内部処理用）
  previewImages: string[]; // 絶対パス（画像API用）
  modifiedDate: Date;    // フォルダ更新日時
}

export type DirectoryItem = FileItem | FolderItem;

export interface DirectoryData {
  currentRelativePath: string;  // 相対パス（表示用）
  currentAbsolutePath: string;  // 絶対パス（内部処理用）
  parentRelativePath: string;   // 相対パス（表示用）
  parentAbsolutePath: string;   // 絶対パス（内部処理用）
  items: DirectoryItem[];
  canGoUp: boolean;
}

export interface FileViewerServiceOptions {
  rootFolder?: string;
}