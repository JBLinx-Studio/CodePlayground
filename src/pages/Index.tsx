
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/CodeEditor";
import { PreviewPanel } from "@/components/PreviewPanel";
import { 
  Github, 
  RefreshCw, 
  Trash2, 
  Code, 
  Download, 
  Copy, 
  Settings, 
  PlayCircle,
  Plus,
  Columns,
  MonitorSmartphone,
  Code2,
  ChevronDown,
  X,
  Save,
  FolderGit2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
console.log("CodePlayground is running!");

document.addEventListener('DOMContentLoaded', function() {
  const heading = document.querySelector('h1');
  if (heading) {
    heading.addEventListener('click', function() {
      this.style.color = getRandomColor();
    });
  }
});

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}`;

interface FileType {
  name: string;
  content: string;
  type: 'html' | 'css' | 'javascript';
  color: string;
  bgColor: string;
}

const Index = () => {
  // Files state
  const [files, setFiles] = useState<FileType[]>([
    { 
      name: 'index.html', 
      content: defaultHTML, 
      type: 'html',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.2)'
    },
    { 
      name: 'styles.css', 
      content: defaultCSS, 
      type: 'css',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.2)'
    },
    { 
      name: 'script.js', 
      content: defaultJS, 
      type: 'javascript',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.2)'
    }
  ]);
  const [currentFile, setCurrentFile] = useState<FileType>(files[0]);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'html' | 'css' | 'javascript'>('javascript');
  const [panelWidth, setPanelWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Settings
  const [settings, setSettings] = useState({
    theme: 'dark',
    fontSize: '14px',
    tabSize: 2,
    lineNumbers: true,
    autoUpdate: true,
    indentWithTabs: false
  });
  
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  // Initialize editors with stored code or defaults
  useEffect(() => {
    const savedData = localStorage.getItem('codeplayground-data');
    
    if (savedData) {
      try {
        const { files: savedFiles, currentFileName, settings: savedSettings } = JSON.parse(savedData);
        if (savedFiles && Array.isArray(savedFiles)) {
          setFiles(savedFiles);
          
          // Set current file
          if (currentFileName) {
            const currentFileObj = savedFiles.find(f => f.name === currentFileName);
            if (currentFileObj) {
              setCurrentFile(currentFileObj);
            }
          }
        }
        
        // Load settings
        if (savedSettings) {
          setSettings(prev => ({ ...prev, ...savedSettings }));
        }
      } catch (e) {
        console.error('Failed to load saved code:', e);
        resetToDefaults();
      }
    }
  }, []);

  // Save to localStorage whenever code changes
  useEffect(() => {
    const data = {
      files,
      currentFileName: currentFile?.name,
      settings
    };
    localStorage.setItem('codeplayground-data', JSON.stringify(data));
  }, [files, currentFile, settings]);

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
    const defaultFiles = [
      { 
        name: 'index.html', 
        content: defaultHTML, 
        type: 'html' as const,
        color: '#ef4444',
        bgColor: 'rgba(239, 68, 68, 0.2)'
      },
      { 
        name: 'styles.css', 
        content: defaultCSS, 
        type: 'css' as const,
        color: '#3b82f6',
        bgColor: 'rgba(59, 130, 246, 0.2)'
      },
      { 
        name: 'script.js', 
        content: defaultJS, 
        type: 'javascript' as const,
        color: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.2)'
      }
    ];
    
    setFiles(defaultFiles);
    setCurrentFile(defaultFiles[0]);
    toast.success("Reset to defaults successfully");
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all code?')) {
      setFiles(prev => 
        prev.map(file => ({
          ...file,
          content: file.type === 'html' 
            ? '<!-- Write your HTML here -->' 
            : file.type === 'css' 
              ? '/* Write your CSS here */' 
              : '// Write your JavaScript here'
        }))
      );
      toast.success("All code cleared");
    }
  };

  const updateFileContent = (content: string) => {
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.name === currentFile.name 
          ? { ...file, content } 
          : file
      )
    );
    
    setCurrentFile(prev => ({ ...prev, content }));
  };

  const addNewFile = () => {
    if (!newFileName) {
      toast.error("Please enter a file name");
      return;
    }
    
    // Add extension if not provided
    let fileName = newFileName;
    if (!fileName.includes('.')) {
      if (newFileType === 'html') fileName += '.html';
      else if (newFileType === 'css') fileName += '.css';
      else fileName += '.js';
    }
    
    // Check if file already exists
    if (files.some(file => file.name === fileName)) {
      toast.error(`File "${fileName}" already exists`);
      return;
    }
    
    // Create color and bgColor based on file type
    let color = '#f59e0b'; // default JS
    let bgColor = 'rgba(245, 158, 11, 0.2)';
    
    if (newFileType === 'html') {
      color = '#ef4444';
      bgColor = 'rgba(239, 68, 68, 0.2)';
    } else if (newFileType === 'css') {
      color = '#3b82f6';
      bgColor = 'rgba(59, 130, 246, 0.2)';
    }
    
    const defaultContent = newFileType === 'html' 
      ? '<!-- Write your HTML here -->' 
      : newFileType === 'css' 
        ? '/* Write your CSS here */' 
        : '// Write your JavaScript here';
    
    const newFile = {
      name: fileName,
      content: defaultContent,
      type: newFileType,
      color,
      bgColor
    };
    
    setFiles(prev => [...prev, newFile]);
    setCurrentFile(newFile);
    setNewFileName('');
    
    toast.success(`File "${fileName}" created`);
  };

  const deleteFile = (file: FileType) => {
    // Don't delete default files
    if (['index.html', 'styles.css', 'script.js'].includes(file.name)) {
      toast.error("Cannot delete default files");
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete "${file.name}"?`)) {
      setFiles(prev => prev.filter(f => f.name !== file.name));
      
      // If deleting current file, switch to first file
      if (currentFile.name === file.name) {
        setCurrentFile(files[0]);
      }
      
      toast.success(`File "${file.name}" deleted`);
    }
  };

  const generatePreviewContent = () => {
    // Get HTML, CSS, and JS content
    const htmlFile = files.find(file => file.name === 'index.html');
    const cssFiles = files.filter(file => file.type === 'css');
    const jsFiles = files.filter(file => file.type === 'javascript');
    
    const htmlContent = htmlFile ? htmlFile.content : '';
    const cssContent = cssFiles.map(file => file.content).join('\n');
    const jsContent = jsFiles.map(file => file.content).join('\n');
    
    return { html: htmlContent, css: cssContent, js: jsContent };
  };

  const copyCode = () => {
    const allCode = files.map(file => 
      `/* ${file.name} */\n${file.content}`
    ).join('\n\n');
    
    navigator.clipboard.writeText(allCode)
      .then(() => toast.success("Code copied to clipboard"))
      .catch(() => toast.error("Failed to copy code"));
  };

  const downloadCode = () => {
    // Create zip-like structure (without actual zipping)
    files.forEach(file => {
      const blob = new Blob([file.content], { 
        type: file.type === 'html' 
          ? 'text/html' 
          : file.type === 'css' 
            ? 'text/css' 
            : 'text/javascript' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
    
    toast.success("Files downloaded");
  };

  const handleGithubRepo = () => {
    if (!repoUrl) {
      toast.error("Please enter a GitHub repository URL");
      return;
    }
    
    setLoading(true);
    
    // Simulate loading for demo purposes
    setTimeout(() => {
      setLoading(false);
      toast.success("Connected to GitHub repository");
      
      // Real implementation would handle GitHub API interaction
    }, 1500);
  };

  const saveSettings = (newSettings: typeof settings) => {
    setSettings(newSettings);
    toast.success("Settings saved");
  };

  const getFileFromGitHub = () => {
    setLoading(true);
    
    // Simulate loading for demo purposes
    setTimeout(() => {
      setLoading(false);
      toast.success("Files imported from GitHub");
      
      // Real implementation would fetch files from GitHub
    }, 1500);
  };

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
        <div className="flex gap-2 items-center">
          {/* View Toggles */}
          <div className="hidden md:flex bg-[#242a38] rounded-md p-1 mr-2">
            <Button 
              variant={viewMode === 'split' ? "default" : "ghost"} 
              size="sm"
              onClick={() => setViewMode('split')}
              className="text-xs h-7"
            >
              <Columns size={14} className="mr-1" />
              Split
            </Button>
            <Button 
              variant={viewMode === 'editor' ? "default" : "ghost"} 
              size="sm"
              onClick={() => setViewMode('editor')}
              className="text-xs h-7"
            >
              <Code2 size={14} className="mr-1" />
              Editor
            </Button>
            <Button 
              variant={viewMode === 'preview' ? "default" : "ghost"} 
              size="sm"
              onClick={() => setViewMode('preview')}
              className="text-xs h-7"
            >
              <MonitorSmartphone size={14} className="mr-1" />
              Preview
            </Button>
          </div>
          
          {/* Action Buttons */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={copyCode}
            className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38]"
          >
            <Copy size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={downloadCode}
            className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38]"
          >
            <Download size={16} />
          </Button>
          
          {/* GitHub Button with Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38]"
              >
                <Github size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-[#1c2333] border-[#374151] text-[#e4e5e7]">
              <DialogHeader>
                <DialogTitle>GitHub Repository</DialogTitle>
                <DialogDescription className="text-[#9ca3af]">
                  Connect to GitHub repository or import/export files.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="repo-url">Repository URL</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="repo-url"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder="https://github.com/username/repo"
                      className="bg-[#242a38] border-[#374151] text-[#e4e5e7]"
                    />
                    <Button 
                      onClick={handleGithubRepo} 
                      disabled={loading}
                      className="whitespace-nowrap"
                    >
                      {loading ? "Connecting..." : "Connect"}
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 bg-[#242a38] border-[#374151] text-[#e4e5e7]"
                    onClick={getFileFromGitHub}
                    disabled={loading}
                  >
                    <FolderGit2 size={16} className="mr-2" />
                    Import Files
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 bg-[#242a38] border-[#374151] text-[#e4e5e7]"
                    onClick={downloadCode}
                  >
                    <Save size={16} className="mr-2" />
                    Export Files
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => toast.success("Code running in preview")}
            className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38]"
          >
            <PlayCircle size={16} />
          </Button>
          
          {/* Settings Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38]"
              >
                <Settings size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1c2333] border-[#374151] text-[#e4e5e7]">
              <DialogHeader>
                <DialogTitle>Editor Settings</DialogTitle>
                <DialogDescription className="text-[#9ca3af]">
                  Customize your coding environment.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select 
                    value={settings.theme}
                    onValueChange={(value) => setSettings({...settings, theme: value})}
                  >
                    <SelectTrigger className="bg-[#242a38] border-[#374151] text-[#e4e5e7]">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#242a38] border-[#374151] text-[#e4e5e7]">
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="font-size">Font Size</Label>
                  <Select 
                    value={settings.fontSize}
                    onValueChange={(value) => setSettings({...settings, fontSize: value})}
                  >
                    <SelectTrigger className="bg-[#242a38] border-[#374151] text-[#e4e5e7]">
                      <SelectValue placeholder="Select font size" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#242a38] border-[#374151] text-[#e4e5e7]">
                      <SelectItem value="12px">12px</SelectItem>
                      <SelectItem value="14px">14px</SelectItem>
                      <SelectItem value="16px">16px</SelectItem>
                      <SelectItem value="18px">18px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="tab-size">Tab Size</Label>
                  <RadioGroup 
                    value={settings.tabSize.toString()}
                    onValueChange={(value) => setSettings({...settings, tabSize: parseInt(value)})}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="tab-2" />
                      <Label htmlFor="tab-2">2 spaces</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4" id="tab-4" />
                      <Label htmlFor="tab-4">4 spaces</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="line-numbers" 
                    checked={settings.lineNumbers}
                    onCheckedChange={(checked) => 
                      setSettings({...settings, lineNumbers: checked === true})
                    }
                  />
                  <Label htmlFor="line-numbers">Show line numbers</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="auto-update" 
                    checked={settings.autoUpdate}
                    onCheckedChange={(checked) => 
                      setSettings({...settings, autoUpdate: checked === true})
                    }
                  />
                  <Label htmlFor="auto-update">Auto-update preview</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setSettings({
                    theme: 'dark',
                    fontSize: '14px',
                    tabSize: 2,
                    lineNumbers: true,
                    autoUpdate: true,
                    indentWithTabs: false
                  })}
                  className="mr-auto bg-[#242a38] border-[#374151] text-[#e4e5e7]"
                >
                  Reset
                </Button>
                <Button onClick={() => saveSettings(settings)}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={resetToDefaults}
            className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38]"
          >
            <RefreshCw size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={clearAll}
            className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38]"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </header>

      {/* Editor Container */}
      <div className="flex flex-1 overflow-hidden" ref={containerRef}>
        {/* File Explorer */}
        {showFileExplorer && (
          <div className="w-64 bg-[#151922] border-r border-[#374151] flex flex-col">
            <div className="p-3 border-b border-[#374151] flex justify-between items-center">
              <h2 className="text-sm font-medium">Files</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 rounded-md hover:bg-[#242a38]"
                  >
                    <Plus size={16} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1c2333] border-[#374151] text-[#e4e5e7]">
                  <DialogHeader>
                    <DialogTitle>Add New File</DialogTitle>
                    <DialogDescription className="text-[#9ca3af]">
                      Create a new file for your project.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="filename">File Name</Label>
                      <Input 
                        id="filename" 
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        placeholder="e.g. utils.js"
                        className="bg-[#242a38] border-[#374151] text-[#e4e5e7]"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="filetype">File Type</Label>
                      <Select 
                        value={newFileType}
                        onValueChange={(value: 'html' | 'css' | 'javascript') => setNewFileType(value)}
                      >
                        <SelectTrigger className="bg-[#242a38] border-[#374151] text-[#e4e5e7]">
                          <SelectValue placeholder="Select file type" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#242a38] border-[#374151] text-[#e4e5e7]">
                          <SelectItem value="html">HTML</SelectItem>
                          <SelectItem value="css">CSS</SelectItem>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={addNewFile}>Create File</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex-1 overflow-auto p-2">
              {files.map((file) => (
                <div 
                  key={file.name}
                  className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer mb-1 ${
                    currentFile.name === file.name 
                      ? 'bg-[#2d3748] text-white' 
                      : 'hover:bg-[#242a38]'
                  }`}
                  onClick={() => setCurrentFile(file)}
                >
                  <div className="flex items-center">
                    <span 
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: file.color }}
                    ></span>
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                  {!['index.html', 'styles.css', 'script.js'].includes(file.name) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-md opacity-0 group-hover:opacity-100 hover:bg-[#374151]"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFile(file);
                      }}
                    >
                      <X size={12} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`flex flex-1 ${
          viewMode === 'editor' 
            ? 'flex-col' 
            : viewMode === 'preview' 
              ? 'flex-col-reverse' 
              : 'flex-row'
        }`}>
          {/* Editors Panel */}
          <div 
            className={`
              flex flex-col
              ${viewMode === 'preview' ? 'hidden' : ''}
              ${viewMode === 'split' && !isMobile ? `w-[${panelWidth}%]` : ''}
              ${viewMode === 'split' && isMobile ? 'h-[60%]' : ''}
              ${viewMode === 'editor' ? 'flex-1' : ''}
            `}
            style={{ width: viewMode === 'split' && !isMobile ? `${panelWidth}%` : undefined }}
          >
            <CodeEditor 
              language={currentFile.type}
              displayName={currentFile.name}
              value={currentFile.content}
              onChange={updateFileContent}
              tagColor={currentFile.color}
              tagBgColor={currentFile.bgColor}
              lineNumbers={settings.lineNumbers}
            />
          </div>

          {/* Resize Handle */}
          {viewMode === 'split' && !isMobile && (
            <div 
              className="w-1 bg-[#374151] hover:bg-[#6366f1] cursor-col-resize transition-colors"
              onMouseDown={startResize}
            />
          )}

          {/* Preview Panel */}
          <div className={`
            ${viewMode === 'editor' ? 'hidden' : ''}
            ${viewMode === 'split' && !isMobile ? 'flex-1' : ''}
            ${viewMode === 'split' && isMobile ? 'h-[40%]' : ''}
            ${viewMode === 'preview' ? 'flex-1' : ''}
          `}>
            <PreviewPanel {...generatePreviewContent()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
