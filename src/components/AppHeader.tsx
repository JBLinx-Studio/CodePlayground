
import React from 'react';
import { Button } from "@/components/ui/button";
import { useLayout } from '@/contexts/LayoutContext';
import { useFileSystem } from '@/contexts/FileSystemContext';
import { useSettings } from '@/contexts/SettingsContext';
import { 
  RefreshCw, 
  Trash2, 
  Code, 
  Download, 
  Copy, 
  Maximize, 
  Minimize,
  Monitor,
  Columns
} from "lucide-react";
import { GitHubIntegration } from "@/components/GitHubIntegration";
import { AdvancedSettings } from "@/components/AdvancedSettings";

export const AppHeader: React.FC = () => {
  const { 
    view, 
    setView, 
    isFullscreen, 
    toggleFullscreen,
    showAiAssistant,
    setShowAiAssistant
  } = useLayout();
  
  const { 
    resetToDefaults, 
    clearAll, 
    copyCode, 
    downloadCode 
  } = useFileSystem();

  const { settings, updateSettings } = useSettings();

  return (
    <>
      <header className="bg-[#151922] border-b border-[#374151] px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="text-[#6366f1]">
            <Code size={24} />
          </div>
          <h1 className="text-xl font-semibold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
            CodePlayground
          </h1>
        </div>
        
        <div className="hidden md:flex items-center gap-2">
          <div className="flex bg-[#242a38] rounded-md overflow-hidden">
            <Button
              variant="ghost"
              className={`px-3 py-1 h-8 ${view === 'split' ? 'bg-[#374151] text-white' : 'text-[#9ca3af]'}`}
              onClick={() => setView('split')}
            >
              <Columns size={14} className="mr-1" />
              Split
            </Button>
            <Button
              variant="ghost"
              className={`px-3 py-1 h-8 ${view === 'editor' ? 'bg-[#374151] text-white' : 'text-[#9ca3af]'}`}
              onClick={() => setView('editor')}
            >
              <Code size={14} className="mr-1" />
              Editor
            </Button>
            <Button
              variant="ghost"
              className={`px-3 py-1 h-8 ${view === 'preview' ? 'bg-[#374151] text-white' : 'text-[#9ca3af]'}`}
              onClick={() => setView('preview')}
            >
              <Monitor size={14} className="mr-1" />
              Preview
            </Button>
          </div>
        </div>
        
        <div className="flex gap-1 md:gap-2 items-center">
          <Button 
            variant="ghost" 
            onClick={copyCode}
            className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38] md:flex items-center gap-1 hidden"
          >
            <Copy size={16} />
            <span className="hidden lg:inline">Copy</span>
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={downloadCode}
            className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38] md:flex items-center gap-1 hidden"
          >
            <Download size={16} />
            <span className="hidden lg:inline">Download</span>
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={() => setShowAiAssistant(!showAiAssistant)}
            className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38] md:flex items-center gap-1 hidden"
          >
            <Code size={16} />
            <span className="hidden lg:inline">AI</span>
          </Button>
          
          <GitHubIntegration files={{}} /> {/* Will be replaced by global state */}
          
          <AdvancedSettings 
            settings={settings}
            onUpdateSettings={updateSettings}
          />
          
          <Button 
            variant="ghost" 
            onClick={resetToDefaults}
            className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38] flex items-center gap-1"
          >
            <RefreshCw size={16} />
            <span className="hidden md:inline">Reset</span>
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={clearAll}
            className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38] flex items-center gap-1"
          >
            <Trash2 size={16} />
            <span className="hidden md:inline">Clear</span>
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={toggleFullscreen}
            className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38]"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </Button>
        </div>
      </header>
    </>
  );
};
