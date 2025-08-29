// クライアントサイドで使用される型（絶対パス情報を除外）
export interface ClientFileItem {
  name: string;
  type: "file";
  path: string;  // 相対パス
  isImage: boolean;
  isVideo: boolean;
  isAudio: boolean;
  isZip: boolean;
  modifiedDate: string;  // ISO形式の日時文字列
}

export interface ClientFolderItem {
  name: string;
  type: "folder";
  path: string;  // 相対パス
  previewImages: string[];  // 相対パス
  modifiedDate: string;  // ISO形式の日時文字列
}

export type ClientDirectoryItem = ClientFileItem | ClientFolderItem;

export interface ClientDirectoryData {
  currentPath: string;  // 相対パス
  parentPath: string;   // 相対パス
  items: ClientDirectoryItem[];
  canGoUp: boolean;
}

export interface PaginatedClientDirectoryData extends ClientDirectoryData {
  hasMore: boolean;
  total: number;
  offset: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
