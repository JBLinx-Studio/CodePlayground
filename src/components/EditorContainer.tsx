
import React, { useRef, useEffect, useState } from 'react';
import { CodeEditor } from "@/components/CodeEditor";
import { PreviewPanel } from "@/components/PreviewPanel";
import { FileExplorer } from "@/components/FileExplorer";
import { AIAssistant } from "@/components/AiAssistant";
import { BackendPanel } from "@/components/BackendPanel";
import { useLayout } from '@/contexts/LayoutContext';
import { useFileSystem } from '@/contexts/FileSystemContext';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from "sonner";
import { GripVertical, Play, Save, Pin, PinOff, FileCode, Code, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";

export const EditorContainer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showBackendPanel, setShowBackendPanel] = useState<boolean>(false);
  
  const {
    view,
    setView,
    panelWidth,
    isMobile,
    startResize,
    showAiAssistant,
    setShowAiAssistant,
    dockedFiles,
    toggleDockedFile,
    isFileDocked
  } = useLayout();
  
  const {
    files,
    currentFile,
    handleFileSelect,
    handleAddFile,
    handleDeleteFile,
    handleFileChange,
    getCurrentFileType,
    getTagColorForFile,
    handleRenameFile
  } = useFileSystem();

  // Toggle backend panel
  const toggleBackendPanel = () => {
    setShowBackendPanel(prev => !prev);
    toast.info(showBackendPanel ? "Backend panel closed" : "Backend panel opened");
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveCode();
      }
      
      // Ctrl/Cmd + P to toggle preview
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        // If in editor view and not mobile, switch to split view
        if (view === 'editor' && !isMobile) {
          setView('split');
        } else {
          // Otherwise switch to editor view
          setView('editor');
        }
      }

      // Alt + 1 for editor view
      if (e.altKey && e.key === '1') {
        e.preventDefault();
        setView('editor');
        toast.info("Editor view");
      }
      
      // Alt + 2 for split view
      if (e.altKey && e.key === '2') {
        e.preventDefault();
        setView('split');
        toast.info("Split view");
      }
      
      // Alt + 3 for preview view
      if (e.altKey && e.key === '3') {
        e.preventDefault();
        setView('preview');
        toast.info("Preview view");
      }
      
      // Alt + A to toggle AI assistant
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        setShowAiAssistant(prev => !prev);
        toast.info(showAiAssistant ? "AI Assistant closed" : "AI Assistant opened");
      }
      
      // Alt + B to toggle backend panel
      if (e.altKey && e.key === 'b') {
        e.preventDefault();
        toggleBackendPanel();
      }
      
      // Alt + D to toggle docking for current file
      if (e.altKey && e.key === 'd') {
        e.preventDefault();
        toggleDockedFile(currentFile);
        toast.success(
          isFileDocked(currentFile) 
            ? `Removed ${currentFile} from docked files` 
            : `Added ${currentFile} to docked files`
        );
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, isMobile, setView, currentFile, toggleDockedFile, isFileDocked, showAiAssistant, showBackendPanel]);

  // Helper functions for conditional rendering
  const shouldShowFileExplorer = () => {
    if (isMobile) {
      return view === 'editor';
    }
    return true;
  };

  const insertCodeFromAI = (code: string) => {
    handleFileChange(files[currentFile].content + '\n' + code);
    toast.success("Code inserted successfully");
  };

  const runCode = () => {
    setView('preview');
    toast.success("Running your code");
  };

  const saveCode = () => {
    toast.success("Changes saved successfully");
  };
  
  // Get all files that should be displayed in the editor
  const getDisplayFiles = () => {
    if (view !== 'split') {
      return [currentFile];
    }
    
    // In split view, show docked files and the current file if it's not already docked
    const filesToShow = [...dockedFiles];
    if (!dockedFiles.includes(currentFile)) {
      filesToShow.push(currentFile);
    }
    return filesToShow;
  };

  // Animation variants for editors
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="flex flex-1 overflow-hidden rounded-xl shadow-2xl border border-[#2d3748]/30 bg-gradient-to-br from-[#0c1018]/90 to-[#151d2e]/90 backdrop-blur-sm h-full"
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ height: 'calc(100vh - 120px)' }}
    >
      {/* File Explorer */}
      <AnimatePresence>
        {shouldShowFileExplorer() && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-64 h-full flex-shrink-0 bg-gradient-to-b from-[#0c101a]/95 to-[#151d2e]/95"
            style={{ display: view === 'preview' && isMobile ? 'none' : undefined }}
          >
            <FileExplorer 
              files={files}
              currentFile={currentFile}
              onSelectFile={(file) => {
                handleFileSelect(file);
                isMobile && toast.info(`Editing ${file}`);
              }}
              onAddFile={handleAddFile}
              onDeleteFile={(file) => {
                handleDeleteFile(file);
                toast.success("File deleted");
              }}
              onRenameFile={(oldName, newName) => {
                handleRenameFile(oldName, newName);
              }}
              dockedFiles={dockedFiles}
              toggleDockedFile={toggleDockedFile}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content area with resizable panels */}
      <ResizablePanelGroup 
        direction={isMobile ? "vertical" : "horizontal"}
        className="flex-1 h-full"
      >
        {/* Editors Panel */}
        <ResizablePanel 
          defaultSize={panelWidth} 
          minSize={20}
          maxSize={80}
          className="h-full"
          style={{ 
            display: view === 'preview' && isMobile ? 'none' : undefined 
          }}
        >
          <ScrollArea className="h-full multi-editor-container">
            <motion.div
              className="h-full flex flex-col p-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {getDisplayFiles().map((fileName, index) => (
                <motion.div 
                  key={fileName} 
                  className="flex-1 min-h-[300px] relative mb-4 last:mb-0"
                  variants={itemVariants}
                >
                  <div className="absolute top-2 right-12 z-10 flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`h-7 w-7 p-0 bg-opacity-70 hover:bg-opacity-100 ${
                        isFileDocked(fileName) 
                          ? 'text-[#6366f1] bg-[#6366f1]/10' 
                          : 'text-[#9ca3af] hover:text-[#6366f1]'
                      } transition-all duration-300 hover:scale-110`}
                      onClick={() => toggleDockedFile(fileName)}
                      title={isFileDocked(fileName) ? "Undock file (Alt+D)" : "Dock file (Alt+D)"}
                    >
                      {isFileDocked(fileName) ? <PinOff size={14} className="pin-active" /> : <Pin size={14} />}
                    </Button>
                  </div>
                  <CodeEditor 
                    language={getCurrentFileType(fileName)}
                    displayName={fileName}
                    value={files[fileName]?.content || ''}
                    onChange={(content) => {
                      // Only update if this is the current file
                      if (fileName === currentFile) {
                        handleFileChange(content);
                      } else {
                        // If not current file, we need to select it first
                        handleFileSelect(fileName);
                        // Then update the content in the next tick
                        setTimeout(() => handleFileChange(content), 0);
                      }
                    }}
                    tagColor={getTagColorForFile(fileName).color}
                    tagBgColor={getTagColorForFile(fileName).bgColor}
                    isActive={fileName === currentFile}
                    onSelect={() => handleFileSelect(fileName)}
                  />
                </motion.div>
              ))}

              {/* Action buttons */}
              <motion.div 
                className="sticky bottom-4 right-4 flex gap-2 justify-end"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button 
                  size="sm" 
                  onClick={saveCode}
                  className="primary-button"
                >
                  <Save size={14} /> Save
                </Button>
                <Button 
                  size="sm" 
                  onClick={runCode}
                  className="bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-white shadow-lg transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex items-center gap-1"
                >
                  <Play size={14} /> Run
                </Button>
                <Button 
                  size="sm" 
                  onClick={toggleBackendPanel}
                  className={`${
                    showBackendPanel 
                      ? 'bg-[#6366f1] hover:bg-[#4f46e5]' 
                      : 'bg-[#374151] hover:bg-[#4b5563]'
                  } text-white shadow-lg transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex items-center gap-1`}
                >
                  <Server size={14} /> Backend
                </Button>
              </motion.div>
            </motion.div>
          </ScrollArea>
        </ResizablePanel>

        {/* Resize Handle */}
        {(view === 'split' || view === 'preview') && (
          <ResizableHandle withHandle>
            <div className="flex h-full items-center justify-center">
              <GripVertical size={16} className="text-[#4b5563] opacity-60" />
            </div>
          </ResizableHandle>
        )}

        {/* Preview and Backend Panel */}
        {(view === 'split' || view === 'preview') && (
          <ResizablePanel 
            defaultSize={100 - panelWidth} 
            minSize={20}
            maxSize={80}
            className="h-full"
          >
            <div className="h-full flex">
              <div className={`flex-1 ${showBackendPanel ? 'w-[calc(100%-300px)]' : 'w-full'}`}>
                <PreviewPanel 
                  html={files['index.html']?.content || ''} 
                  css={files['styles.css']?.content || ''} 
                  js={files['script.js']?.content || ''}
                  showBackendPanel={showBackendPanel}
                  onToggleBackendPanel={toggleBackendPanel}
                />
              </div>
              
              {showBackendPanel && (
                <AnimatePresence>
                  <motion.div 
                    className="w-[300px] h-full"
                    initial={{ opacity: 0, x: 300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 300 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BackendPanel />
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </ResizablePanel>
        )}
      </ResizablePanelGroup>

      {/* AI Assistant - Now positions absolutely over other content */}
      <AnimatePresence>
        {showAiAssistant && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed right-0 top-0 bottom-0 z-50"
            style={{ pointerEvents: showAiAssistant ? 'auto' : 'none' }}
          >
            <AIAssistant 
              visible={showAiAssistant}
              onClose={() => setShowAiAssistant(false)}
              onInsertCode={insertCodeFromAI}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Keyboard shortcuts help tooltip */}
      <motion.div 
        className="fixed bottom-4 left-4 rounded-md bg-[#1a1f2c]/80 backdrop-blur-sm border border-[#374151]/50 px-3 py-2 z-20 shadow-lg hidden md:block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.9, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-[#9ca3af] font-medium">Keyboard Shortcuts</span>
            <Code size={12} className="text-[#9ca3af]" />
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            <div className="flex items-center">
              <kbd className="kbd">Alt+1-3</kbd>
              <span className="text-[10px] text-[#9ca3af] ml-1.5">Views</span>
            </div>
            <div className="flex items-center">
              <kbd className="kbd">Alt+D</kbd>
              <span className="text-[10px] text-[#9ca3af] ml-1.5">Dock</span>
            </div>
            <div className="flex items-center">
              <kbd className="kbd">Alt+A</kbd>
              <span className="text-[10px] text-[#9ca3af] ml-1.5">AI</span>
            </div>
            <div className="flex items-center">
              <kbd className="kbd">Alt+B</kbd>
              <span className="text-[10px] text-[#9ca3af] ml-1.5">Backend</span>
            </div>
            <div className="flex items-center">
              <kbd className="kbd">Ctrl+S</kbd>
              <span className="text-[10px] text-[#9ca3af] ml-1.5">Save</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
