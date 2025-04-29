
import { useRef } from "react";
import { FileSystemProvider } from "@/contexts/FileSystemContext";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { AppHeader } from "@/components/AppHeader";
import { MobileControls } from "@/components/MobileControls";
import { EditorContainer } from "@/components/EditorContainer";

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
            <footer className="py-2 px-4 text-xs text-center text-[#9ca3af] bg-[#151922] border-t border-[#2e3646]">
              CodePlayground © {new Date().getFullYear()} - Build amazing web experiences
            </footer>
          </div>
        </LayoutProvider>
      </FileSystemProvider>
    </SettingsProvider>
  );
};

export default Index;
