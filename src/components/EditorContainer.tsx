import React, { useRef, useEffect, useState } from 'react';
import { CodeEditor } from "@/components/CodeEditor";
import { PreviewPanel } from "@/components/PreviewPanel";
import { FileExplorer } from "@/components/FileExplorer";
import { AIAssistant } from "@/components/AiAssistant";
import { useLayout } from '@/contexts/LayoutContext';
import { useFileSystem } from '@/contexts/FileSystemContext';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from "sonner";
import { GripVertical, Save, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const EditorContainer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  
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
        setShowSaveIndicator(true);
        setTimeout(() => setShowSaveIndicator(false), 1000);
        toast.success("Changes saved");
      }
      
      // Ctrl/Cmd + P to toggle preview
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        // If in editor view and not mobile, switch to split view
        if (view === 'editor' && !isMobile) {
          setView('split');
        } else if (view === 'split') {
          // Otherwise switch to editor view
          setView('editor');
        } else {
          setView('preview');
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
  
  // Run the preview with animation effect
  const runPreview = () => {
    setShowSaveIndicator(true);
    setTimeout(() => setShowSaveIndicator(false), 1000);
    toast.success("Preview updated");
  };

  return (
    <div 
      className="flex flex-1 overflow-hidden bg-gradient-to-br from-[#151922] to-[#1a1f2c] rounded-xl shadow-2xl border border-[#2e3646]/30" 
      ref={containerRef}
    >
      {/* File Explorer */}
      <AnimatePresence>
        {shouldShowFileExplorer() && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-64 h-full flex-shrink-0 border-r border-[#2e3646] bg-[#141821]/70 backdrop-blur-sm"
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
        className={`flex flex-col ${isMobile ? 'w-full h-[60%]' : ''} relative`}
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
        
        {/* Controls */}
        <motion.div 
          className="absolute top-3 right-3 z-10 flex items-center space-x-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <AnimatePresence>
            {showSaveIndicator && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-md border border-green-500/20"
              >
                Saved!
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-[#1c2333]/80 border-[#2e3646] h-8 px-3 text-xs flex items-center gap-1 hover:bg-[#2e3646]/50"
            onClick={runPreview}
          >
            <PlayCircle size={14} className="text-green-400" />
            <span>Run</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-[#1c2333]/80 border-[#2e3646] h-8 px-3 text-xs flex items-center gap-1 hover:bg-[#2e3646]/50"
            onClick={() => {
              setShowSaveIndicator(true);
              setTimeout(() => setShowSaveIndicator(false), 1000);
              toast.success("Changes saved");
            }}
          >
            <Save size={14} className="text-blue-400" />
            <span>Save</span>
          </Button>
        </motion.div>
      </motion.div>

      {/* Resize Handle */}
      {!isMobile && view === 'split' && (
        <motion.div 
          className="w-2 bg-[#2e3646] hover:bg-[#6366f1] cursor-col-resize transition-colors relative group flex items-center justify-center"
          onMouseDown={startResize}
          whileHover={{ scale: 1.2 }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <GripVertical 
              size={16} 
              className="text-[#6366f1] opacity-0 group-hover:opacity-100 transition-opacity" 
            />
          </div>
        </motion.div>
      )}

      {/* Preview Panel */}
      {(view === 'split' || view === 'preview') && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 bg-[#0f111a] relative"
          style={{ display: view === 'split' || view === 'preview' ? 'flex' : 'none' }}
          transition={{ duration: 0.3 }}
        >
          <PreviewPanel 
            html={files['index.html']?.content || ''} 
            css={files['styles.css']?.content || ''} 
            js={files['script.js']?.content || ''}  
          />
          
          {view === 'preview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="absolute bottom-4 right-4"
            >
              <Button
                variant="outline"
                className="bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/50 text-white"
                onClick={() => setView('split')}
              >
                Show Editor
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* AI Assistant */}
      <AnimatePresence>
        {showAiAssistant && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
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
