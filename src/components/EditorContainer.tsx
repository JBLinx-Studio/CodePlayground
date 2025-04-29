
import React, { useRef } from 'react';
import { CodeEditor } from "@/components/CodeEditor";
import { PreviewPanel } from "@/components/PreviewPanel";
import { FileExplorer } from "@/components/FileExplorer";
import { AIAssistant } from "@/components/AiAssistant";
import { useLayout } from '@/contexts/LayoutContext';
import { useFileSystem } from '@/contexts/FileSystemContext';
import { useTheme } from '@/contexts/ThemeContext';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from "sonner";

export const EditorContainer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    view,
    panelWidth,
    isMobile,
    startResize,
    showAiAssistant,
    setShowAiAssistant
  } = useLayout();
  
  const { theme } = useTheme();
  
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
    <motion.div 
      className={`flex flex-1 overflow-hidden rounded-lg shadow-xl border ${theme === 'dark' ? 'bg-[#1a1f2c] border-[#2e3646]/30' : 'bg-white border-gray-200/30'}`}
      ref={containerRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* File Explorer */}
      <AnimatePresence>
        {shouldShowFileExplorer() && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className={`w-64 h-full flex-shrink-0 border-r ${theme === 'dark' ? 'border-[#2e3646]' : 'border-gray-200'}`}
            style={{ display: view === 'preview' && isMobile ? 'none' : undefined }}
          >
            <FileExplorer 
              files={files}
              currentFile={currentFile}
              onSelectFile={handleFileSelect}
              onAddFile={handleAddFile}
              onDeleteFile={handleDeleteFile}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editors Panel */}
      <div 
        className={`flex flex-col ${isMobile ? 'w-full h-[60%]' : ''} transition-all duration-200 ease-in-out`}
        style={{ 
          width: isMobile ? '100%' : `${panelWidth}%`,
          display: view === 'preview' && isMobile ? 'none' : undefined 
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
          className={`w-2 ${theme === 'dark' ? 'bg-[#374151] hover:bg-[#6366f1]' : 'bg-gray-200 hover:bg-blue-400'} cursor-col-resize transition-colors relative`}
          onMouseDown={startResize}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-1 bg-[#6366f1] rounded-full opacity-60"></div>
        </div>
      )}

      {/* Preview Panel */}
      {(view === 'split' || view === 'preview') && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1"
          style={{ display: view === 'preview' || view === 'split' ? 'flex' : 'none' }}
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
            className="absolute right-0 top-0 bottom-0 z-50 lg:relative lg:w-80"
          >
            <AIAssistant 
              visible={showAiAssistant}
              onClose={() => setShowAiAssistant(false)}
              onInsertCode={insertCodeFromAI}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
