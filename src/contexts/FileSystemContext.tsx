import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultFiles } from '@/utils/defaultFiles';
import { initializeDefaultFiles } from '@/utils/fileInitializer';

interface File {
  content: string;
}

interface FileSystemContextType {
  files: Record<string, File>;
  currentFile: string;
  handleFileSelect: (fileName: string) => void;
  handleAddFile: (fileName: string) => void;
  handleDeleteFile: (fileName: string) => void;
  handleFileChange: (content: string) => void;
  handleRenameFile: (oldName: string, newName: string) => void;
  getCurrentFileType: (fileName: string) => string;
  getTagColorForFile: (fileName: string) => { color: string; bgColor: string };
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined);

export const FileSystemProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Initialize with default files if no files exist
  const [files, setFiles] = useState<Record<string, File>>({});
  const [currentFile, setCurrentFile] = useState<string>('index.html');
  
  // Initialize default files when the component first mounts
  useEffect(() => {
    setFiles(prevFiles => initializeDefaultFiles(prevFiles));
  }, []);

  // If we don't have any files and currentFile doesn't exist,
  // set currentFile to the first available file
  useEffect(() => {
    const fileNames = Object.keys(files);
    if (fileNames.length > 0 && !files[currentFile]) {
      setCurrentFile(fileNames[0]);
    }
  }, [files, currentFile]);

  const handleFileSelect = (fileName: string) => {
    setCurrentFile(fileName);
  };

  const handleAddFile = (fileName: string) => {
    if (files[fileName]) {
      // Simple alert, can be replaced with a more sophisticated UI notification
      alert('File already exists!');
      return;
    }
    setFiles(prevFiles => ({ ...prevFiles, [fileName]: { content: '' } }));
    setCurrentFile(fileName);
  };

  const handleDeleteFile = (fileName: string) => {
    const newFiles = { ...files };
    delete newFiles[fileName];
    setFiles(newFiles);
    
    // If the deleted file was the current file, switch to another file or none
    if (currentFile === fileName) {
      const remainingFiles = Object.keys(newFiles);
      setCurrentFile(remainingFiles.length > 0 ? remainingFiles[0] : '');
    }
  };

  const handleFileChange = (content: string) => {
    setFiles(prevFiles => ({
      ...prevFiles,
      [currentFile]: { content },
    }));
  };

  const handleRenameFile = (oldName: string, newName: string) => {
    if (files[newName]) {
      alert('File already exists!');
      return;
    }

    setFiles(prevFiles => {
      const newFiles = { ...prevFiles };
      if (newFiles[oldName]) {
        newFiles[newName] = newFiles[oldName];
        delete newFiles[oldName];
      }
      return newFiles;
    });

    setCurrentFile(newName);
  };

  const getCurrentFileType = (fileName: string): string => {
    const parts = fileName.split('.');
    if (parts.length === 1) return 'txt'; // Default to plain text if no extension
    return parts.pop()?.toLowerCase() || 'txt';
  };

  const getTagColorForFile = (fileName: string) => {
    const fileType = getCurrentFileType(fileName);
    switch (fileType) {
      case 'js':
        return { color: '#f7df1e', bgColor: '#323330' };
      case 'ts':
      case 'tsx':
        return { color: '#007acc', bgColor: '#2d3748' };
      case 'html':
        return { color: '#e34c26', bgColor: '#f0f0f0' };
      case 'css':
        return { color: '#2965f1', bgColor: '#f0f0f0' };
      case 'json':
        return { color: '#f0ad4e', bgColor: '#2d3748' };
      case 'svg':
        return { color: '#e34c26', bgColor: '#f0f0f0' };
      case 'md':
        return { color: '#9a6744', bgColor: '#f0f0f0' };
      case 'yaml':
      case 'yml':
        return { color: '#cb171e', bgColor: '#f0f0f0' };
      case 'xml':
        return { color: '#f0ad4e', bgColor: '#2d3748' };
      case 'sql':
        return { color: '#33691e', bgColor: '#e8f5e9' };
      case 'txt':
      default:
        return { color: '#9ca3af', bgColor: '#1f2937' };
    }
  };
  
  const contextValue = {
    files,
    currentFile,
    handleFileSelect,
    handleAddFile,
    handleDeleteFile,
    handleFileChange,
    handleRenameFile,
    getCurrentFileType,
    getTagColorForFile
  };

  return (
    <FileSystemContext.Provider value={contextValue}>
      {children}
    </FileSystemContext.Provider>
  );
};

export const useFileSystem = () => {
  const context = useContext(FileSystemContext);
  if (!context) {
    throw new Error('useFileSystem must be used within a FileSystemProvider');
  }
  return context;
};
