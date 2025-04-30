
import { useRef } from "react";
import { FileSystemProvider } from "@/contexts/FileSystemContext";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { AppHeader } from "@/components/AppHeader";
import { MobileControls } from "@/components/MobileControls";
import { EditorContainer } from "@/components/EditorContainer";
import { Toaster } from "sonner";

const Index = () => {
  return (
    <SettingsProvider>
      <FileSystemProvider>
        <LayoutProvider>
          <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-[#151922] to-[#1a1f2c] text-[#e4e5e7]">
            <AppHeader />
            <MobileControls />
            <div className="flex-1 p-2 md:p-4 overflow-hidden">
              <EditorContainer />
            </div>
            <footer className="py-2 px-4 text-xs text-center text-[#9ca3af] bg-[#151922] border-t border-[#2e3646] flex items-center justify-center gap-2">
              <span>CodePlayground © {new Date().getFullYear()}</span>
              <span className="inline-block w-1 h-1 rounded-full bg-[#4b5563]"></span>
              <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">Build amazing web experiences</span>
            </footer>
            <Toaster position="top-right" richColors closeButton />
          </div>
        </LayoutProvider>
      </FileSystemProvider>
    </SettingsProvider>
  );
};

export default Index;
