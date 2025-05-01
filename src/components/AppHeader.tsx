
import React from 'react';
import { Button } from "@/components/ui/button";
import { useLayout } from '@/contexts/LayoutContext';
import { useFileSystem } from '@/contexts/FileSystemContext';
import { useSettings } from '@/contexts/SettingsContext';
import { toast } from "sonner";
import { 
  RefreshCw, 
  Trash2, 
  Code, 
  Download, 
  Copy, 
  Maximize, 
  Minimize,
  Monitor,
  Columns,
  Sparkles,
  Laptop,
  Github,
  Settings,
  Menu
} from "lucide-react";
import { GitHubIntegration } from "@/components/GitHubIntegration";
import { AdvancedSettings } from "@/components/AdvancedSettings";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";

export const AppHeader: React.FC = () => {
  const { 
    view, 
    setView, 
    isFullscreen, 
    toggleFullscreen,
    showAiAssistant,
    setShowAiAssistant,
    isMobile
  } = useLayout();
  
  const { 
    resetToDefaults, 
    clearAll, 
    copyCode, 
    downloadCode 
  } = useFileSystem();

  const { settings, updateSettings } = useSettings();

  const handleCopyCode = () => {
    copyCode();
    toast.success("Code copied to clipboard");
  };

  const handleDownloadCode = () => {
    downloadCode();
    toast.success("Code downloaded successfully");
  };

  return (
    <>
      <motion.header 
        className="bg-gradient-to-r from-[#0f1117] to-[#1a1f2c] border-b border-[#2d3748] px-4 py-3 flex justify-between items-center shadow-md"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <motion.div 
            className="text-[#6366f1]"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <Code size={24} />
          </motion.div>
          <motion.h1 
            className="text-xl font-semibold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent hover:from-[#818cf8] hover:to-[#d946ef] transition-all duration-300"
            whileHover={{ scale: 1.03 }}
          >
            CodePlayground
          </motion.h1>
        </div>
        
        <div className="hidden md:flex items-center gap-2">
          <motion.div 
            className="flex bg-[#1e293b]/80 rounded-md overflow-hidden shadow-inner border border-[#2d3748]/30"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Button
              variant="ghost"
              className={`px-3 py-1 h-8 transition-all duration-200 ${view === 'split' ? 'bg-gradient-to-r from-[#2d3748]/80 to-[#374151]/60 text-white shadow-inner' : 'text-[#9ca3af] hover:text-white'}`}
              onClick={() => setView('split')}
            >
              <Columns size={14} className="mr-1" />
              Split
            </Button>
            <Button
              variant="ghost"
              className={`px-3 py-1 h-8 transition-all duration-200 ${view === 'editor' ? 'bg-gradient-to-r from-[#2d3748]/80 to-[#374151]/60 text-white shadow-inner' : 'text-[#9ca3af] hover:text-white'}`}
              onClick={() => setView('editor')}
            >
              <Laptop size={14} className="mr-1" />
              Editor
            </Button>
            <Button
              variant="ghost"
              className={`px-3 py-1 h-8 transition-all duration-200 ${view === 'preview' ? 'bg-gradient-to-r from-[#2d3748]/80 to-[#374151]/60 text-white shadow-inner' : 'text-[#9ca3af] hover:text-white'}`}
              onClick={() => setView('preview')}
            >
              <Monitor size={14} className="mr-1" />
              Preview
            </Button>
          </motion.div>
        </div>
        
        <div className="flex gap-1 md:gap-2 items-center">
          <Button 
            variant="ghost" 
            onClick={handleCopyCode}
            className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#2d3748] md:flex items-center gap-1 hidden"
            title="Copy code"
          >
            <Copy size={16} />
            <span className="hidden lg:inline">Copy</span>
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={handleDownloadCode}
            className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#2d3748] md:flex items-center gap-1 hidden"
            title="Download code"
          >
            <Download size={16} />
            <span className="hidden lg:inline">Download</span>
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={() => setShowAiAssistant(!showAiAssistant)}
            className={`text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#2d3748] items-center gap-1 ${showAiAssistant ? 'bg-[#1e293b]/80 text-[#6366f1]' : ''}`}
            title="AI Assistant"
          >
            <Sparkles size={16} className={`${showAiAssistant ? 'animate-pulse' : ''}`} />
            <span className="hidden lg:inline">AI</span>
          </Button>
          
          <GitHubIntegration files={{}} />
          
          {!isMobile ? (
            <AdvancedSettings 
              settings={settings}
              onUpdateSettings={updateSettings}
            />
          ) : (
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#2d3748]"
                >
                  <Settings size={16} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#1a1f2c] border-l border-[#2d3748] text-[#e4e5e7]">
                <AdvancedSettings 
                  settings={settings}
                  onUpdateSettings={updateSettings}
                />
              </SheetContent>
            </Sheet>
          )}
          
          <Button 
            variant="ghost" 
            onClick={resetToDefaults}
            className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#2d3748] flex items-center gap-1 transition-all duration-200 hover:rotate-180"
            title="Reset to defaults"
          >
            <RefreshCw size={16} />
            <span className="hidden md:inline">Reset</span>
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={clearAll}
            className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#2d3748] flex items-center gap-1 transition-colors"
            title="Clear all"
          >
            <Trash2 size={16} />
            <span className="hidden md:inline">Clear</span>
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={toggleFullscreen}
            className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#2d3748] transition-transform hover:scale-110"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </Button>

          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#2d3748] md:hidden"
                >
                  <Menu size={16} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] bg-[#1a1f2c] border-l border-[#2d3748] text-[#e4e5e7]">
                <div className="py-4">
                  <h3 className="text-sm font-medium mb-2">View</h3>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      className={`justify-start ${view === 'split' ? 'bg-[#2d3748]/80 text-[#a5b4fc]' : ''}`}
                      onClick={() => setView('split')}
                    >
                      <Columns size={16} className="mr-2" />
                      Split
                    </Button>
                    <Button
                      variant="ghost"
                      className={`justify-start ${view === 'editor' ? 'bg-[#2d3748]/80 text-[#a5b4fc]' : ''}`}
                      onClick={() => setView('editor')}
                    >
                      <Laptop size={16} className="mr-2" />
                      Editor
                    </Button>
                    <Button
                      variant="ghost"
                      className={`justify-start ${view === 'preview' ? 'bg-[#2d3748]/80 text-[#a5b4fc]' : ''}`}
                      onClick={() => setView('preview')}
                    >
                      <Monitor size={16} className="mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </motion.header>
    </>
  );
};
