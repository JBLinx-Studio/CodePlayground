
import React from 'react';
import { Button } from "@/components/ui/button";
import { useLayout } from '@/contexts/LayoutContext';
import { 
  Layout, 
  Code, 
  Monitor, 
  Sparkles, 
  Settings, 
  BookOpen, 
  FileText,
  FileCog,
  FileCode
} from "lucide-react";
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useFileSystem } from '@/contexts/FileSystemContext';
import { toast } from "sonner";

export const MobileControls: React.FC = () => {
  const { 
    view, 
    setView, 
    showAiAssistant, 
    setShowAiAssistant, 
    dockedFiles,
    toggleDockedFile
  } = useLayout();
  
  const { currentFile } = useFileSystem();

  const containerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.3, 
        delay: 0.1,
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: -10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const badgeVariants = {
    hidden: { scale: 0 },
    visible: { 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15,
        delay: 0.3
      }
    },
    pulse: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.4
      }
    }
  };

  const toggleDockCurrentFile = () => {
    if (!currentFile) return;
    
    toggleDockedFile(currentFile);
    toast.success(
      dockedFiles.includes(currentFile) 
        ? `${currentFile} removed from docked files` 
        : `${currentFile} added to docked files`
    );
  };

  return (
    <motion.div 
      className="md:hidden p-3 bg-gradient-to-r from-[#0c101a] to-[#151d2e] border-b border-[#2d3748]/70 shadow-xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex w-full glassmorphism bg-gradient-to-b from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-[#2d3748]/40">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={`flex-1 px-2 py-1 h-14 transition-all duration-300 ${
                  view === 'split' 
                  ? 'bg-gradient-to-r from-[#4f46e5]/30 to-[#6366f1]/20 text-[#a5b4fc] shadow-inner border-t-2 border-[#6366f1]' 
                  : 'text-[#9ca3af] hover:text-white'
                }`}
                onClick={() => setView('split')}
              >
                <motion.div 
                  className="flex flex-col items-center justify-center"
                  variants={itemVariants}
                >
                  <Layout size={16} className="mb-1" />
                  <span className="text-xs font-medium">Split</span>
                  {dockedFiles.length > 0 && (
                    <motion.span
                      className="absolute top-1 right-1 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
                      variants={badgeVariants}
                      animate={dockedFiles.length > 0 ? "pulse" : "visible"}
                      key={dockedFiles.length}
                    >
                      {dockedFiles.length}
                    </motion.span>
                  )}
                </motion.div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-[#1a1f2c] text-white border-[#374151]">
              <p>Split view (Alt+2)</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={`flex-1 px-2 py-1 h-14 transition-all duration-300 ${
                  view === 'editor' 
                  ? 'bg-gradient-to-r from-[#4f46e5]/30 to-[#6366f1]/20 text-[#a5b4fc] shadow-inner border-t-2 border-[#6366f1]' 
                  : 'text-[#9ca3af] hover:text-white'
                }`}
                onClick={() => setView('editor')}
              >
                <motion.div 
                  className="flex flex-col items-center justify-center"
                  variants={itemVariants}
                >
                  <Code size={16} className="mb-1" />
                  <span className="text-xs font-medium">Code</span>
                </motion.div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-[#1a1f2c] text-white border-[#374151]">
              <p>Editor view (Alt+1)</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={`flex-1 px-2 py-1 h-14 transition-all duration-300 ${
                  view === 'preview' 
                  ? 'bg-gradient-to-r from-[#4f46e5]/30 to-[#6366f1]/20 text-[#a5b4fc] shadow-inner border-t-2 border-[#6366f1]' 
                  : 'text-[#9ca3af] hover:text-white'
                }`}
                onClick={() => setView('preview')}
              >
                <motion.div 
                  className="flex flex-col items-center justify-center"
                  variants={itemVariants}
                >
                  <Monitor size={16} className="mb-1" />
                  <span className="text-xs font-medium">Result</span>
                </motion.div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-[#1a1f2c] text-white border-[#374151]">
              <p>Preview view (Alt+3)</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={`flex-1 px-2 py-1 h-14 transition-all duration-300 ${
                  showAiAssistant 
                  ? 'bg-gradient-to-r from-[#4f46e5]/30 to-[#6366f1]/20 text-[#a5b4fc] shadow-inner border-t-2 border-[#6366f1]' 
                  : 'text-[#9ca3af] hover:text-white'
                }`}
                onClick={() => setShowAiAssistant(!showAiAssistant)}
              >
                <motion.div 
                  className="flex flex-col items-center justify-center"
                  variants={itemVariants}
                >
                  <Sparkles 
                    size={16} 
                    className={`${
                      showAiAssistant 
                        ? 'animate-pulse text-[#6366f1]' 
                        : ''
                    } mb-1`} 
                  />
                  <span className="text-xs font-medium">AI</span>
                </motion.div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-[#1a1f2c] text-white border-[#374151]">
              <p>AI Assistant (Alt+A)</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="flex-1 px-2 py-1 h-14 transition-all duration-300 text-[#9ca3af] hover:text-white"
                onClick={toggleDockCurrentFile}
              >
                <motion.div 
                  className="flex flex-col items-center justify-center"
                  variants={itemVariants}
                >
                  <FileCog size={16} className="mb-1" />
                  <span className="text-xs font-medium">Dock</span>
                </motion.div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-[#1a1f2c] text-white border-[#374151]">
              <p>Dock current file (Alt+D)</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="flex-1 px-2 py-1 h-14 transition-all duration-300 text-[#9ca3af] hover:text-white"
              >
                <motion.div 
                  className="flex flex-col items-center justify-center"
                  variants={itemVariants}
                >
                  <Settings size={16} className="mb-1" />
                  <span className="text-xs font-medium">Settings</span>
                </motion.div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-[#1a1f2c] text-white border-[#374151]">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <motion.div 
        className="mt-3 px-2"
        variants={itemVariants}
      >
        <div className="flex flex-wrap items-center justify-between bg-gradient-to-r from-[#1a1f2c]/50 to-[#151922]/40 backdrop-blur-sm rounded-md px-3 py-2 border border-[#2d3748]/30 shadow-inner">
          <div className="flex items-center gap-1.5 mb-1 md:mb-0">
            <BookOpen size={13} className="text-[#9ca3af]" />
            <span className="text-[11px] text-[#9ca3af] font-medium">Shortcuts</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center mb-1 md:mb-0">
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[#1e293b] rounded border border-[#374151] text-[#9ca3af]">Alt+1-3</kbd>
              <span className="text-[10px] text-[#9ca3af] ml-1.5">Views</span>
            </div>
            <div className="flex items-center mb-1 md:mb-0">
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[#1e293b] rounded border border-[#374151] text-[#9ca3af]">Alt+D</kbd>
              <span className="text-[10px] text-[#9ca3af] ml-1.5">Dock</span>
            </div>
            <div className="flex items-center">
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[#1e293b] rounded border border-[#374151] text-[#9ca3af]">Alt+A</kbd>
              <span className="text-[10px] text-[#9ca3af] ml-1.5">AI</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
