
import React, { createContext, useContext, useState, useEffect } from 'react';
import { FileSystemType, FileType, FilesState } from '@/types/file';
import { toast } from 'sonner';
import { defaultFiles } from '@/utils/defaultFiles';

// Context type
export interface FileSystemContextType {
  files: Record<string, FileType>;
  currentFile: string;
  addFile: (fileName: string, fileType: string) => boolean;
  getFile: (fileName: string) => FileType | null;
  updateFile: (fileName: string, content: string) => boolean;
  deleteFile: (fileName: string) => boolean;
  getAllFiles: () => Array<{ name: string; type: string }>;
  handleFileSelect: (fileName: string) => void;
  handleAddFile: (fileName: string, fileType: string) => void;
  handleDeleteFile: (fileName: string) => void;
  handleFileChange: (content: string) => void;
  handleRenameFile: (oldName: string, newName: string) => boolean;
  getCurrentFileType: (fileName: string) => string;
  getTagColorForFile: (fileName: string) => { color: string; bgColor: string };
  resetToDefaults: () => void;
  clearAll: () => void;
  copyCode: () => void;
  downloadCode: () => void;
}

// Create context with default values
const FileSystemContext = createContext<FileSystemContextType>({
  files: {},
  currentFile: 'index.html',
  addFile: () => false,
  getFile: () => null,
  updateFile: () => false,
  deleteFile: () => false,
  getAllFiles: () => [],
  handleFileSelect: () => {},
  handleAddFile: () => {},
  handleDeleteFile: () => {},
  handleFileChange: () => {},
  handleRenameFile: () => false,
  getCurrentFileType: () => 'text',
  getTagColorForFile: () => ({ color: '#9ca3af', bgColor: 'rgba(156, 163, 175, 0.2)' }),
  resetToDefaults: () => {},
  clearAll: () => {},
  copyCode: () => {},
  downloadCode: () => {}
});

