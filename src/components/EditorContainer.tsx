
import React, { useRef } from 'react';
import { CodeEditor } from "@/components/CodeEditor";
import { PreviewPanel } from "@/components/PreviewPanel";
import { FileExplorer } from "@/components/FileExplorer";
import { AIAssistant } from "@/components/AiAssistant";
import { useLayout } from '@/contexts/LayoutContext';
import { useFileSystem } from '@/contexts/FileSystemContext';

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
  };

  return (
    <div 
      className="flex flex-1 overflow-hidden bg-[#1a1f2c] rounded-lg shadow-lg" 
      ref={containerRef}
    >
      {/* File Explorer */}
      {shouldShowFileExplorer() && (
        <div 
          className="w-64 h-full flex-shrink-0 border-r border-[#2e3646]"
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
          className="w-2 bg-[#374151] hover:bg-[#6366f1] cursor-col-resize transition-colors"
          onMouseDown={startResize}
        />
      )}

      {/* Preview Panel */}
      {(view === 'split' || view === 'preview') && (
        <div 
          className="flex-1"
          style={{ display: view === 'editor' ? 'none' : undefined }}
        >
          <PreviewPanel 
            html={files['index.html']?.content || ''} 
            css={files['styles.css']?.content || ''} 
            js={files['script.js']?.content || ''}  
          />
        </div>
      )}

      {/* AI Assistant */}
      <AIAssistant 
        visible={showAiAssistant}
        onClose={() => setShowAiAssistant(false)}
        onInsertCode={insertCodeFromAI}
      />
    </div>
  );
};
