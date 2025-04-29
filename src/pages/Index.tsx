
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
          <div className="h-screen flex flex-col overflow-hidden bg-[#1a1f2c] text-[#e4e5e7]">
            <AppHeader />
            <MobileControls />
            <EditorContainer />
          </div>
        </LayoutProvider>
      </FileSystemProvider>
    </SettingsProvider>
  );
};

export default Index;
