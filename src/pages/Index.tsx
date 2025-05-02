
import React from "react";
import { motion } from "framer-motion";
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
          <motion.div 
            className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-[#070a13] via-[#0c111d] to-[#121a27] text-[#f1f5f9]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AppHeader />
            <MobileControls />
            <div className="flex-1 p-1 md:p-3 overflow-hidden">
              <EditorContainer />
            </div>
            <motion.footer 
              className="py-2 px-4 text-xs text-center text-[#9ca3af] bg-gradient-to-r from-[#0a0e17]/70 to-[#111827]/70 backdrop-blur-sm border-t border-[#2d3748]/50 flex items-center justify-center gap-2"
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
                className: "backdrop-blur-md bg-[#1a1f2c]/80 border border-[#374151]/50 shadow-2xl",
                duration: 3000,
              }}
            />
          </motion.div>
        </LayoutProvider>
      </FileSystemProvider>
    </SettingsProvider>
  );
};

export default Index;
