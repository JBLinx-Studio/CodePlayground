
import React from 'react';
import { Button } from "@/components/ui/button";
import { useLayout } from '@/contexts/LayoutContext';
import { Layout, Code, Monitor, Sparkles, Pin } from "lucide-react";
import { motion } from 'framer-motion';
import { Tooltip } from "@/components/ui/tooltip";

export const MobileControls: React.FC = () => {
  const { view, setView, showAiAssistant, setShowAiAssistant, dockedFiles } = useLayout();

  return (
    <motion.div 
      className="md:hidden p-3 bg-gradient-to-r from-[#0c101a] to-[#151d2e] border-b border-[#2d3748]/70 shadow-md"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex w-full bg-gradient-to-b from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-[#2d3748]/40">
        <Button
          variant="ghost"
          className={`flex-1 px-2 py-1 h-12 transition-all duration-300 ${
            view === 'split' 
            ? 'bg-gradient-to-r from-[#4f46e5]/30 to-[#6366f1]/20 text-[#a5b4fc] shadow-inner border-t-2 border-[#6366f1]' 
            : 'text-[#9ca3af] hover:text-white'
          }`}
          onClick={() => setView('split')}
        >
          <div className="flex flex-col items-center justify-center">
            <Layout size={16} className="mb-1" />
            <span className="text-xs font-medium">Split</span>
            {dockedFiles.length > 0 && (
              <span className="absolute top-1 right-1 bg-[#6366f1] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {dockedFiles.length}
              </span>
            )}
          </div>
        </Button>
        <Button
          variant="ghost"
          className={`flex-1 px-2 py-1 h-12 transition-all duration-300 ${
            view === 'editor' 
            ? 'bg-gradient-to-r from-[#4f46e5]/30 to-[#6366f1]/20 text-[#a5b4fc] shadow-inner border-t-2 border-[#6366f1]' 
            : 'text-[#9ca3af] hover:text-white'
          }`}
          onClick={() => setView('editor')}
        >
          <div className="flex flex-col items-center justify-center">
            <Code size={16} className="mb-1" />
            <span className="text-xs font-medium">Code</span>
          </div>
        </Button>
        <Button
          variant="ghost"
          className={`flex-1 px-2 py-1 h-12 transition-all duration-300 ${
            view === 'preview' 
            ? 'bg-gradient-to-r from-[#4f46e5]/30 to-[#6366f1]/20 text-[#a5b4fc] shadow-inner border-t-2 border-[#6366f1]' 
            : 'text-[#9ca3af] hover:text-white'
          }`}
          onClick={() => setView('preview')}
        >
          <div className="flex flex-col items-center justify-center">
            <Monitor size={16} className="mb-1" />
            <span className="text-xs font-medium">Result</span>
          </div>
        </Button>
        <Button
          variant="ghost"
          className={`flex-1 px-2 py-1 h-12 transition-all duration-300 ${
            showAiAssistant 
            ? 'bg-gradient-to-r from-[#4f46e5]/30 to-[#6366f1]/20 text-[#a5b4fc] shadow-inner border-t-2 border-[#6366f1]' 
            : 'text-[#9ca3af] hover:text-white'
          }`}
          onClick={() => setShowAiAssistant(!showAiAssistant)}
        >
          <div className="flex flex-col items-center justify-center">
            <Sparkles size={16} className={`${showAiAssistant ? 'animate-pulse text-[#6366f1]' : ''} mb-1`} />
            <span className="text-xs font-medium">AI</span>
          </div>
        </Button>
      </div>
      
      <div className="mt-2 px-2">
        <div className="text-[10px] text-[#9ca3af] flex items-center justify-between">
          <div>
            <span className="mr-1">⌘</span> + <span className="mx-1">1-3</span>: Switch views
          </div>
          <div>
            <span className="mr-1">Alt</span> + <span className="mx-1">D</span>: Dock file
          </div>
        </div>
      </div>
    </motion.div>
  );
}
