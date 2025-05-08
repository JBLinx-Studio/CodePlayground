import React, { createContext, useState, useContext, useEffect } from 'react';
import { FileType, FilesState } from '@/types/file';
import { toast } from 'sonner';

interface FileSystemContextProps {
  files: Record<string, FileType>;
  currentFile: string;
  handleFileSelect: (fileName: string) => void;
  handleAddFile: (fileName: string, fileType: string) => void;
  handleDeleteFile: (fileName: string) => void;
  handleFileChange: (content: string) => void;
  getCurrentFileType: (fileName?: string) => string;
  getTagColorForFile: (fileName?: string) => { color: string; bgColor: string };
  handleRenameFile: (oldName: string, newName: string) => void;
  resetToDefaults: () => void;
  clearAll: () => void;
  copyCode: () => void;
  downloadCode: () => void;
}

// Default HTML content
const defaultHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Code Playground</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>Welcome to Code Playground</h1>
    <p>Edit the files to start coding!</p>
    <button id="clickMe">Click Me!</button>
  </div>

  <script src="script.js"></script>
</body>
</html>`;

// Default CSS content
const defaultCss = `/* Basic Styles */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  margin: 0;
  padding: 20px;
  background: linear-gradient(to right, #f5f7fa, #c3cfe2);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  color: #4a5568;
}

