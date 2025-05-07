import React, { useState, useRef } from "react";
import { Folder, File, Plus, Trash2, ChevronDown, ChevronUp, Pencil, Check, Pin, PinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileType } from "@/types/file";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface FileExplorerProps {
  files: Record<string, FileType>;
  currentFile: string;
  onSelectFile: (fileName: string) => void;
  onAddFile: (fileName: string, fileType: string) => void;
  onDeleteFile: (fileName: string) => void;
  onRenameFile?: (oldName: string, newName: string) => void;
  dockedFiles?: string[];
  toggleDockedFile?: (fileName: string) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  currentFile,
  onSelectFile,
  onAddFile,
  onDeleteFile,
  onRenameFile,
  dockedFiles = [],
  toggleDockedFile
}) => {
  const [newFileName, setNewFileName] = useState("");
  const [newFileType, setNewFileType] = useState("js");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showHtml, setShowHtml] = useState(true);
  const [showCss, setShowCss] = useState(true);
  const [showJs, setShowJs] = useState(true);
  const [showOther, setShowOther] = useState(true);
  
  // For file renaming
  const [isRenaming, setIsRenaming] = useState(false);
  const [fileToRename, setFileToRename] = useState("");
  const [newName, setNewName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isFileDocked = (fileName: string) => {
    return dockedFiles.includes(fileName);
  };

  const handleToggleDockedFile = (fileName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (toggleDockedFile) {
      toggleDockedFile(fileName);
      toast.success(
        isFileDocked(fileName) 
          ? `Removed ${fileName} from docked files` 
          : `Added ${fileName} to docked files`
      );
    }
  };

  const handleAddFile = () => {
    if (!newFileName) return;
    
    let finalFileName = newFileName;
    if (!finalFileName.includes('.')) {
      if (newFileType === 'html') {
        finalFileName += '.html';
      } else if (newFileType === 'css') {
        finalFileName += '.css';
      } else if (newFileType === 'js') {
        finalFileName += '.js';
      }
    }

    onAddFile(finalFileName, newFileType);
    setNewFileName("");
    setIsDialogOpen(false);
    toast.success(`Created new file: ${finalFileName}`);
  };

  const handleDeleteFile = (fileName: string) => {
    if (fileName === 'index.html' || fileName === 'styles.css' || fileName === 'script.js') {
      toast.error("Cannot delete default files");
      return;
    }
    
    if (confirm(`Are you sure you want to delete ${fileName}?`)) {
      onDeleteFile(fileName);
      toast.success(`Deleted ${fileName}`);
    }
  };

  const startRenaming = (fileName: string) => {
    setFileToRename(fileName);
    setNewName(fileName);
    setIsRenaming(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 10);
  };

  const finishRenaming = () => {
    if (fileToRename && newName && fileToRename !== newName && onRenameFile) {
      // Check if the file has a valid extension
      const oldExt = fileToRename.split('.').pop();
      const hasExtension = newName.includes('.');
      
      let finalNewName = newName;
      if (!hasExtension && oldExt) {
        finalNewName = `${newName}.${oldExt}`;
      }
      
      if (finalNewName === fileToRename) {
        setIsRenaming(false);
        return;
      }
      
      if (Object.keys(files).includes(finalNewName)) {
        toast.error(`File ${finalNewName} already exists`);
      } else {
        onRenameFile(fileToRename, finalNewName);
        toast.success(`Renamed ${fileToRename} to ${finalNewName}`);
      }
    }
    setIsRenaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      finishRenaming();
    } else if (e.key === 'Escape') {
      setIsRenaming(false);
    }
  };

  // Group files by type
  const htmlFiles = Object.keys(files).filter(name => name.endsWith('.html'));
  const cssFiles = Object.keys(files).filter(name => name.endsWith('.css'));
  const jsFiles = Object.keys(files).filter(name => name.endsWith('.js'));
  const otherFiles = Object.keys(files).filter(name => !name.endsWith('.html') && !name.endsWith('.css') && !name.endsWith('.js'));

  // The file rendering helper function
  const renderFileItem = (fileName: string) => (
    <div 
      key={fileName}
      className={`flex items-center justify-between px-3 py-1.5 rounded group ${
        currentFile === fileName 
          ? 'bg-[#374151]/70 text-white' 
          : 'hover:bg-[#252b3b]/50 text-[#9ca3af]'
      } transition-colors`}
    >
      {isRenaming && fileToRename === fileName ? (
        <div className="flex-1 flex items-center">
          <File size={14} className="mr-2 flex-shrink-0 text-[#ef4444]" />
          <input
            ref={inputRef}
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={finishRenaming}
            onKeyDown={handleKeyDown}
            className="bg-[#1a1f2c] border border-[#6366f1] text-white p-1 text-xs w-full rounded outline-none"
            autoFocus
          />
          <Button 
            variant="ghost" 
            size="sm"
            onClick={finishRenaming}
            className="ml-1 h-6 w-6 p-0"
          >
            <Check size={14} className="text-green-500" />
          </Button>
        </div>
      ) : (
        <>
          <div 
            className="flex items-center flex-1 cursor-pointer overflow-hidden"
            onClick={() => onSelectFile(fileName)}
          >
            <File size={14} className={`mr-2 flex-shrink-0 ${
              fileName.endsWith('.html') ? 'text-[#ef4444]' :
              fileName.endsWith('.css') ? 'text-[#3b82f6]' :
              fileName.endsWith('.js') ? 'text-[#f59e0b]' :
              'text-[#9ca3af]'
            }`} />
            <span className="text-xs truncate">
              {fileName}
              {isFileDocked(fileName) && (
                <span className="ml-1 text-[#6366f1]">●</span>
              )}
            </span>
          </div>
          <div className="flex space-x-1">
            {toggleDockedFile && (
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 w-6 p-0 ${
                  isFileDocked(fileName) 
                    ? 'text-[#6366f1] opacity-100' 
                    : 'text-[#9ca3af] opacity-0 group-hover:opacity-100'
                } hover:bg-[#252b3b] hover:text-[#a5b4fc] transition-all`}
                onClick={(e) => handleToggleDockedFile(fileName, e)}
                title={isFileDocked(fileName) ? "Undock file (Alt+D)" : "Dock file (Alt+D)"}
              >
                {isFileDocked(fileName) ? <PinOff size={14} /> : <Pin size={14} />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-[#252b3b] hover:text-[#a5b4fc] transition-all"
              onClick={() => startRenaming(fileName)}
            >
              <Pencil size={14} className="text-[#9ca3af]" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-[#252b3b] hover:text-red-400 transition-all"
              onClick={() => handleDeleteFile(fileName)}
            >
              <Trash2 size={14} className="text-[#9ca3af]" />
            </Button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <motion.div 
      className="bg-gradient-to-b from-[#131620] to-[#1a1f2c] border-r border-[#374151]/60 h-full flex flex-col shadow-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 flex items-center justify-between border-b border-[#374151]/70 bg-[#151922]/80 backdrop-blur-sm">
        <h2 className="text-[#e4e5e7] font-medium text-sm flex items-center">
          <Folder className="mr-2 h-4 w-4 text-[#6366f1]" />
          Project Files
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-[#252b3b] hover:text-[#a5b4fc]">
              <Plus size={16} className="text-[#9ca3af]" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gradient-to-b from-[#1a1f2c] to-[#252b3b] border border-[#374151]/70 text-[#e4e5e7] shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-[#a5b4fc]">Create New File</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="filename" className="text-sm text-[#9ca3af] font-medium">
                  File Name
                </label>
                <input
                  id="filename"
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="e.g., utils.js"
                  className="w-full p-2 bg-[#151922] border border-[#374151]/70 rounded text-[#e4e5e7] focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1] outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="filetype" className="text-sm text-[#9ca3af] font-medium">
                  File Type
                </label>
                <select
                  id="filetype"
                  value={newFileType}
                  onChange={(e) => setNewFileType(e.target.value)}
                  className="w-full p-2 bg-[#151922] border border-[#374151]/70 rounded text-[#e4e5e7] focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1] outline-none transition-all"
                >
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="js">JavaScript</option>
                </select>
              </div>
              <Button
                onClick={handleAddFile}
                className="w-full mt-4 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white hover:from-[#4f46e5] hover:to-[#7c3aed] transition-all shadow-lg"
              >
                Create File
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-y-auto flex-1 p-2">
        {/* Docked Files Section - New! */}
        {dockedFiles && dockedFiles.length > 0 && (
          <motion.div 
            className="mb-3 rounded-lg overflow-hidden bg-[#151922]/40 border border-[#374151]/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.0 }}
          >
            <div 
              className="flex items-center px-3 py-2 cursor-pointer hover:bg-[#252b3b]/30 transition-colors bg-gradient-to-r from-[#151922]/80 to-transparent border-b border-[#374151]/30"
            >
              <Pin size={16} className="mr-2 text-[#6366f1]" />
              <span className="text-sm font-medium text-[#e4e5e7]">Docked Files</span>
            </div>
            
            <div className="p-1 space-y-1">
              {dockedFiles.map(fileName => renderFileItem(fileName))}
            </div>
          </motion.div>
        )}

        {/* HTML Files */}
        <motion.div 
          className="mb-3 rounded-lg overflow-hidden bg-[#151922]/40 border border-[#374151]/30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div 
            className="flex items-center px-3 py-2 cursor-pointer hover:bg-[#252b3b]/30 transition-colors bg-gradient-to-r from-[#151922]/80 to-transparent border-b border-[#374151]/30"
            onClick={() => setShowHtml(!showHtml)}
          >
            {showHtml ? 
              <ChevronDown size={16} className="mr-2 text-[#9ca3af]" /> : 
              <ChevronUp size={16} className="mr-2 text-[#9ca3af]" />
            }
            <Folder size={16} className="mr-2 text-[#ef4444]" />
            <span className="text-sm font-medium text-[#e4e5e7]">HTML</span>
          </div>
          
          <AnimatePresence>
            {showHtml && (
              <motion.div 
                className="p-1 space-y-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {htmlFiles.map(fileName => renderFileItem(fileName))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* CSS Files */}
        <motion.div 
          className="mb-3 rounded-lg overflow-hidden bg-[#151922]/40 border border-[#374151]/30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div 
            className="flex items-center px-3 py-2 cursor-pointer hover:bg-[#252b3b]/30 transition-colors bg-gradient-to-r from-[#151922]/80 to-transparent border-b border-[#374151]/30"
            onClick={() => setShowCss(!showCss)}
          >
            {showCss ? 
              <ChevronDown size={16} className="mr-2 text-[#9ca3af]" /> : 
              <ChevronUp size={16} className="mr-2 text-[#9ca3af]" />
            }
            <Folder size={16} className="mr-2 text-[#3b82f6]" />
            <span className="text-sm font-medium text-[#e4e5e7]">CSS</span>
          </div>
          
          <AnimatePresence>
            {showCss && (
              <motion.div 
                className="p-1 space-y-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {cssFiles.map(fileName => renderFileItem(fileName))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* JS Files */}
        <motion.div 
          className="mb-3 rounded-lg overflow-hidden bg-[#151922]/40 border border-[#374151]/30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div 
            className="flex items-center px-3 py-2 cursor-pointer hover:bg-[#252b3b]/30 transition-colors bg-gradient-to-r from-[#151922]/80 to-transparent border-b border-[#374151]/30"
            onClick={() => setShowJs(!showJs)}
          >
            {showJs ? 
              <ChevronDown size={16} className="mr-2 text-[#9ca3af]" /> : 
              <ChevronUp size={16} className="mr-2 text-[#9ca3af]" />
            }
            <Folder size={16} className="mr-2 text-[#f59e0b]" />
            <span className="text-sm font-medium text-[#e4e5e7]">JavaScript</span>
          </div>
          
          <AnimatePresence>
            {showJs && (
              <motion.div 
                className="p-1 space-y-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {jsFiles.map(fileName => renderFileItem(fileName))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Other Files */}
        {otherFiles.length > 0 && (
          <motion.div 
            className="mb-3 rounded-lg overflow-hidden bg-[#151922]/40 border border-[#374151]/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div 
              className="flex items-center px-3 py-2 cursor-pointer hover:bg-[#252b3b]/30 transition-colors bg-gradient-to-r from-[#151922]/80 to-transparent border-b border-[#374151]/30"
              onClick={() => setShowOther(!showOther)}
            >
              {showOther ? 
                <ChevronDown size={16} className="mr-2 text-[#9ca3af]" /> : 
                <ChevronUp size={16} className="mr-2 text-[#9ca3af]" />
              }
              <Folder size={16} className="mr-2 text-[#9ca3af]" />
              <span className="text-sm font-medium text-[#e4e5e7]">Other</span>
            </div>
            
            <AnimatePresence>
              {showOther && (
                <motion.div 
                  className="p-1 space-y-1"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {otherFiles.map(fileName => renderFileItem(fileName))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
