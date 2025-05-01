
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
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
            className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-[#030712] via-[#0f172a] to-[#1e293b] text-[#f8fafc]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AppHeader />
            <MobileControls />
            <motion.div 
              className="flex-1 p-2 md:p-4 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <EditorContainer />
            </motion.div>
            <motion.footer 
              className="py-2 px-4 text-xs text-center text-[#94a3b8] bg-[#0f172a]/80 backdrop-blur-sm border-t border-[#334155] flex items-center justify-center gap-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <span>CodePlayground © {new Date().getFullYear()}</span>
              <span className="inline-block w-1 h-1 rounded-full bg-[#64748b]"></span>
              <span className="bg-gradient-to-r from-[#8b5cf6] to-[#c084fc] bg-clip-text text-transparent font-medium">
                Build amazing web experiences
              </span>
            </motion.footer>
            <Toaster 
              position="top-right" 
              richColors 
              closeButton 
              theme="dark"
              toastOptions={{
                className: "backdrop-blur-md bg-[#1e293b]/80 border border-[#475569]/50 shadow-xl",
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
