
import React, { useEffect } from 'react';
import { useLayout } from '@/contexts/LayoutContext';
import { toast } from "sonner";

export const KeyboardShortcuts: React.FC = () => {
  const { 
    view, 
    setView, 
    toggleFullscreen, 
    showAiAssistant,
    setShowAiAssistant 
  } = useLayout();
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger shortcuts when not in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // Ctrl/Cmd + key shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            setView('editor');
            toast.info("Switched to editor view");
            break;
          case '2':
            e.preventDefault();
            setView('preview');
            toast.info("Switched to preview view");
            break;
          case '3':
            e.preventDefault();
            setView('split');
            toast.info("Switched to split view");
            break;
          case 'a':
            e.preventDefault();
            setShowAiAssistant(!showAiAssistant);
            toast.info(showAiAssistant ? "AI Assistant hidden" : "AI Assistant shown");
            break;
          case 'f':
            e.preventDefault();
            toggleFullscreen();
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setView, toggleFullscreen, showAiAssistant, setShowAiAssistant]);
  
  // This is a headless component that just adds keyboard shortcuts
  return null;
};
