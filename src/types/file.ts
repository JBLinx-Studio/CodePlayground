
export interface FileType {
  content: string;
  type: 'html' | 'css' | 'js' | 'other';
}

export interface FileSystemType {
  files: Record<string, FileType>;
  currentFile: string;
  addFile: (fileName: string, fileType: string) => boolean;
  getFile: (fileName: string) => FileType | null;
  updateFile: (fileName: string, content: string) => boolean;
  deleteFile: (fileName: string) => boolean;
  getAllFiles: () => Array<{ name: string; type: string }>;
}

export type FilesState = Record<string, FileType>;
