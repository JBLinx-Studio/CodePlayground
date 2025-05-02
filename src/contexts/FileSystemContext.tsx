
import React, { createContext, useContext, useState, useEffect } from 'react';
import { FileType } from '@/types/file';
import { toast } from 'sonner';

interface FilesState {
  [key: string]: FileType;
}

interface FileSystemContextProps {
  files: FilesState;
  currentFile: string;
  handleFileSelect: (filename: string) => void;
  handleAddFile: (filename: string, type: 'js' | 'html' | 'css' | 'other') => void;
  handleDeleteFile: (filename: string) => void;
  handleFileChange: (content: string) => void;
  handleRenameFile: (oldName: string, newName: string) => void;
  getCurrentFileType: () => string;
  getTagColorForFile: () => { color: string; bgColor: string };
  resetToDefaults: () => void;
  clearAll: () => void;
  copyCode: () => void;
  downloadCode: () => void;
}

// Default file content templates
const defaultHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Web App</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>Welcome to My Web App</h1>
      <p>Start coding in HTML, CSS, and JavaScript</p>
    </header>
    
    <div class="content">
      <div class="card">
        <h2>Getting Started</h2>
        <p>Edit the HTML, CSS and JavaScript files to build your application.</p>
        <button id="clickMe">Click Me!</button>
      </div>
    </div>
  </div>

  <script src="script.js"></script>
</body>
</html>`;

const defaultCssContent = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background: linear-gradient(to bottom right, #f5f7fa, #c3cfe2);
  height: 100vh;
  padding: 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

header {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #3182ce;
  margin-bottom: 10px;
}

.content {
  display: flex;
  justify-content: center;
}

.card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2b6cb0;
  margin-bottom: 15px;
}

p {
  margin-bottom: 20px;
}

button {
  background-color: #3182ce;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #2b6cb0;
}

@media (max-width: 768px) {
  .container {
    width: 95%;
  }
}`;

const defaultJsContent = `// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get the button element
  const button = document.getElementById('clickMe');
  
  // Add click event listener to the button
  button.addEventListener('click', function() {
    // Change button text
    this.textContent = 'Clicked!';
    
    // Change button color
    this.style.backgroundColor = '#48bb78';
    
    // Create a new element to show a message
    const message = document.createElement('p');
    message.textContent = 'You clicked the button!';
    message.style.marginTop = '20px';
    message.style.padding = '10px';
    message.style.backgroundColor = '#ebf8ff';
    message.style.borderRadius = '5px';
    
    // Add the message to the card
    document.querySelector('.card').appendChild(message);
    
    // Log to console for debugging
    console.log('Button was clicked at ' + new Date().toLocaleTimeString());
  });
  
  // Log that everything is loaded
  console.log('Application initialized successfully!');
});`;

// Initialize the default files
const defaultFiles: FilesState = {
  'index.html': {
    content: defaultHtmlContent,
    type: 'html',
  },
  'styles.css': {
    content: defaultCssContent,
    type: 'css',
  },
  'script.js': {
    content: defaultJsContent,
    type: 'js',
  },
};

const FileSystemContext = createContext<FileSystemContextProps | undefined>(undefined);

