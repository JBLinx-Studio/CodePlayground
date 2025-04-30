
import React from 'react';
import { Button } from "@/components/ui/button";
import { useLayout } from '@/contexts/LayoutContext';
import { Layout, Code, Monitor, Sparkles } from "lucide-react";
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const MobileControls: React.FC = () => {
  const { view, setView, showAiAssistant, setShowAiAssistant } = useLayout();

  const container = {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="md:hidden flex p-3 bg-gradient-to-r from-[#151922] to-[#1a1f2c] border-b border-[#374151] shadow-md"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="flex w-full bg-[#242a38]/70 backdrop-blur-sm rounded-lg overflow-hidden shadow-inner border border-[#374151]/30">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div variants={item} className="flex-1">
                <Button
                  variant="ghost"
                  className={`flex-1 w-full px-2 py-1 h-10 transition-all duration-200 ${view === 'split' ? 'bg-[#374151] text-[#a5b4fc] shadow-inner' : 'text-[#9ca3af] hover:text-white'}`}
                  onClick={() => setView('split')}
                >
                  <Layout size={16} className="mr-1" />
                  Split
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Split View (Alt+2)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div variants={item} className="flex-1">
                <Button
                  variant="ghost"
                  className={`flex-1 w-full px-2 py-1 h-10 transition-all duration-200 ${view === 'editor' ? 'bg-[#374151] text-[#a5b4fc] shadow-inner' : 'text-[#9ca3af] hover:text-white'}`}
                  onClick={() => setView('editor')}
                >
                  <Code size={16} className="mr-1" />
                  Code
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Editor View (Alt+1)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div variants={item} className="flex-1">
                <Button
                  variant="ghost"
                  className={`flex-1 w-full px-2 py-1 h-10 transition-all duration-200 ${view === 'preview' ? 'bg-[#374151] text-[#a5b4fc] shadow-inner' : 'text-[#9ca3af] hover:text-white'}`}
                  onClick={() => setView('preview')}
                >
                  <Monitor size={16} className="mr-1" />
                  Result
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Preview View (Alt+3)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div variants={item} className="flex-1">
                <Button
                  variant="ghost"
                  className={`flex-1 w-full px-2 py-1 h-10 transition-all duration-200 ${showAiAssistant ? 'bg-[#374151] text-[#6366f1] shadow-inner' : 'text-[#9ca3af] hover:text-white'}`}
                  onClick={() => setShowAiAssistant(!showAiAssistant)}
                >
                  <Sparkles size={16} className={`${showAiAssistant ? 'animate-pulse text-[#6366f1]' : ''} mr-1`} />
                  AI
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>AI Assistant (Alt+A)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  );
}
