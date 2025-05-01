
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
            backgroundColor: settings.theme === 'dark' ? "#030712" : "#f8fafc",
            color: settings.theme === 'dark' ? "#f1f5f9" : "#1e293b",
            height: "100%",
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontSize: settings.fontSize,
          },
          ".cm-content": {
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontSize: settings.fontSize,
            padding: "12px 0",
            lineHeight: "1.6",
          },
          ".cm-gutters": {
            backgroundColor: settings.theme === 'dark' ? "#0f172a" : "#f1f5f9",
            color: settings.theme === 'dark' ? "#94a3b8" : "#64748b",
            border: "none",
            borderRight: settings.theme === 'dark' ? "1px solid #334155" : "1px solid #cbd5e1",
            paddingRight: "8px",
          },
          ".cm-activeLine": { 
            backgroundColor: settings.theme === 'dark' ? "rgba(51, 65, 85, 0.4)" : "rgba(241, 245, 249, 0.7)"
          },
          ".cm-activeLineGutter": {
            backgroundColor: settings.theme === 'dark' ? "#1e293b" : "#e2e8f0",
            color: settings.theme === 'dark' ? "#8b5cf6" : "#6366f1",
            fontWeight: "bold",
          },
          ".cm-selectionMatch": { 
            backgroundColor: settings.theme === 'dark' ? "rgba(139, 92, 246, 0.2)" : "rgba(99, 102, 241, 0.2)" 
          },
          ".cm-matchingBracket": {
            backgroundColor: settings.theme === 'dark' ? "rgba(139, 92, 246, 0.3)" : "rgba(99, 102, 241, 0.3)",
            borderBottom: "2px solid #8b5cf6",
          },
          ".cm-cursor": {
            borderLeft: settings.theme === 'dark' ? "2px solid #c4b5fd" : "2px solid #8b5cf6",
          },
          ".cm-line": {
            padding: "0 12px",
          },
          ".cm-keyword": { color: settings.theme === 'dark' ? "#f472b6" : "#db2777" },
          ".cm-property": { color: settings.theme === 'dark' ? "#93c5fd" : "#3b82f6" },
          ".cm-string": { color: settings.theme === 'dark' ? "#c4b5fd" : "#8b5cf6" },
          ".cm-function": { color: settings.theme === 'dark' ? "#d8b4fe" : "#9333ea" },
          ".cm-comment": { color: settings.theme === 'dark' ? "#64748b" : "#94a3b8" },
          ".cm-variable": { color: settings.theme === 'dark' ? "#f1f5f9" : "#1e293b" },
          ".cm-number": { color: settings.theme === 'dark' ? "#fb923c" : "#ea580c" },
          ".cm-atom": { color: settings.theme === 'dark' ? "#fb7185" : "#e11d48" },
          ".cm-meta": { color: settings.theme === 'dark' ? "#38bdf8" : "#0284c7" },
          ".cm-tag": { color: settings.theme === 'dark' ? "#2dd4bf" : "#0d9488" },
          ".cm-attribute": { color: settings.theme === 'dark' ? "#fdba74" : "#ea580c" },
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
      className="flex-1 min-h-[100px] flex flex-col border-b border-[#334155] dark:border-[#475569] last:border-b-0 overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] dark:from-[#1e293b] dark:to-[#334155] px-4 py-2.5 flex justify-between items-center border-b border-[#334155]/50">
        <span className="text-sm font-medium text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#c084fc] shadow-[0_0_6px_#c084fc]"></span>
          {displayName}
        </span>
        <motion.span
          className="text-xs px-2.5 py-1 rounded-md font-mono transition-all duration-300 shadow-sm"
          style={{ backgroundColor: tagBgColor, color: tagColor }}
          whileHover={{ scale: 1.05 }}
        >
          {language}
        </motion.span>
      </div>
      <div className="flex-1 overflow-hidden bg-[#030712] dark:bg-[#0f172a] relative">
        <div ref={editorRef} className="absolute inset-0 overflow-auto" />
      </div>
    </motion.div>
  );
};
