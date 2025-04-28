import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/CodeEditor";
import { PreviewPanel } from "@/components/PreviewPanel";
import { FileExplorer } from "@/components/FileExplorer";
import { AIAssistant } from "@/components/AiAssistant";
import { GitHubIntegration } from "@/components/GitHubIntegration";
import { AdvancedSettings } from "@/components/AdvancedSettings";
import { FileType } from "@/types/file";
import { 
  Github, 
  RefreshCw, 
  Trash2, 
  Code, 
  Download, 
  Copy, 
  Maximize, 
  Minimize,
  Settings,
  Layout,
  Monitor,
  Columns
} from "lucide-react";
import { toast } from "sonner";

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

const Index = () => {
  // State for file management
  const [files, setFiles] = useState<Record<string, FileType>>({
    'index.html': { content: defaultHTML, type: 'html' },
    'styles.css': { content: defaultCSS, type: 'css' },
    'script.js': { content: defaultJS, type: 'js' }
  });
  const [currentFile, setCurrentFile] = useState('index.html');
  
  // State for editor layout
  const [panelWidth, setPanelWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [view, setView] = useState<'split' | 'editor' | 'preview'>('split');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  
  // Advanced settings
  const [settings, setSettings] = useState({
    fontSize: '14px',
    tabSize: 2,
    autoUpdate: true,
    theme: 'dark',
    showLineNumbers: true,
    autoCloseBrackets: true,
    wordWrap: false,
    highlightActiveLine: true,
    keymap: 'default'
  });

  // Refs for resizing
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize with stored data
  useEffect(() => {
    const savedData = localStorage.getItem('codeplayground-data');
    const savedSettings = localStorage.getItem('codeplayground-settings');
    
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
        resetToDefaults();
      }
    }
    
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }, []);

  // Save to localStorage when code or settings change
  useEffect(() => {
    saveToLocalStorage();
  }, [files, currentFile]);

  useEffect(() => {
    localStorage.setItem('codeplayground-settings', JSON.stringify(settings));
  }, [settings]);

  // Handle resize events
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const newWidth = startWidthRef.current + (e.clientX - startXRef.current);
      const widthPercentage = (newWidth / containerWidth) * 100;
      
      // Limit min/max width
      if (widthPercentage >= 20 && widthPercentage <= 80) {
        setPanelWidth(widthPercentage);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        // Mobile layout
        document.body.classList.add('mobile-layout');
      } else {
        // Desktop layout
        document.body.classList.remove('mobile-layout');
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const startResize = (e: React.MouseEvent) => {
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = containerRef.current ? containerRef.current.offsetWidth * (panelWidth / 100) : 0;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
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

  const saveToLocalStorage = () => {
    const codeData = { files, currentFile };
    localStorage.setItem('codeplayground-data', JSON.stringify(codeData));
  };

  // File management functions
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

  const insertCodeFromAI = (code: string) => {
    handleFileChange(files[currentFile].content + '\n' + code);
    toast.success('Code inserted');
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    }
  };

  // Determine current file type for the editor
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

  // Get the extension without the dot
  const getFileExtension = (filename: string) => {
    return filename.split('.').pop() || '';
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#1a1f2c] text-[#e4e5e7]">
      {/* Header */}
      <header className="bg-[#151922] border-b border-[#374151] px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="text-[#6366f1]">
            <Code size={24} />
          </div>
          <h1 className="text-xl font-semibold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
            CodePlayground
          </h1>
        </div>
        
        <div className="hidden md:flex items-center gap-2">
          <div className="flex bg-[#242a38] rounded-md overflow-hidden">
            <Button
              variant="ghost"
              className={`px-3 py-1 h-8 ${view === 'split' ? 'bg-[#374151] text-white' : 'text-[#9ca3af]'}`}
              onClick={() => setView('split')}
            >
              <Columns size={14} className="mr-1" />
              Split
            </Button>
            <Button
              variant="ghost"
              className={`px-3 py-1 h-8 ${view === 'editor' ? 'bg-[#374151] text-white' : 'text-[#9ca3af]'}`}
              onClick={() => setView('editor')}
            >
              <Code size={14} className="mr-1" />
              Editor
            </Button>
            <Button
              variant="ghost"
              className={`px-3 py-1 h-8 ${view === 'preview' ? 'bg-[#374151] text-white' : 'text-[#9ca3af]'}`}
              onClick={() => setView('preview')}
            >
              <Monitor size={14} className="mr-1" />
              Preview
            </Button>
          </div>
        </div>
        
        <div className="flex gap-1 md:gap-2 items-center">
          <Button 
            variant="ghost" 
            onClick={copyCode}
            className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38] md:flex items-center gap-1 hidden"
          >
            <Copy size={16} />
            <span className="hidden lg:inline">Copy</span>
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={downloadCode}
            className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38] md:flex items-center gap-1 hidden"
          >
            <Download size={16} />
            <span className="hidden lg:inline">Download</span>
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={() => setShowAiAssistant(!showAiAssistant)}
            className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38] md:flex items-center gap-1 hidden"
          >
            <Code size={16} />
            <span className="hidden lg:inline">AI</span>
          </Button>
          
          <GitHubIntegration files={files} />
          
          <AdvancedSettings 
            settings={settings} 
            onUpdateSettings={setSettings}
          />
          
          <Button 
            variant="ghost" 
            onClick={resetToDefaults}
            className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38] flex items-center gap-1"
          >
            <RefreshCw size={16} />
            <span className="hidden md:inline">Reset</span>
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={clearAll}
            className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38] flex items-center gap-1"
          >
            <Trash2 size={16} />
            <span className="hidden md:inline">Clear</span>
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={toggleFullscreen}
            className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38]"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </Button>
        </div>
      </header>

      {/* Mobile View Controls */}
      <div className="md:hidden flex p-2 bg-[#151922] border-b border-[#374151]">
        <div className="flex w-full bg-[#242a38] rounded-md overflow-hidden">
          <Button
            variant="ghost"
            className={`flex-1 px-2 py-1 h-8 ${view === 'split' ? 'bg-[#374151] text-white' : 'text-[#9ca3af]'}`}
            onClick={() => setView('split')}
          >
            <Layout size={14} className="mr-1" />
            Split
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 px-2 py-1 h-8 ${view === 'editor' ? 'bg-[#374151] text-white' : 'text-[#9ca3af]'}`}
            onClick={() => setView('editor')}
          >
            <Code size={14} className="mr-1" />
            Code
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 px-2 py-1 h-8 ${view === 'preview' ? 'bg-[#374151] text-white' : 'text-[#9ca3af]'}`}
            onClick={() => setView('preview')}
          >
            <Monitor size={14} className="mr-1" />
            Result
          </Button>
        </div>
      </div>

      {/* Editor Container */}
      <div 
        className="flex flex-1 overflow-hidden" 
        ref={containerRef}
      >
        {/* File Explorer - hidden on mobile when not in editor mode */}
        {(view === 'editor' || !isMobile) && (
          <div 
            className="w-64 h-full flex-shrink-0"
            style={{ display: view === 'preview' && isMobile ? 'none' : undefined }}
          >
            <FileExplorer 
              files={files}
              currentFile={currentFile}
              onSelectFile={handleFileSelect}
              onAddFile={handleAddFile}
              onDeleteFile={handleDeleteFile}
            />
          </div>
        )}

        {/* Editors Panel */}
        <div 
          className={`flex flex-col ${isMobile ? 'w-full h-[60%]' : ''}`}
          style={{ 
            width: isMobile ? '100%' : `${panelWidth}%`,
            display: (view === 'preview' && isMobile) ? 'none' : undefined 
          }}
        >
          <CodeEditor 
            language={getCurrentFileType()}
            displayName={currentFile}
            value={files[currentFile]?.content || ''}
            onChange={handleFileChange}
            tagColor={getTagColorForFile().color}
            tagBgColor={getTagColorForFile().bgColor}
          />
        </div>

        {/* Resize Handle */}
        {!isMobile && view === 'split' && (
          <div 
            className="w-2 bg-[#374151] hover:bg-[#6366f1] cursor-col-resize transition-colors"
            onMouseDown={startResize}
          />
        )}

        {/* Preview Panel */}
        {(view === 'split' || view === 'preview') && (
          <div 
            className="flex-1"
            style={{ display: (view === 'editor' && isMobile) ? 'none' : undefined }}
          >
            <PreviewPanel 
              html={files['index.html']?.content || ''} 
              css={files['styles.css']?.content || ''} 
              js={files['script.js']?.content || ''}  
            />
          </div>
        )}
      </div>

      {/* AI Assistant */}
      <AIAssistant 
        visible={showAiAssistant}
        onClose={() => setShowAiAssistant(false)}
        onInsertCode={insertCodeFromAI}
      />
    </div>
  );
};

export default Index;
