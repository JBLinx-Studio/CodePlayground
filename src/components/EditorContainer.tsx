import React, { useRef, useEffect } from 'react';
import { CodeEditor } from "@/components/CodeEditor";
import { PreviewPanel } from "@/components/PreviewPanel";
import { FileExplorer } from "@/components/FileExplorer";
import { AIAssistant } from "@/components/AiAssistant";
import { useLayout } from '@/contexts/LayoutContext';
import { useFileSystem } from '@/contexts/FileSystemContext';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from "sonner";
import { Play, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from "@/components/ui/resizable";

export const EditorContainer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    view,
    setView,
    isMobile,
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
    getTagColorForFile,
    handleRenameFile
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

  const runCode = () => {
    setView('preview');
    toast.success("Running your code");
  };

  const saveCode = () => {
    toast.success("Changes saved successfully");
  };

  return (
    <motion.div 
      className="flex flex-1 overflow-hidden rounded-xl shadow-2xl border border-[#2d3748]/30 bg-gradient-to-br from-[#0c1018]/90 to-[#151d2e]/90 backdrop-blur-sm"
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <ResizablePanelGroup direction={isMobile ? "vertical" : "horizontal"} className="w-full">
        {/* File Explorer Panel */}
        <AnimatePresence>
          {shouldShowFileExplorer() && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className={isMobile ? "w-full" : "w-64 h-full flex-shrink-0"}
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
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area with Resizable Panels */}
        {!isMobile && view === 'split' ? (
          <>
            {/* Editor Panel */}
            <ResizablePanel defaultSize={50} minSize={30} className="h-full">
              <motion.div 
                className="flex flex-col h-full relative"
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

                {/* Action buttons */}
                <motion.div 
                  className="absolute bottom-4 right-4 flex gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button 
                    size="sm" 
                    onClick={saveCode}
                    className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#818cf8] hover:to-[#a78bfa] text-white shadow-lg"
                  >
                    <Save size={14} className="mr-1" /> Save
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={runCode}
                    className="bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-white shadow-lg"
                  >
                    <Play size={14} className="mr-1" /> Run
                  </Button>
                </motion.div>
              </motion.div>
            </ResizablePanel>

            {/* Resizable Handle */}
            <ResizableHandle withHandle className="bg-gradient-to-b from-[#2d3748]/80 to-[#374151]/80 hover:from-[#6366f1]/60 hover:to-[#8b5cf6]/60 transition-colors" />

            {/* Preview Panel */}
            <ResizablePanel defaultSize={50} minSize={30}>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 bg-gradient-to-b from-[#ffffff]/5 to-[#ffffff]/10 backdrop-blur-sm rounded-r-xl overflow-hidden h-full"
                transition={{ duration: 0.3 }}
              >
                <PreviewPanel 
                  html={files['index.html']?.content || ''} 
                  css={files['styles.css']?.content || ''} 
                  js={files['script.js']?.content || ''}  
                />
              </motion.div>
            </ResizablePanel>
          </>
        ) : (
          /* Non-Split View */
          <motion.div 
            className="flex flex-col w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* For mobile or single panel views */}
            {view === 'editor' && (
              <div className="flex-1 flex flex-col relative">
                <CodeEditor 
                  language={getCurrentFileType()}
                  displayName={currentFile}
                  value={files[currentFile]?.content || ''}
                  onChange={handleFileChange}
                  tagColor={getTagColorForFile().color}
                  tagBgColor={getTagColorForFile().bgColor}
                />
                <motion.div 
                  className="absolute bottom-4 right-4 flex gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Button 
                    size="sm" 
                    onClick={saveCode}
                    className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#818cf8] hover:to-[#a78bfa] text-white shadow-lg"
                  >
                    <Save size={14} className="mr-1" /> Save
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={runCode}
                    className="bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-white shadow-lg"
                  >
                    <Play size={14} className="mr-1" /> Run
                  </Button>
                </motion.div>
              </div>
            )}

            {view === 'preview' && (
              <div className="flex-1 h-full">
                <PreviewPanel 
                  html={files['index.html']?.content || ''} 
                  css={files['styles.css']?.content || ''} 
                  js={files['script.js']?.content || ''}  
                />
              </div>
            )}
          </motion.div>
        )}
      </ResizablePanelGroup>

      {/* AI Assistant */}
      <AnimatePresence>
        {showAiAssistant && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-[56px] bottom-0 z-50 lg:relative"
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