button {
  background-color: #4c51bf;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #6366f1;
}`;

// Default JS content
const defaultJs = `// JavaScript code
document.addEventListener('DOMContentLoaded', () => {
  console.log('Document is ready!');
  
  // Get the button element
  const button = document.getElementById('clickMe');
  
  // Add a click event listener
  button.addEventListener('click', () => {
    alert('Button clicked! Add your code here.');
    
    // Change button text
    button.textContent = 'Clicked!';
    
    // Add a new element
    const newElement = document.createElement('p');
    newElement.textContent = 'You clicked the button!';
    document.querySelector('.container').appendChild(newElement);
  });
})`;

const FileSystemContext = createContext<FileSystemContextProps | undefined>(undefined);

export const FileSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get saved files or use default files
  const getSavedFiles = (): FilesState => {
    try {
      const savedFiles = localStorage.getItem('codePlayground_files');
      if (savedFiles) {
        return JSON.parse(savedFiles);
      }
    } catch (e) {
      console.error('Error loading saved files:', e);
    }
    
    // Return default files if no saved files exist
    return {
      'index.html': { content: defaultHtml, type: 'html' as const },
      'styles.css': { content: defaultCss, type: 'css' as const },
      'script.js': { content: defaultJs, type: 'js' as const }
    };
  };

  // Get saved current file or default to index.html
  const getSavedCurrentFile = (): string => {
    try {
      const savedCurrentFile = localStorage.getItem('codePlayground_currentFile');
      if (savedCurrentFile) {
        return savedCurrentFile;
      }
    } catch (e) {
      console.error('Error loading saved current file:', e);
    }
    
    return 'index.html';
  };

  const [files, setFiles] = useState<FilesState>(getSavedFiles());
  const [currentFile, setCurrentFile] = useState<string>(getSavedCurrentFile());

  // Save files to localStorage when files change
  useEffect(() => {
    try {
      localStorage.setItem('codePlayground_files', JSON.stringify(files));
    } catch (e) {
      console.error('Error saving files:', e);
    }
  }, [files]);

  // Save current file to localStorage when currentFile changes
  useEffect(() => {
    try {
      localStorage.setItem('codePlayground_currentFile', currentFile);
    } catch (e) {
      console.error('Error saving current file:', e);
    }
  }, [currentFile]);

  // Get the file type based on a filename
  const getFileType = (fileName: string): string => {
    const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
    if (fileExt === 'html') return 'html';
    if (fileExt === 'css') return 'css';
    if (fileExt === 'js') return 'js';
    return 'other';
  };

  // Get the file type of a specific file or the current file
  const getCurrentFileType = (fileName: string = currentFile) => {
    if (!files[fileName]) return 'js';
    return getFileType(fileName);
  };

  // Get tag color for a specific file or the current file
  const getTagColorForFile = (fileName: string = currentFile) => {
    const type = getCurrentFileType(fileName);
    switch (type) {
      case 'html':
        return {
          color: '#ef4444',
          bgColor: 'rgba(239, 68, 68, 0.2)'
        };
      case 'css':
        return {
          color: '#3b82f6',
          bgColor: 'rgba(59, 130, 246, 0.2)'
        };
      case 'js':
      default:
        return {
          color: '#f59e0b',
          bgColor: 'rgba(245, 158, 11, 0.2)'
        };
    }
  };

  // Handle selecting a file
  const handleFileSelect = (fileName: string) => {
    setCurrentFile(fileName);
  };

  // Handle adding a new file
  const handleAddFile = (fileName: string, fileType: string) => {
    // Check if file already exists
    if (files[fileName]) {
      toast.error(`File "${fileName}" already exists`);
      return;
    }

    // Create empty content based on file type
    let content = '';
    let type: FileType['type'] = 'other';
    
    switch (fileType) {
      case 'html':
        content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fileName}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>${fileName}</h1>
  
  <script src="script.js"></script>
</body>
</html>`;
        type = 'html';
        break;
      case 'css':
        content = `/* Styles for ${fileName} */
body {
  font-family: sans-serif;
  padding: 20px;
}

h1 {
  color: #4a5568;
}`;
        type = 'css';
        break;
      case 'js':
        content = `// ${fileName}
console.log('${fileName} loaded');

// Your code here
function init() {
  console.log('Initialization');
}

document.addEventListener('DOMContentLoaded', init);`;
        type = 'js';
        break;
      default:
        content = '';
        type = 'other';
    }

    // Add the new file
    setFiles(prev => ({
      ...prev,
      [fileName]: { content, type }
    }));

    // Select the new file
    setCurrentFile(fileName);
  };

  // Handle deleting a file
  const handleDeleteFile = (fileName: string) => {
    // Don't allow deleting default files
    if (fileName === 'index.html' || fileName === 'styles.css' || fileName === 'script.js') {
      toast.error("Can't delete default files");
      return;
    }

    // Create a new files object without the deleted file
    const newFiles = { ...files };
    delete newFiles[fileName];
    setFiles(newFiles);

    // If the current file was deleted, select index.html
    if (currentFile === fileName) {
      setCurrentFile('index.html');
    }
  };

  // Handle changing file content
  const handleFileChange = (content: string) => {
    setFiles(prev => ({
      ...prev,
      [currentFile]: { ...prev[currentFile], content }
    }));
  };

  // Handle renaming a file
  const handleRenameFile = (oldName: string, newName: string) => {
    // Don't allow renaming default files
    if (oldName === 'index.html' || oldName === 'styles.css' || oldName === 'script.js') {
      toast.error("Can't rename default files");
      return;
    }

    // Check if the new name already exists
    if (files[newName]) {
      toast.error(`File "${newName}" already exists`);
      return;
    }

    // Create a new files object with the renamed file
    const newFiles = { ...files };
    newFiles[newName] = newFiles[oldName];
    delete newFiles[oldName];
    setFiles(newFiles);

    // If the current file was renamed, select the new name
    if (currentFile === oldName) {
      setCurrentFile(newName);
    }
  };

  // Reset to default files
  const resetToDefaults = () => {
    const defaultFiles = {
      'index.html': { content: defaultHtml, type: 'html' as const },
      'styles.css': { content: defaultCss, type: 'css' as const },
      'script.js': { content: defaultJs, type: 'js' as const }
    };
    
    setFiles(defaultFiles);
    setCurrentFile('index.html');
    toast.success("Reset to default files");
  };

  // Clear all files except defaults
  const clearAll = () => {
    // Keep only default files
    const newFiles = { ...files };
    Object.keys(newFiles).forEach(fileName => {
      if (!['index.html', 'styles.css', 'script.js'].includes(fileName)) {
        delete newFiles[fileName];
      }
    });

    setFiles(newFiles);
    setCurrentFile('index.html');
    toast.success("Cleared all custom files");
  };

  // Copy current file to clipboard
  const copyCode = () => {
    if (files[currentFile]) {
      navigator.clipboard.writeText(files[currentFile].content)
        .then(() => {
          toast.success("Code copied to clipboard");
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          toast.error("Failed to copy code");
        });
    }
  };

  // Download all files as zip
  const downloadCode = () => {
    // Simple implementation to download current file
    const fileName = currentFile;
    const content = files[currentFile]?.content || '';
    
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast.success(`Downloaded ${fileName}`);
  };

  return (
    <FileSystemContext.Provider
      value={{
        files,
        currentFile,
        handleFileSelect,
        handleAddFile,
        handleDeleteFile,
        handleFileChange,
        getCurrentFileType,
        getTagColorForFile,
        handleRenameFile,
        resetToDefaults,
        clearAll,
        copyCode,
        downloadCode
      }}
    >
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
