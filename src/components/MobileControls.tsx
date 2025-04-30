
import React from 'react';
import { Button } from "@/components/ui/button";
import { useLayout } from '@/contexts/LayoutContext';
import { Layout, Code, Monitor, Sparkles } from "lucide-react";
import { motion } from 'framer-motion';

export const MobileControls: React.FC = () => {
  const { view, setView, showAiAssistant, setShowAiAssistant } = useLayout();

  return (
    <motion.div 
      className="md:hidden flex p-3 bg-[#151922] border-b border-[#374151] shadow-md"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex w-full bg-[#242a38] rounded-md overflow-hidden shadow-inner">
        <Button
          variant="ghost"
          className={`flex-1 px-2 py-1 h-8 transition-all duration-200 ${view === 'split' ? 'bg-[#374151] text-white shadow-inner' : 'text-[#9ca3af] hover:text-white'}`}
          onClick={() => setView('split')}
        >
          <Layout size={14} className="mr-1" />
          Split
        </Button>
        <Button
          variant="ghost"
          className={`flex-1 px-2 py-1 h-8 transition-all duration-200 ${view === 'editor' ? 'bg-[#374151] text-white shadow-inner' : 'text-[#9ca3af] hover:text-white'}`}
          onClick={() => setView('editor')}
        >
          <Code size={14} className="mr-1" />
          Code
        </Button>
        <Button
          variant="ghost"
          className={`flex-1 px-2 py-1 h-8 transition-all duration-200 ${view === 'preview' ? 'bg-[#374151] text-white shadow-inner' : 'text-[#9ca3af] hover:text-white'}`}
          onClick={() => setView('preview')}
        >
          <Monitor size={14} className="mr-1" />
          Result
        </Button>
        <Button
          variant="ghost"
          className={`flex-1 px-2 py-1 h-8 transition-all duration-200 ${showAiAssistant ? 'bg-[#374151] text-[#6366f1] shadow-inner' : 'text-[#9ca3af] hover:text-white'}`}
          onClick={() => setShowAiAssistant(!showAiAssistant)}
        >
          <Sparkles size={14} className={`${showAiAssistant ? 'animate-pulse-gentle' : ''} mr-1`} />
          AI
        </Button>
      </div>
    </motion.div>
  );
};
