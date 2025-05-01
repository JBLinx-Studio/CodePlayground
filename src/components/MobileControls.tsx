
import React from 'react';
import { Button } from "@/components/ui/button";
import { useLayout } from '@/contexts/LayoutContext';
import { Layout, Code, Monitor, Sparkles } from "lucide-react";
import { motion } from 'framer-motion';

export const MobileControls: React.FC = () => {
  const { view, setView, showAiAssistant, setShowAiAssistant } = useLayout();

  return (
    <motion.div 
      className="md:hidden flex p-4 bg-gradient-to-r from-[#0f172a] to-[#1e293b] border-b border-[#334155] shadow-lg"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex w-full bg-[#0f172a]/70 backdrop-blur-md rounded-xl overflow-hidden shadow-inner border border-[#334155]/40">
        <Button
          variant="ghost"
          className={`flex-1 px-2 py-1.5 h-12 rounded-none transition-all duration-200 ${
            view === 'split' 
            ? 'bg-gradient-to-b from-[#334155]/80 to-[#475569]/60 text-[#a5b4fc] shadow-inner border-b-2 border-[#8b5cf6]' 
            : 'text-[#94a3b8] hover:text-white'
          }`}
          onClick={() => setView('split')}
        >
          <Layout size={18} className="mr-1.5" />
          Split
        </Button>
        <Button
          variant="ghost"
          className={`flex-1 px-2 py-1.5 h-12 rounded-none transition-all duration-200 ${
            view === 'editor' 
            ? 'bg-gradient-to-b from-[#334155]/80 to-[#475569]/60 text-[#a5b4fc] shadow-inner border-b-2 border-[#8b5cf6]' 
            : 'text-[#94a3b8] hover:text-white'
          }`}
          onClick={() => setView('editor')}
        >
          <Code size={18} className="mr-1.5" />
          Code
        </Button>
        <Button
          variant="ghost"
          className={`flex-1 px-2 py-1.5 h-12 rounded-none transition-all duration-200 ${
            view === 'preview' 
            ? 'bg-gradient-to-b from-[#334155]/80 to-[#475569]/60 text-[#a5b4fc] shadow-inner border-b-2 border-[#8b5cf6]' 
            : 'text-[#94a3b8] hover:text-white'
          }`}
          onClick={() => setView('preview')}
        >
          <Monitor size={18} className="mr-1.5" />
          Preview
        </Button>
        <Button
          variant="ghost"
          className={`flex-1 px-2 py-1.5 h-12 rounded-none transition-all duration-200 ${
            showAiAssistant 
            ? 'bg-gradient-to-b from-[#6d28d9]/30 to-[#7c3aed]/20 text-[#c4b5fd] shadow-inner border-b-2 border-[#8b5cf6]' 
            : 'text-[#94a3b8] hover:text-white'
          }`}
          onClick={() => setShowAiAssistant(!showAiAssistant)}
        >
          <Sparkles size={18} className={`${showAiAssistant ? 'animate-pulse text-[#c4b5fd]' : ''} mr-1.5`} />
          AI Help
        </Button>
      </div>
    </motion.div>
  );
}
