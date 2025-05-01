import React, { useState } from "react";
import { Folder, File, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileType } from "@/types/file";

interface FileExplorerProps {
  files: Record<string, FileType>;
  currentFile: string;
  onSelectFile: (fileName: string) => void;
  onAddFile: (fileName: string, fileType: string) => void;
  onDeleteFile: (fileName: string) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  currentFile,
  onSelectFile,
  onAddFile,
  onDeleteFile
}) => {
  const [newFileName, setNewFileName] = useState("");
  const [newFileType, setNewFileType] = useState("js");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showHtml, setShowHtml] = useState(true);
  const [showCss, setShowCss] = useState(true);
  const [showJs, setShowJs] = useState(true);
  const [showOther, setShowOther] = useState(true);

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
  };

  const handleDeleteFile = (fileName: string) => {
    if (fileName === 'index.html' || fileName === 'styles.css' || fileName === 'script.js') {
      alert("Cannot delete default files");
      return;
    }
    
    if (confirm(`Are you sure you want to delete ${fileName}?`)) {
      onDeleteFile(fileName);
    }
  };

  // Group files by type
  const htmlFiles = Object.keys(files).filter(name => name.endsWith('.html'));
  const cssFiles = Object.keys(files).filter(name => name.endsWith('.css'));
  const jsFiles = Object.keys(files).filter(name => name.endsWith('.js'));
  const otherFiles = Object.keys(files).filter(name => !name.endsWith('.html') && !name.endsWith('.css') && !name.endsWith('.js'));

  return (
    <div className="bg-[#151922] border-r border-[#374151] h-full flex flex-col">
      <div className="p-4 flex items-center justify-between border-b border-[#374151]">
        <h2 className="text-[#e4e5e7] font-medium text-sm">Files</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Plus size={16} className="text-[#9ca3af]" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1f2c] border border-[#374151] text-[#e4e5e7]">
            <DialogHeader>
              <DialogTitle>Add New File</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="filename" className="text-sm text-[#9ca3af]">
                  File Name
                </label>
                <input
                  id="filename"
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="e.g., utils.js"
                  className="w-full p-2 bg-[#242a38] border border-[#374151] rounded text-[#e4e5e7]"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="filetype" className="text-sm text-[#9ca3af]">
                  File Type
                </label>
                <select
                  id="filetype"
                  value={newFileType}
                  onChange={(e) => setNewFileType(e.target.value)}
                  className="w-full p-2 bg-[#242a38] border border-[#374151] rounded text-[#e4e5e7]"
                >
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="js">JavaScript</option>
                </select>
              </div>
              <Button
                onClick={handleAddFile}
                className="w-full mt-4 bg-[#6366f1] text-white hover:bg-[#4f46e5]"
              >
                Create File
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-y-auto flex-1">
        {/* HTML Files */}
        <div className="px-2 py-3 border-b border-[#374151]">
          <div 
            className="flex items-center px-2 py-1 cursor-pointer hover:bg-[#242a38] rounded"
            onClick={() => setShowHtml(!showHtml)}
          >
            {showHtml ? <ChevronDown size={16} className="mr-1 text-[#9ca3af]" /> : <ChevronUp size={16} className="mr-1 text-[#9ca3af]" />}
            <Folder size={16} className="mr-2 text-[#3b82f6]" />
            <span className="text-sm text-[#e4e5e7]">HTML</span>
          </div>
          {showHtml && (
            <div className="ml-4 mt-1 space-y-1">
              {htmlFiles.map((fileName) => (
                <div 
                  key={fileName}
                  className={`flex items-center justify-between px-2 py-1 rounded ${currentFile === fileName ? 'bg-[#374151] text-white' : 'hover:bg-[#242a38] text-[#9ca3af]'}`}
                >
                  <div 
                    className="flex items-center flex-1 cursor-pointer"
                    onClick={() => onSelectFile(fileName)}
                  >
                    <File size={14} className="mr-2" />
                    <span className="text-xs truncate">{fileName}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteFile(fileName)}
                  >
                    <Trash2 size={14} className="text-[#9ca3af]" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CSS Files */}
        <div className="px-2 py-3 border-b border-[#374151]">
          <div 
            className="flex items-center px-2 py-1 cursor-pointer hover:bg-[#242a38] rounded"
            onClick={() => setShowCss(!showCss)}
          >
            {showCss ? <ChevronDown size={16} className="mr-1 text-[#9ca3af]" /> : <ChevronUp size={16} className="mr-1 text-[#9ca3af]" />}
            <Folder size={16} className="mr-2 text-[#ef4444]" />
            <span className="text-sm text-[#e4e5e7]">CSS</span>
          </div>
          {showCss && (
            <div className="ml-4 mt-1 space-y-1">
              {cssFiles.map((fileName) => (
                <div 
                  key={fileName}
                  className={`flex items-center justify-between px-2 py-1 rounded ${currentFile === fileName ? 'bg-[#374151] text-white' : 'hover:bg-[#242a38] text-[#9ca3af]'}`}
                >
                  <div 
                    className="flex items-center flex-1 cursor-pointer"
                    onClick={() => onSelectFile(fileName)}
                  >
                    <File size={14} className="mr-2" />
                    <span className="text-xs truncate">{fileName}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteFile(fileName)}
                  >
                    <Trash2 size={14} className="text-[#9ca3af]" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* JS Files */}
        <div className="px-2 py-3 border-b border-[#374151]">
          <div 
            className="flex items-center px-2 py-1 cursor-pointer hover:bg-[#242a38] rounded"
            onClick={() => setShowJs(!showJs)}
          >
            {showJs ? <ChevronDown size={16} className="mr-1 text-[#9ca3af]" /> : <ChevronUp size={16} className="mr-1 text-[#9ca3af]" />}
            <Folder size={16} className="mr-2 text-[#f59e0b]" />
            <span className="text-sm text-[#e4e5e7]">JavaScript</span>
          </div>
          {showJs && (
            <div className="ml-4 mt-1 space-y-1">
              {jsFiles.map((fileName) => (
                <div 
                  key={fileName}
                  className={`flex items-center justify-between px-2 py-1 rounded ${currentFile === fileName ? 'bg-[#374151] text-white' : 'hover:bg-[#242a38] text-[#9ca3af]'}`}
                >
                  <div 
                    className="flex items-center flex-1 cursor-pointer"
                    onClick={() => onSelectFile(fileName)}
                  >
                    <File size={14} className="mr-2" />
                    <span className="text-xs truncate">{fileName}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteFile(fileName)}
                  >
                    <Trash2 size={14} className="text-[#9ca3af]" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Other Files */}
        {otherFiles.length > 0 && (
          <div className="px-2 py-3 border-b border-[#374151]">
            <div 
              className="flex items-center px-2 py-1 cursor-pointer hover:bg-[#242a38] rounded"
              onClick={() => setShowOther(!showOther)}
            >
              {showOther ? <ChevronDown size={16} className="mr-1 text-[#9ca3af]" /> : <ChevronUp size={16} className="mr-1 text-[#9ca3af]" />}
              <Folder size={16} className="mr-2 text-[#9ca3af]" />
              <span className="text-sm text-[#e4e5e7]">Other</span>
            </div>
            {showOther && (
              <div className="ml-4 mt-1 space-y-1">
                {otherFiles.map((fileName) => (
                  <div 
                    key={fileName}
                    className={`flex items-center justify-between px-2 py-1 rounded ${currentFile === fileName ? 'bg-[#374151] text-white' : 'hover:bg-[#242a38] text-[#9ca3af]'}`}
                  >
                    <div 
                      className="flex items-center flex-1 cursor-pointer"
                      onClick={() => onSelectFile(fileName)}
                    >
                      <File size={14} className="mr-2" />
                      <span className="text-xs truncate">{fileName}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteFile(fileName)}
                    >
                      <Trash2 size={14} className="text-[#9ca3af]" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
