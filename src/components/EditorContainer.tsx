import React, { useRef, useEffect } from 'react';
import { CodeEditor } from "@/components/CodeEditor";
import { PreviewPanel } from "@/components/PreviewPanel";
import { FileExplorer } from "@/components/FileExplorer";
import { AIAssistant } from "@/components/AiAssistant";
import { useLayout } from '@/contexts/LayoutContext';
import { useFileSystem } from '@/contexts/FileSystemContext';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from "sonner";

export const EditorContainer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    view,
    setView,
    panelWidth,
    isMobile,
    startResize,
    showAiAssistant,
    setShowAiAssistant
  } = useLayout();
  
  const {
    files,
    currentFile,
    handleFileSelect,
    handleAddFile,
    handleDeleteFile,
    handleFileChange,
    getCurrentFileType,
    getTagColorForFile
  } = useFileSystem();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        toast.success("Changes saved");
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
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, isMobile, setView]);

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

  return (
    <div 
      className="flex flex-1 overflow-hidden bg-[#1a1f2c] rounded-lg shadow-xl border border-[#2e3646]/30" 
      ref={containerRef}
    >
      {/* File Explorer */}
      <AnimatePresence>
        {shouldShowFileExplorer() && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="w-64 h-full flex-shrink-0 border-r border-[#2e3646]"
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
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editors Panel */}
      <motion.div 
        className={`flex flex-col ${isMobile ? 'w-full h-[60%]' : ''}`}
        style={{ 
          width: isMobile ? '100%' : `${panelWidth}%`,
          display: view === 'preview' && isMobile ? 'none' : undefined 
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <CodeEditor 
          language={getCurrentFileType()}
          displayName={currentFile}
          value={files[currentFile]?.content || ''}
          onChange={handleFileChange}
          tagColor={getTagColorForFile().color}
          tagBgColor={getTagColorForFile().bgColor}
        />
      </motion.div>

      {/* Resize Handle */}
      {!isMobile && view === 'split' && (
        <motion.div 
          className="w-2 bg-[#374151] hover:bg-[#6366f1] cursor-col-resize transition-colors relative"
          onMouseDown={startResize}
          whileHover={{ scale: 1.2 }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-1 bg-[#6366f1] rounded-full opacity-60"></div>
        </motion.div>
      )}

      {/* Preview Panel */}
      {(view === 'split' || view === 'preview') && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1"
          style={{ display: view === 'split' || view === 'preview' ? 'flex' : 'none' }}
          transition={{ duration: 0.3 }}
        >
          <PreviewPanel 
            html={files['index.html']?.content || ''} 
            css={files['styles.css']?.content || ''} 
            js={files['script.js']?.content || ''}  
          />
        </motion.div>
      )}

      {/* AI Assistant */}
      <AnimatePresence>
        {showAiAssistant && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-0 bottom-0 z-50 lg:relative"
          >
            <AIAssistant 
              visible={showAiAssistant}
              onClose={() => setShowAiAssistant(false)}
              onInsertCode={insertCodeFromAI}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
