
import React, { useEffect, useRef } from "react";
import { basicSetup } from "@codemirror/basic-setup";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { useSettings } from "@/contexts/SettingsContext";
import { motion } from "framer-motion";

interface CodeEditorProps {
  language: string;
  displayName: string;
  value: string;
  onChange: (value: string) => void;
  tagColor: string;
  tagBgColor: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  displayName,
  value,
  onChange,
  tagColor,
  tagBgColor,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const { settings } = useSettings();

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
          },
          ".cm-content": {
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontSize: settings.fontSize,
            padding: "10px 0",
            lineHeight: "1.6"
          },
          ".cm-gutters": {
            backgroundColor: settings.theme === 'dark' ? "#151922" : "#e9ecef",
            color: settings.theme === 'dark' ? "#9ca3af" : "#6c757d",
            border: "none",
            borderRight: settings.theme === 'dark' ? "1px solid #2d3748" : "1px solid #e2e8f0",
          },
          ".cm-activeLine": { 
            backgroundColor: settings.theme === 'dark' ? "rgba(45, 55, 72, 0.4)" : "rgba(225, 235, 245, 0.7)"
          },
          ".cm-activeLineGutter": {
            backgroundColor: settings.theme === 'dark' ? "#1a202c" : "#cbd5e1",
            color: settings.theme === 'dark' ? "#7c3aed" : "#6366f1",
            fontWeight: "bold",
          },
          ".cm-selectionMatch": { 
            backgroundColor: settings.theme === 'dark' ? "rgba(124, 58, 237, 0.2)" : "rgba(99, 102, 241, 0.2)" 
          },
          ".cm-matchingBracket": {
            backgroundColor: settings.theme === 'dark' ? "rgba(124, 58, 237, 0.3)" : "rgba(99, 102, 241, 0.3)",
            borderBottom: "2px solid #7c3aed",
          },
          ".cm-cursor": {
            borderLeft: settings.theme === 'dark' ? "2px solid #a78bfa" : "2px solid #8b5cf6",
          },
          ".cm-line": {
            padding: "0 10px",
          },
          // Enhanced syntax highlighting
          ".cm-keyword": { color: settings.theme === 'dark' ? "#f472b6" : "#db2777", fontWeight: "bold" },
          ".cm-property": { color: settings.theme === 'dark' ? "#93c5fd" : "#3b82f6" },
          ".cm-string": { color: settings.theme === 'dark' ? "#a5b4fc" : "#6366f1" },
          ".cm-function": { color: settings.theme === 'dark' ? "#c4b5fd" : "#8b5cf6", fontWeight: "500" },
          ".cm-comment": { color: settings.theme === 'dark' ? "#6b7280" : "#9ca3af", fontStyle: "italic" },
          ".cm-operator": { color: settings.theme === 'dark' ? "#f59e0b" : "#d97706" },
          ".cm-number": { color: settings.theme === 'dark' ? "#10b981" : "#059669" },
          ".cm-def": { color: settings.theme === 'dark' ? "#60a5fa" : "#3b82f6", fontWeight: "500" },
          ".cm-variable": { color: settings.theme === 'dark' ? "#e4e5e7" : "#1e293b" },
          ".cm-variable-2": { color: settings.theme === 'dark' ? "#cbd5e1" : "#475569" },
          ".cm-atom": { color: settings.theme === 'dark' ? "#f43f5e" : "#be123c" },
          ".cm-tag": { color: settings.theme === 'dark' ? "#ef4444" : "#dc2626" },
          ".cm-attribute": { color: settings.theme === 'dark' ? "#f59e0b" : "#d97706" }
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
      className="flex-1 min-h-[100px] flex flex-col border-b border-[#2d3748] dark:border-[#374151] last:border-b-0 overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="bg-gradient-to-r from-[#151922] to-[#1a1f2c] dark:from-[#1c2333] dark:to-[#1e293b] px-4 py-2 flex justify-between items-center border-b border-[#2d3748]/50">
        <span className="text-sm font-medium text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#f472b6]"></span>
          {displayName}
        </span>
        <motion.span
          className="text-xs px-2 py-1 rounded-md font-mono transition-all duration-300"
          style={{ backgroundColor: tagBgColor, color: tagColor }}
          whileHover={{ scale: 1.05 }}
        >
          {language}
        </motion.span>
      </div>
      <div className="flex-1 overflow-hidden bg-[#0f1117] dark:bg-[#151922] relative shadow-inner">
        <div ref={editorRef} className="absolute inset-0 overflow-auto h-full" />
      </div>
    </motion.div>
  );
};