export const FileSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<FilesState>(() => {
    try {
      const savedFiles = localStorage.getItem('codePlayground_files');
      return savedFiles ? JSON.parse(savedFiles) : defaultFiles;
    } catch (e) {
      console.error("Could not load files from localStorage:", e);
      return defaultFiles;
    }
  });

  const [currentFile, setCurrentFile] = useState<string>(() => {
    try {
      const savedCurrentFile = localStorage.getItem('codePlayground_currentFile');
      return savedCurrentFile || 'index.html';
    } catch (e) {
      console.error("Could not load current file from localStorage:", e);
      return 'index.html';
    }
  });

  // Save files to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('codePlayground_files', JSON.stringify(files));
    } catch (e) {
      console.error("Could not save files to localStorage:", e);
    }
  }, [files]);

  // Save current file to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('codePlayground_currentFile', currentFile);
    } catch (e) {
      console.error("Could not save current file to localStorage:", e);
    }
  }, [currentFile]);

  const handleFileSelect = (filename: string) => {
    if (files[filename]) {
      setCurrentFile(filename);
    }
  };

  const handleAddFile = (filename: string, type: 'js' | 'html' | 'css' | 'other') => {
    if (files[filename]) {
      toast.error(`File ${filename} already exists`);
      return;
    }

    setFiles((prev) => ({
      ...prev,
      [filename]: {
        content: '',
        type,
      },
    }));
    
    setCurrentFile(filename);
    toast.success(`Created ${filename}`);
  };

  const handleDeleteFile = (filename: string) => {
    if (['index.html', 'styles.css', 'script.js'].includes(filename)) {
      toast.error("Cannot delete default files");
      return;
    }

    const newFiles = { ...files };
    delete newFiles[filename];
    setFiles(newFiles);

    if (currentFile === filename) {
      setCurrentFile('index.html');
    }
    
    toast.success(`Deleted ${filename}`);
  };

  const handleFileChange = (content: string) => {
    setFiles((prev) => ({
      ...prev,
      [currentFile]: {
        ...prev[currentFile],
        content,
      },
    }));
  };

  const handleRenameFile = (oldName: string, newName: string) => {
    if (['index.html', 'styles.css', 'script.js'].includes(oldName)) {
      toast.error("Cannot rename default files");
      return;
    }
    
    if (files[newName]) {
      toast.error(`File ${newName} already exists`);
      return;
    }
    
    // Get file extension to determine type
    const fileExtension = newName.split('.').pop() || '';
    let fileType: 'js' | 'html' | 'css' | 'other' = 'other';
    
    if (fileExtension === 'js') fileType = 'js';
    else if (fileExtension === 'html') fileType = 'html';
    else if (fileExtension === 'css') fileType = 'css';
    
    setFiles(prev => {
      const newFiles = { ...prev };
      const fileContent = newFiles[oldName].content;
      delete newFiles[oldName];
      
      return {
        ...newFiles,
        [newName]: {
          content: fileContent,
          type: fileType
        }
      };
    });
    
    if (currentFile === oldName) {
      setCurrentFile(newName);
    }
    
    toast.success(`Renamed ${oldName} to ${newName}`);
  };

  const getCurrentFileType = () => {
    const file = files[currentFile];
    if (!file) return 'js';
    return file.type;
  };

  const getTagColorForFile = () => {
    const fileType = getCurrentFileType();
    switch (fileType) {
      case 'html':
        return { color: '#E34C26', bgColor: 'rgba(227, 76, 38, 0.2)' };
      case 'css':
        return { color: '#264DE4', bgColor: 'rgba(38, 77, 228, 0.2)' };
      case 'js':
        return { color: '#F7DF1E', bgColor: 'rgba(247, 223, 30, 0.2)' };
      default:
        return { color: '#9CA3AF', bgColor: 'rgba(156, 163, 175, 0.2)' };
    }
  };

  const resetToDefaults = () => {
    setFiles(defaultFiles);
    setCurrentFile('index.html');
    toast.success("Reset to default files");
  };

  const clearAll = () => {
    const clearedFiles = {
      'index.html': { content: '', type: 'html' },
      'styles.css': { content: '', type: 'css' },
      'script.js': { content: '', type: 'js' }
    };
    
    setFiles(clearedFiles);
    setCurrentFile('index.html');
    toast.success("Cleared all files");
  };

  const copyCode = () => {
    const fileContent = files[currentFile]?.content || '';
    navigator.clipboard.writeText(fileContent)
      .then(() => toast.success("Code copied to clipboard"))
      .catch(() => toast.error("Failed to copy code"));
  };

  const downloadCode = () => {
    const fileContent = files[currentFile]?.content || '';
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Downloaded ${currentFile}`);
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
        handleRenameFile,
        getCurrentFileType,
        getTagColorForFile,
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
  if (context === undefined) {
    throw new Error('useFileSystem must be used within a FileSystemProvider');
  }
  return context;
};
