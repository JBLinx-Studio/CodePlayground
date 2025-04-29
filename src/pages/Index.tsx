
import { useRef } from "react";
import { FileSystemProvider } from "@/contexts/FileSystemContext";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppHeader } from "@/components/AppHeader";
import { MobileControls } from "@/components/MobileControls";
import { EditorContainer } from "@/components/EditorContainer";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { Toaster } from "sonner";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <FileSystemProvider>
          <LayoutProvider>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-[#151922] to-[#1a1f2c] text-[#e4e5e7] dark:bg-gradient-to-br dark:from-[#151922] dark:to-[#1a1f2c] light:bg-gradient-to-br light:from-[#f8fafc] light:to-[#f1f5f9] light:text-[#1e293b]"
            >
              <AppHeader />
              <MobileControls />
              <div className="flex-1 p-2 md:p-4 overflow-hidden">
                <EditorContainer />
              </div>
              <footer className="py-2 px-4 text-xs text-center text-[#9ca3af] bg-[#151922] border-t border-[#2e3646] dark:bg-[#151922] dark:border-[#2e3646] light:bg-white light:border-gray-200 light:text-gray-500 flex items-center justify-center gap-2">
                <span>CodePlayground © {new Date().getFullYear()}</span>
                <span className="inline-block w-1 h-1 rounded-full bg-[#4b5563]"></span>
                <motion.span 
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent"
                >
                  Build amazing web experiences
                </motion.span>
              </footer>
              <KeyboardShortcuts />
              <Toaster position="top-right" richColors closeButton />
            </motion.div>
          </LayoutProvider>
        </FileSystemProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
};

export default Index;
