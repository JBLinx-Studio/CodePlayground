
import { useRef, useEffect } from "react";
import { FileSystemProvider } from "@/contexts/FileSystemContext";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { AppHeader } from "@/components/AppHeader";
import { MobileControls } from "@/components/MobileControls";
import { EditorContainer } from "@/components/EditorContainer";
import { Toaster } from "sonner";
import { motion } from "framer-motion";
import { ThemeProvider } from "@/contexts/ThemeContext";

const Index = () => {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <FileSystemProvider>
          <LayoutProvider>
            <motion.div 
              className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-editor-darkbg via-editor-bg to-[#202739] text-editor-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <AppHeader />
              <MobileControls />
              <motion.div 
                className="flex-1 p-2 md:p-4 overflow-hidden"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <EditorContainer />
              </motion.div>
              <motion.footer 
                className="py-2 px-4 text-xs md:text-sm text-center text-[#9ca3af] bg-[#151922]/80 backdrop-blur-sm border-t border-[#2e3646] flex items-center justify-center gap-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <span>CodePlayground © {new Date().getFullYear()}</span>
                <span className="inline-block w-1 h-1 rounded-full bg-[#4b5563]"></span>
                <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent font-medium">Build amazing web experiences</span>
              </motion.footer>
              <Toaster 
                position="top-right" 
                richColors 
                closeButton 
                theme="dark"
                toastOptions={{
                  className: "backdrop-blur-md bg-[#1a1f2c]/70 border border-[#374151]/50",
                }}
              />
            </motion.div>
          </LayoutProvider>
        </FileSystemProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
};

export default Index;
