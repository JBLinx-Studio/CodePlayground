
import React, { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdvancedSettingsProps {
  onUpdateSettings: (settings: {
    fontSize: string;
    tabSize: number;
    autoUpdate: boolean;
    theme: string;
    showLineNumbers: boolean;
    autoCloseBrackets: boolean;
    wordWrap: boolean;
    highlightActiveLine: boolean;
    keymap: string;
  }) => void;
  settings: {
    fontSize: string;
    tabSize: number;
    autoUpdate: boolean;
    theme: string;
    showLineNumbers: boolean;
    autoCloseBrackets: boolean;
    wordWrap: boolean;
    highlightActiveLine: boolean;
    keymap: string;
  };
}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  onUpdateSettings,
  settings,
}) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleChange = (key: string, value: any) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onUpdateSettings(localSettings);
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38] flex items-center gap-1"
        >
          <Settings size={18} />
          <span>Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1a1f2c] border border-[#374151] text-[#e4e5e7] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Advanced Editor Settings</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="editor" className="mt-4">
          <TabsList className="bg-[#242a38] border border-[#374151]">
            <TabsTrigger value="editor" className="data-[state=active]:bg-[#374151]">Editor</TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-[#374151]">Appearance</TabsTrigger>
            <TabsTrigger value="behavior" className="data-[state=active]:bg-[#374151]">Behavior</TabsTrigger>
            <TabsTrigger value="keymap" className="data-[state=active]:bg-[#374151]">Keymap</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="p-4 space-y-4 border border-[#374151] mt-2 rounded">
            <div className="space-y-2">
              <label className="text-sm text-[#9ca3af]">Font Size</label>
              <select
                value={localSettings.fontSize}
                onChange={(e) => handleChange("fontSize", e.target.value)}
                className="w-full p-2 bg-[#242a38] border border-[#374151] rounded text-[#e4e5e7]"
              >
                <option value="12px">12px</option>
                <option value="14px">14px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-[#9ca3af]">Tab Size</label>
              <select
                value={localSettings.tabSize}
                onChange={(e) => handleChange("tabSize", Number(e.target.value))}
                className="w-full p-2 bg-[#242a38] border border-[#374151] rounded text-[#e4e5e7]"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={8}>8 spaces</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showLineNumbers"
                checked={localSettings.showLineNumbers}
                onChange={(e) => handleChange("showLineNumbers", e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showLineNumbers" className="text-sm text-[#9ca3af]">
                Show Line Numbers
              </label>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance" className="p-4 space-y-4 border border-[#374151] mt-2 rounded">
            <div className="space-y-2">
              <label className="text-sm text-[#9ca3af]">Theme</label>
              <select
                value={localSettings.theme}
                onChange={(e) => handleChange("theme", e.target.value)}
                className="w-full p-2 bg-[#242a38] border border-[#374151] rounded text-[#e4e5e7]"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="dracula">Dracula</option>
                <option value="monokai">Monokai</option>
                <option value="github">GitHub</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="highlightActiveLine"
                checked={localSettings.highlightActiveLine}
                onChange={(e) => handleChange("highlightActiveLine", e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="highlightActiveLine" className="text-sm text-[#9ca3af]">
                Highlight Active Line
              </label>
            </div>
          </TabsContent>
          
          <TabsContent value="behavior" className="p-4 space-y-4 border border-[#374151] mt-2 rounded">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoUpdate"
                checked={localSettings.autoUpdate}
                onChange={(e) => handleChange("autoUpdate", e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="autoUpdate" className="text-sm text-[#9ca3af]">
                Auto Update Preview
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoCloseBrackets"
                checked={localSettings.autoCloseBrackets}
                onChange={(e) => handleChange("autoCloseBrackets", e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="autoCloseBrackets" className="text-sm text-[#9ca3af]">
                Auto Close Brackets
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="wordWrap"
                checked={localSettings.wordWrap}
                onChange={(e) => handleChange("wordWrap", e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="wordWrap" className="text-sm text-[#9ca3af]">
                Word Wrap
              </label>
            </div>
          </TabsContent>
          
          <TabsContent value="keymap" className="p-4 space-y-4 border border-[#374151] mt-2 rounded">
            <div className="space-y-2">
              <label className="text-sm text-[#9ca3af]">Keymap</label>
              <select
                value={localSettings.keymap}
                onChange={(e) => handleChange("keymap", e.target.value)}
                className="w-full p-2 bg-[#242a38] border border-[#374151] rounded text-[#e4e5e7]"
              >
                <option value="default">Default</option>
                <option value="vim">Vim</option>
                <option value="emacs">Emacs</option>
                <option value="sublime">Sublime</option>
                <option value="vscode">VS Code</option>
              </select>
            </div>
            
            <div className="mt-4 p-3 bg-[#242a38] rounded border border-[#374151]">
              <h4 className="text-sm font-medium mb-2">Common Keyboard Shortcuts</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-[#9ca3af]">
                <div>Save: <span className="bg-[#374151] px-1 py-0.5 rounded">Ctrl+S</span></div>
                <div>Find: <span className="bg-[#374151] px-1 py-0.5 rounded">Ctrl+F</span></div>
                <div>Replace: <span className="bg-[#374151] px-1 py-0.5 rounded">Ctrl+H</span></div>
                <div>Indent: <span className="bg-[#374151] px-1 py-0.5 rounded">Tab</span></div>
                <div>Comment: <span className="bg-[#374151] px-1 py-0.5 rounded">Ctrl+/</span></div>
                <div>Format: <span className="bg-[#374151] px-1 py-0.5 rounded">Alt+F</span></div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            className="text-[#9ca3af] border-[#374151] hover:bg-[#242a38]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[#6366f1] text-white hover:bg-[#4f46e5]"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
