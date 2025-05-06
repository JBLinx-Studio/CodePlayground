
import React, { useEffect, useRef, useState } from "react";
import { basicSetup } from "@codemirror/basic-setup";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { useSettings } from "@/contexts/SettingsContext";
import { motion, AnimatePresence } from "framer-motion";
import { FileCode, FileText, File, Copy, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface CodeEditorProps {
  language: string;
  displayName: string;
  value: string;
  onChange: (value: string) => void;
  tagColor: string;
  tagBgColor: string;
  isActive?: boolean;
  onSelect?: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  displayName,
  value,
  onChange,
  tagColor,
  tagBgColor,
  isActive = true,
  onSelect,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const { settings } = useSettings();
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Helper function to get icon based on language
  const getFileIcon = () => {
    switch (language) {
      case "html":
        return <FileText size={16} className="text-[#f06529]" />;
      case "css":
        return <File size={16} className="text-[#2965f1]" />; // Changed from FileCss to File
      default:
        return <FileCode size={16} className="text-[#f7df1e]" />;
    }
  };

  // Handle code copying
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(`Copied ${displayName} to clipboard`);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  useEffect(() => {
    if (!editorRef.current) return;

    // Clean up previous editor instance
    if (viewRef.current) {
      viewRef.current.destroy();
    }

    // Determine language
    let languageExtension;
    switch (language) {
      case "html":
        languageExtension = html();
        break;
      case "css":
        languageExtension = css();
        break;
      default:
        languageExtension = javascript();
        break;
    }

    // Create editor with enhanced theme
    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        languageExtension,
        EditorView.updateListener.of((v) => {
          if (v.docChanged) {
            onChange(v.state.doc.toString());
          }
        }),
        EditorView.theme({
          "&": {
            backgroundColor: settings.theme === 'dark' ? "#0f1117" : "#f8f9fa",
            color: settings.theme === 'dark' ? "#f8f9fa" : "#1e293b",
            height: "100%",
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontSize: settings.fontSize,
            transition: "background-color 0.3s, color 0.3s",
          },
          ".cm-content": {
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontSize: settings.fontSize,
            padding: "10px 0",
          },
          ".cm-gutters": {
            backgroundColor: settings.theme === 'dark' ? "#151922" : "#e9ecef",
            color: settings.theme === 'dark' ? "#9ca3af" : "#6c757d",
            border: "none",
            borderRight: settings.theme === 'dark' ? "1px solid #2d3748" : "1px solid #e2e8f0",
            transition: "background-color 0.3s, color 0.3s, border-color 0.3s",
            paddingRight: "8px",
            minWidth: "40px",
            display: "flex",
            justifyContent: "flex-end",
          },
          ".cm-lineNumbers": {
            color: settings.theme === 'dark' ? "#64748b" : "#94a3b8",
          },
          ".cm-activeLineGutter": {
            backgroundColor: settings.theme === 'dark' ? "#1a202c" : "#cbd5e1",
            color: settings.theme === 'dark' ? "#7c3aed" : "#6366f1",
            fontWeight: "bold",
            borderRadius: "2px",
          },
          ".cm-activeLine": { 
            backgroundColor: settings.theme === 'dark' ? "rgba(45, 55, 72, 0.4)" : "rgba(225, 235, 245, 0.7)",
            borderRadius: "2px",
          },
          ".cm-selectionMatch": { 
            backgroundColor: settings.theme === 'dark' ? "rgba(124, 58, 237, 0.2)" : "rgba(99, 102, 241, 0.2)",
            borderRadius: "2px",
          },
          ".cm-matchingBracket": {
            backgroundColor: settings.theme === 'dark' ? "rgba(124, 58, 237, 0.3)" : "rgba(99, 102, 241, 0.3)",
            borderBottom: "2px solid #7c3aed",
            borderRadius: "2px",
          },
          ".cm-cursor": {
            borderLeft: settings.theme === 'dark' ? "2px solid #a78bfa" : "2px solid #8b5cf6",
          },
          ".cm-line": {
            padding: "0 10px",
          },
          // Enhanced syntax highlighting with smoother transitions
          ".cm-keyword": { 
            color: settings.theme === 'dark' ? "#f472b6" : "#db2777", 
            fontWeight: "bold",
            transition: "color 0.3s",
          },
          ".cm-property": { 
            color: settings.theme === 'dark' ? "#93c5fd" : "#3b82f6",
            transition: "color 0.3s",
          },
          ".cm-string": { 
            color: settings.theme === 'dark' ? "#a5b4fc" : "#6366f1",
            transition: "color 0.3s", 
          },
          ".cm-function": { 
            color: settings.theme === 'dark' ? "#c4b5fd" : "#8b5cf6", 
            fontWeight: "500",
            transition: "color 0.3s",
          },
          ".cm-comment": { 
            color: settings.theme === 'dark' ? "#6b7280" : "#9ca3af", 
            fontStyle: "italic",
            transition: "color 0.3s",
          },
          ".cm-number": { 
            color: settings.theme === 'dark' ? "#fb923c" : "#ea580c",
            transition: "color 0.3s",
          },
          ".cm-atom": { 
            color: settings.theme === 'dark' ? "#e879f9" : "#d946ef",
            transition: "color 0.3s",
          },
          ".cm-operator": { 
            color: settings.theme === 'dark' ? "#d1d5db" : "#4b5563",
            transition: "color 0.3s",
          },
          ".cm-meta": { 
            color: settings.theme === 'dark' ? "#94a3b8" : "#64748b",
            transition: "color 0.3s",
          },
          ".cm-tag": { 
            color: settings.theme === 'dark' ? "#f87171" : "#ef4444",
            transition: "color 0.3s",
          },
          ".cm-attribute": { 
            color: settings.theme === 'dark' ? "#fcd34d" : "#f59e0b",
            transition: "color 0.3s",
          },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, [language, editorRef.current, settings.theme, settings.fontSize]);

  useEffect(() => {
    if (viewRef.current && viewRef.current.state.doc.toString() !== value) {
      const start = viewRef.current.state.selection.main.from;
      const end = viewRef.current.state.selection.main.to;
      
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: value
        },
        selection: { anchor: Math.min(start, value.length), head: Math.min(end, value.length) }
      });
    }
  }, [value]);

  return (
    <motion.div 
      className={`flex-1 min-h-[100px] flex flex-col border ${
        isActive ? 'border-[#6366f1]/50' : 'border-[#2d3748]'
      } dark:border-[#374151] overflow-hidden rounded-lg mb-4 shadow-lg ${
        isActive ? 'ring-2 ring-[#6366f1]/30' : ''
      } transition-all duration-300 hover:shadow-xl`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onSelect}
      whileHover={{ y: -2 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div 
        className={`px-4 py-2 flex justify-between items-center ${
          isActive 
            ? 'bg-gradient-to-r from-[#1a1f2c]/95 to-[#252b3b]/95 border-b-2 border-[#6366f1]' 
            : 'bg-gradient-to-r from-[#151922]/95 to-[#1a1f2c]/95 border-b border-[#2d3748]/50'
        } transition-colors duration-300`}
      >
        <span className="text-sm font-medium text-white flex items-center gap-2">
          {getFileIcon()}
          {displayName}
        </span>
        
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {(hovered || copied) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard();
                }}
                className={`p-1 rounded transition-colors duration-200 ${
                  copied 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-[#374151]/30 text-[#9ca3af] hover:text-white hover:bg-[#374151]/50'
                }`}
                aria-label="Copy code"
              >
                {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
              </motion.button>
            )}
          </AnimatePresence>
          
          <motion.span
            className="text-xs px-2 py-1 rounded-md font-mono transition-all duration-300"
            style={{ backgroundColor: tagBgColor, color: tagColor }}
            whileHover={{ scale: 1.05 }}
          >
            {language}
          </motion.span>
        </div>
      </div>
      <div className="flex-1 overflow-hidden bg-[#0f1117] dark:bg-[#151922] relative min-h-[200px]">
        <div ref={editorRef} className="absolute inset-0 overflow-auto" />
      </div>
      {isActive && (
        <motion.div 
          className="h-1 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};
