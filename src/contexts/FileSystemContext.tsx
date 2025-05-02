
import React, { createContext, useState, useContext, useEffect } from 'react';
import { FileType } from '@/types/file';
import { toast } from 'sonner';

interface FileSystemContextProps {
  files: Record<string, FileType>;
  currentFile: string;
  handleFileSelect: (fileName: string) => void;
  handleAddFile: (fileName: string, fileType: string) => void;
  handleDeleteFile: (fileName: string) => void;
  handleFileChange: (content: string) => void;
  getCurrentFileType: () => string;
  getTagColorForFile: () => { color: string; bgColor: string };
  handleRenameFile: (oldName: string, newName: string) => void;
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
  const getSavedFiles = (): Record<string, FileType> => {
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
      'index.html': { content: defaultHtml, type: 'html' },
      'styles.css': { content: defaultCss, type: 'css' },
      'script.js': { content: defaultJs, type: 'js' }
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

  const [files, setFiles] = useState<Record<string, FileType>>(getSavedFiles());
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
        break;
      case 'js':
        content = `// ${fileName}
console.log('${fileName} loaded');

// Your code here
function init() {
  console.log('Initialization');
}

document.addEventListener('DOMContentLoaded', init);`;
        break;
      default:
        content = '';
    }

    // Add the new file
    setFiles(prev => ({
      ...prev,
      [fileName]: { content, type: fileType }
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

  // Get the file type of the current file
  const getCurrentFileType = () => {
    if (!files[currentFile]) return 'js';
    
    const fileName = currentFile.toLowerCase();
    if (fileName.endsWith('.html')) return 'html';
    if (fileName.endsWith('.css')) return 'css';
    if (fileName.endsWith('.js')) return 'js';
    return 'js';
  };

  // Get tag color for file based on type
  const getTagColorForFile = () => {
    const type = getCurrentFileType();
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
        handleRenameFile
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
