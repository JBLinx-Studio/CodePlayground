
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLayout } from "@/contexts/LayoutContext";
import { useFileSystem } from "@/contexts/FileSystemContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useSettings } from "@/contexts/SettingsContext";
import { motion } from "framer-motion";
import { 
  Github, 
  Settings, 
  Download, 
  Copy, 
  Code, 
  LayoutSplit, 
  Monitor,
  Moon,
  Sun,
  Laptop,
  MoreVertical,
  Sparkles,
  RefreshCw,
  FullscreenIcon
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const AppHeader: React.FC = () => {
  const { view, setView, toggleFullscreen, isFullscreen } = useLayout();
  const { resetToDefaults, clearAll, copyCode, downloadCode } = useFileSystem();
  const { theme, setTheme } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0 }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon size={16} />;
      case 'light':
        return <Sun size={16} />;
      case 'system':
        return <Laptop size={16} />;
      default:
        return <Moon size={16} />;
    }
  };

  const getThemeText = () => {
    switch (theme) {
      case 'dark':
        return 'Dark';
      case 'light':
        return 'Light';
      case 'system':
        return 'System';
      default:
        return 'Dark';
    }
  };

  const cycleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
      toast.info('Light theme activated');
    } else if (theme === 'light') {
      setTheme('system');
      toast.info('System theme activated');
    } else {
      setTheme('dark');
      toast.info('Dark theme activated');
    }
  };

  return (
    <motion.header 
      className="bg-gradient-to-r from-[#0f111a] to-[#1a1f2c] border-b border-[#2e3646] py-3 px-4 flex justify-between items-center shadow-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Code size={20} className="text-white" />
          </div>
          <h1 className="text-lg font-semibold text-white hidden sm:block">CodePlayground</h1>
        </motion.div>
      </div>

      <motion.div 
        className="flex items-center space-x-1 md:space-x-2"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <TooltipProvider>
          {/* Desktop View Controls */}
          <div className="hidden md:flex items-center gap-1 mr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div variants={item}>
                  <Button 
                    variant={view === 'editor' ? "secondary" : "ghost"} 
                    size="sm"
                    onClick={() => setView('editor')}
                    className="h-8 gap-1"
                  >
                    <Code size={16} />
                    <span className="hidden md:inline-block">Editor</span>
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editor View (Alt+1)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div variants={item}>
                  <Button 
                    variant={view === 'split' ? "secondary" : "ghost"} 
                    size="sm"
                    onClick={() => setView('split')}
                    className="h-8 gap-1"
                  >
                    <LayoutSplit size={16} />
                    <span className="hidden md:inline-block">Split</span>
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Split View (Alt+2)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div variants={item}>
                  <Button 
                    variant={view === 'preview' ? "secondary" : "ghost"} 
                    size="sm"
                    onClick={() => setView('preview')}
                    className="h-8 gap-1"
                  >
                    <Monitor size={16} />
                    <span className="hidden md:inline-block">Preview</span>
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Preview View (Alt+3)</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* AI Assistant Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div variants={item}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    const { showAiAssistant, setShowAiAssistant } = useLayout();
                    setShowAiAssistant(!showAiAssistant);
                  }}
                  className="h-8"
                >
                  <Sparkles size={16} className="text-[#a855f7]" />
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>AI Assistant (Alt+A)</p>
            </TooltipContent>
          </Tooltip>

          {/* Theme Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div variants={item}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={cycleTheme} 
                  className="h-8"
                >
                  {getThemeIcon()}
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getThemeText()} Theme</p>
            </TooltipContent>
          </Tooltip>

          {/* Fullscreen Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div variants={item}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleFullscreen} 
                  className="h-8"
                >
                  <FullscreenIcon size={16} />
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Fullscreen (F11)</p>
            </TooltipContent>
          </Tooltip>

          {/* GitHub Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div variants={item}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => window.open('https://github.com', '_blank')} 
                  className="h-8"
                >
                  <Github size={16} />
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>View on GitHub</p>
            </TooltipContent>
          </Tooltip>

          {/* More Menu Dropdown */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div variants={item}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8">
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>More Actions</p>
              </TooltipContent>
            </Tooltip>
            
            <DropdownMenuContent className="w-56 bg-[#1a1f2c] border-[#2e3646] text-[#e4e5e7]">
              <DropdownMenuItem 
                onClick={() => {
                  copyCode();
                }}
                className="cursor-pointer flex gap-2 items-center"
              >
                <Copy size={14} />
                <span>Copy Code</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => {
                  downloadCode();
                }}
                className="cursor-pointer flex gap-2 items-center"
              >
                <Download size={14} />
                <span>Download Files</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-[#2e3646]" />
              
              <DropdownMenuItem 
                onClick={() => {
                  resetToDefaults();
                }}
                className="cursor-pointer flex gap-2 items-center"
              >
                <RefreshCw size={14} />
                <span>Reset to Defaults</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => {
                  setIsSettingsOpen(true);
                }}
                className="cursor-pointer flex gap-2 items-center"
              >
                <Settings size={14} />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Settings Dialog */}
          <Dialog 
            open={isSettingsOpen} 
            onOpenChange={setIsSettingsOpen}
          >
            <DialogContent className="bg-[#1a1f2c] border-[#2e3646] text-[#e4e5e7]">
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
                <DialogDescription>
                  Customize your CodePlayground experience
                </DialogDescription>
              </DialogHeader>
              <SettingsPanel onClose={() => setIsSettingsOpen(false)} />
            </DialogContent>
          </Dialog>
        </TooltipProvider>
      </motion.div>
    </motion.header>
  );
};

const SettingsPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { settings, updateSettings } = useSettings();
  
  return (
    <div className="py-4 space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Font Size</label>
        <select 
          value={settings.fontSize}
          onChange={(e) => updateSettings({ fontSize: e.target.value })}
          className="w-full p-2 rounded bg-[#151922] border border-[#2e3646] text-[#e4e5e7]"
        >
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Tab Size</label>
        <select 
          value={settings.tabSize}
          onChange={(e) => updateSettings({ tabSize: parseInt(e.target.value) })}
          className="w-full p-2 rounded bg-[#151922] border border-[#2e3646] text-[#e4e5e7]"
        >
          <option value="2">2 spaces</option>
          <option value="4">4 spaces</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={settings.autoUpdate}
            onChange={(e) => updateSettings({ autoUpdate: e.target.checked })}
            className="rounded bg-[#151922] border border-[#2e3646]"
          />
          <span className="text-sm font-medium">Auto Update Preview</span>
        </label>
      </div>
      
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={settings.showLineNumbers}
            onChange={(e) => updateSettings({ showLineNumbers: e.target.checked })}
            className="rounded bg-[#151922] border border-[#2e3646]"
          />
          <span className="text-sm font-medium">Show Line Numbers</span>
        </label>
      </div>
      
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={settings.autoCloseBrackets}
            onChange={(e) => updateSettings({ autoCloseBrackets: e.target.checked })}
            className="rounded bg-[#151922] border border-[#2e3646]"
          />
          <span className="text-sm font-medium">Auto Close Brackets</span>
        </label>
      </div>
      
      <div className="pt-4 flex justify-end">
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};
