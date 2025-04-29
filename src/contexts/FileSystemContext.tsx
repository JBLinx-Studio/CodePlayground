import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { FileType } from "@/types/file";

// Default code templates
const defaultHTML = `<!-- Write your HTML here -->
<div class="container">
  <h1>Hello, World!</h1>
  <p>Welcome to CodePlayground</p>
</div>`;

const defaultCSS = `/* Write your CSS here */
.container {
  text-align: center;
  font-family: sans-serif;
  padding: 2rem;
}

h1 {
  color: #6366f1;
}`;

const defaultJS = `// Write your JavaScript here
console.log("CodePlayground is running!");`;

interface FileSystemContextProps {
  files: Record<string, FileType>;
  currentFile: string;
  handleFileSelect: (fileName: string) => void;
  handleFileChange: (content: string) => void;
  handleAddFile: (fileName: string, fileType: string) => boolean;
  handleDeleteFile: (fileName: string) => boolean;
  resetToDefaults: () => void;
  clearAll: () => void;
  copyCode: () => void;
  downloadCode: () => void;
  getCurrentFileType: () => string;
  getTagColorForFile: () => { color: string; bgColor: string };
}

const FileSystemContext = createContext<FileSystemContextProps | undefined>(undefined);

export const FileSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<Record<string, FileType>>({
    'index.html': { content: defaultHTML, type: 'html' },
    'styles.css': { content: defaultCSS, type: 'css' },
    'script.js': { content: defaultJS, type: 'js' }
  });
  const [currentFile, setCurrentFile] = useState('index.html');

  // Initialize with stored data
  useEffect(() => {
    const savedData = localStorage.getItem('codeplayground-data');
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.files) {
          setFiles(parsedData.files);
        } else {
          // Legacy format compatibility
          setFiles({
            'index.html': { content: parsedData.html || defaultHTML, type: 'html' },
            'styles.css': { content: parsedData.css || defaultCSS, type: 'css' },
            'script.js': { content: parsedData.js || defaultJS, type: 'js' }
          });
        }
        
        if (parsedData.currentFile) {
          setCurrentFile(parsedData.currentFile);
        }
      } catch (e) {
        console.error('Failed to load saved code:', e);
      }
    }
  }, []);

  // Save to localStorage when code changes
  useEffect(() => {
    saveToLocalStorage();
  }, [files, currentFile]);

  const saveToLocalStorage = () => {
    const codeData = { files, currentFile };
    localStorage.setItem('codeplayground-data', JSON.stringify(codeData));
  };

  const handleFileSelect = (fileName: string) => {
    setCurrentFile(fileName);
  };

  const handleFileChange = (content: string) => {
    setFiles(prev => ({
      ...prev,
      [currentFile]: {
        ...prev[currentFile],
        content
      }
    }));
  };

  const handleAddFile = (fileName: string, fileType: string) => {
    if (files[fileName]) {
      toast.error(`File ${fileName} already exists`);
      return false;
    }

    let content = '';
    if (fileType === 'html') {
      content = '<!-- Write your HTML here -->\n<div>\n  \n</div>';
    } else if (fileType === 'css') {
      content = '/* Write your CSS here */\n';
    } else if (fileType === 'js') {
      content = '// Write your JavaScript here\n';
    }

    setFiles(prev => ({
      ...prev,
      [fileName]: {
        content,
        type: fileType as 'html' | 'css' | 'js'
      }
    }));
    
    setCurrentFile(fileName);
    toast.success(`File ${fileName} created`);
    return true;
  };

  const handleDeleteFile = (fileName: string) => {
    if (fileName === 'index.html' || fileName === 'styles.css' || fileName === 'script.js') {
      toast.error("Cannot delete default files");
      return false;
    }
    
    const newFiles = { ...files };
    delete newFiles[fileName];
    setFiles(newFiles);
    
    if (currentFile === fileName) {
      setCurrentFile('index.html');
    }
    
    toast.success(`File ${fileName} deleted`);
    return true;
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset to defaults?')) {
      setFiles({
        'index.html': { content: defaultHTML, type: 'html' },
        'styles.css': { content: defaultCSS, type: 'css' },
        'script.js': { content: defaultJS, type: 'js' }
      });
      setCurrentFile('index.html');
      toast.success('Reset to defaults successfully');
    }
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all code?')) {
      const newFiles = { ...files };
      Object.keys(newFiles).forEach(key => {
        if (key === 'index.html') {
          newFiles[key] = { content: '<!-- Write your HTML here -->', type: 'html' };
        } else if (key === 'styles.css') {
          newFiles[key] = { content: '/* Write your CSS here */', type: 'css' };
        } else if (key === 'script.js') {
          newFiles[key] = { content: '// Write your JavaScript here', type: 'js' };
        } else {
          // Other files
          newFiles[key] = { content: '', type: newFiles[key].type };
        }
      });
      setFiles(newFiles);
      toast.success('All code cleared');
    }
  };

  const copyCode = () => {
    const allContent = Object.entries(files).map(([name, { content }]) => (
      `/* ${name} */\n${content}`
    )).join('\n\n');
    
    navigator.clipboard.writeText(allContent)
      .then(() => toast.success('Code copied to clipboard'))
      .catch(err => {
        console.error('Failed to copy:', err);
        toast.error('Failed to copy code');
      });
  };

  const downloadCode = () => {
    // Create HTML file with proper references
    let htmlContent = files['index.html']?.content || '';
    
    // Prepare HTML file for download
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodePlayground Project</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
${htmlContent}
<script src="script.js"></script>
</body>
</html>`;

    // Create Blob objects
    const htmlBlob = new Blob([fullHtml], { type: 'text/html' });
    const cssBlob = new Blob([files['styles.css']?.content || ''], { type: 'text/css' });
    const jsBlob = new Blob([files['script.js']?.content || ''], { type: 'text/javascript' });
    
    // Create download links
    const downloadFile = (blob: Blob, fileName: string) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
    
    // Download files
    downloadFile(htmlBlob, 'index.html');
    downloadFile(cssBlob, 'styles.css');
    downloadFile(jsBlob, 'script.js');
    
    // Download other files
    Object.entries(files).forEach(([name, { content }]) => {
      if (name !== 'index.html' && name !== 'styles.css' && name !== 'script.js') {
        downloadFile(new Blob([content], { type: 'text/plain' }), name);
      }
    });
    
    toast.success('Files downloaded');
  };

  const getCurrentFileType = () => {
    const file = files[currentFile];
    if (!file) return 'javascript';
    
    if (currentFile.endsWith('.html') || file.type === 'html') return 'html';
    if (currentFile.endsWith('.css') || file.type === 'css') return 'css';
    return 'javascript';
  };

  const getTagColorForFile = () => {
    const fileType = getCurrentFileType();
    
    switch (fileType) {
      case 'html':
        return {
          color: "#ef4444",
          bgColor: "rgba(239, 68, 68, 0.2)"
        };
      case 'css':
        return {
          color: "#3b82f6",
          bgColor: "rgba(59, 130, 246, 0.2)"
        };
      default:
        return {
          color: "#f59e0b",
          bgColor: "rgba(245, 158, 11, 0.2)"
        };
    }
  };

  return (
    <FileSystemContext.Provider
      value={{
        files,
        currentFile,
        handleFileSelect,
        handleFileChange,
        handleAddFile,
        handleDeleteFile,
        resetToDefaults,
        clearAll,
        copyCode,
        downloadCode,
        getCurrentFileType,
        getTagColorForFile,
      }}
    >
      {children}
    </FileSystemContext.Provider>
  );
};

export const useFileSystem = () => {
  const context = useContext(FileSystemContext);
  if (context === undefined) {
    throw new Error('useFileSystem must be used within a FileSystemProvider');
  }
  return context;
};