export const FileSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for files and current file
  const [files, setFiles] = useState<FilesState>({});
  const [currentFile, setCurrentFile] = useState<string>('index.html');

  // Initialize files on mount
  useEffect(() => {
    // Load default files if no files are present
    if (Object.keys(files).length === 0) {
      initializeFiles();
    }
  }, []);

  // Initialize with default files
  const initializeFiles = () => {
    setFiles(defaultFiles);
    setCurrentFile('index.html');
  };

  // Reset to default files
  const resetToDefaults = () => {
    setFiles(defaultFiles);
    setCurrentFile('index.html');
    toast.success('Reset to default files');
  };
  
  // Clear all files
  const clearAll = () => {
    setFiles({});
    setCurrentFile('');
    toast.success('Cleared all files');
  };
  
  // Copy all code
  const copyCode = () => {
    const allCode = Object.entries(files)
      .map(([name, file]) => `/* ${name} */\n${file.content}`)
      .join('\n\n');
    
    navigator.clipboard.writeText(allCode)
      .then(() => toast.success('All code copied to clipboard'))
      .catch(() => toast.error('Failed to copy code'));
  };
  
  // Download all code as zip
  const downloadCode = () => {
    // Simple download implementation
    const element = document.createElement('a');
    const fileContent = Object.entries(files)
      .map(([name, file]) => `/* ${name} */\n${file.content}`)
      .join('\n\n');
    
    const file = new Blob([fileContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'codeplayground-files.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Code downloaded');
  };

  // Add a new file
  const addFile = (fileName: string, fileType: string): boolean => {
    if (files[fileName]) {
      return false;
    }

    setFiles(prev => ({
      ...prev,
      [fileName]: {
        content: '',
        type: fileType as FileType['type']
      }
    }));
    
    return true;
  };

  // Get a file
  const getFile = (fileName: string): FileType | null => {
    return files[fileName] || null;
  };

  // Update a file's content
  const updateFile = (fileName: string, content: string): boolean => {
    if (!files[fileName]) {
      return false;
    }

    setFiles(prev => ({
      ...prev,
      [fileName]: {
        ...prev[fileName],
        content
      }
    }));
    
    return true;
  };

  // Delete a file
  const deleteFile = (fileName: string): boolean => {
    if (!files[fileName]) {
      return false;
    }

    const newFiles = { ...files };
    delete newFiles[fileName];
    
    setFiles(newFiles);
    
    // If the current file is deleted, select another file
    if (currentFile === fileName) {
      const nextFile = Object.keys(newFiles)[0];
      setCurrentFile(nextFile || '');
    }
    
    return true;
  };

  // Get all files
  const getAllFiles = (): Array<{ name: string; type: string }> => {
    return Object.entries(files).map(([name, file]) => ({
      name,
      type: file.type || 'other'
    }));
  };

  // Handler for file selection
  const handleFileSelect = (fileName: string): void => {
    setCurrentFile(fileName);
  };

  // Handler for adding a file
  const handleAddFile = (fileName: string, fileType: string): void => {
    if (addFile(fileName, fileType)) {
      setCurrentFile(fileName);
      toast.success(`File ${fileName} created`);
    } else {
      toast.error(`File ${fileName} already exists`);
    }
  };

  // Handler for deleting a file
  const handleDeleteFile = (fileName: string): void => {
    if (deleteFile(fileName)) {
      toast.success(`File ${fileName} deleted`);
    } else {
      toast.error(`Failed to delete ${fileName}`);
    }
  };

  // Handler for changing file content
  const handleFileChange = (content: string): void => {
    if (currentFile && updateFile(currentFile, content)) {
      // No toast for file changes as it would be too frequent
    }
  };

  // Handler for renaming a file
  const handleRenameFile = (oldName: string, newName: string): boolean => {
    if (!files[oldName] || files[newName]) {
      toast.error(`Cannot rename ${oldName} to ${newName}`);
      return false;
    }

    const fileContent = files[oldName].content;
    const fileType = files[oldName].type;
    
    const newFiles = { ...files };
    delete newFiles[oldName];
    
    newFiles[newName] = {
      content: fileContent,
      type: fileType
    };
    
    setFiles(newFiles);
    
    if (currentFile === oldName) {
      setCurrentFile(newName);
    }
    
    toast.success(`Renamed ${oldName} to ${newName}`);
    return true;
  };

  // Get file type from file name
  const getCurrentFileType = (fileName: string): string => {
    const ext = fileName.split('.').pop() || '';
    
    const fileTypeMap: Record<string, string> = {
      'html': 'html',
      'css': 'css',
      'js': 'js',
      'jsx': 'jsx',
      'ts': 'ts',
      'tsx': 'tsx',
      'json': 'json',
      'md': 'md',
      'svg': 'svg',
      'sql': 'sql',
      'yaml': 'yaml',
      'yml': 'yaml',
      'xml': 'xml'
    };
    
    return fileTypeMap[ext] || 'other';
  };

  // Get tag color for a file
  const getTagColorForFile = (fileName: string): { color: string; bgColor: string } => {
    const fileType = getCurrentFileType(fileName);
    
    const colorMap: Record<string, { color: string; bgColor: string }> = {
      'html': { color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.2)' },
      'css': { color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.2)' },
      'js': { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.2)' },
      'jsx': { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.2)' },
      'ts': { color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.2)' },
      'tsx': { color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.2)' },
      'json': { color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.2)' },
      'md': { color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.2)' },
      'svg': { color: '#f97316', bgColor: 'rgba(249, 115, 22, 0.2)' },
      'sql': { color: '#6366f1', bgColor: 'rgba(99, 102, 241, 0.2)' },
      'yaml': { color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.2)' },
      'xml': { color: '#14b8a6', bgColor: 'rgba(20, 184, 166, 0.2)' }
    };
    
    return colorMap[fileType] || { color: '#9ca3af', bgColor: 'rgba(156, 163, 175, 0.2)' };
  };

  const value = {
    files,
    currentFile,
    addFile,
    getFile,
    updateFile,
    deleteFile,
    getAllFiles,
    handleFileSelect,
    handleAddFile,
    handleDeleteFile,
    handleFileChange,
    handleRenameFile,
    getCurrentFileType,
    getTagColorForFile,
    resetToDefaults,
    clearAll,
    copyCode,
    downloadCode
  };

  return (
    <FileSystemContext.Provider value={value}>
      {children}
    </FileSystemContext.Provider>
  );
};

export const useFileSystem = (): FileSystemContextType => useContext(FileSystemContext);
