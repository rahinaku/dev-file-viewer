// クライアントサイドで使用される型（絶対パス情報を除外）
export interface ClientFileItem {
  name: string;
  type: "file";
  path: string;  // 相対パス
  isImage: boolean;
  isVideo: boolean;
  isAudio: boolean;
}

export interface ClientFolderItem {
  name: string;
  type: "folder";
  path: string;  // 相対パス
  previewImages: string[];  // 相対パス
}

export type ClientDirectoryItem = ClientFileItem | ClientFolderItem;

export interface ClientDirectoryData {
  currentPath: string;  // 相対パス
  parentPath: string;   // 相対パス
  items: ClientDirectoryItem[];
  canGoUp: boolean;
}