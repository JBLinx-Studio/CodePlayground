
import React, { useEffect, useRef, useState } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { useSettings } from "@/contexts/SettingsContext";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy, Check, Tag } from "lucide-react";
import { toast } from "sonner";

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
  const { theme, systemTheme } = useTheme();
  const [copied, setCopied] = useState(false);
  
  const effectiveTheme = theme === 'system' ? systemTheme : theme;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Code copied to clipboard");
    
    // Reset copied state after 2 seconds
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
            backgroundColor: effectiveTheme === 'dark' ? "#151922" : "#f8f9fa",
            color: effectiveTheme === 'dark' ? "#e4e5e7" : "#212529",
            height: "100%",
            fontFamily: '"JetBrains Mono", "Fira Code", "Monaco", "Menlo", "Ubuntu Mono", "Consolas", monospace',
          },
          ".cm-content": {
            fontFamily: '"JetBrains Mono", "Fira Code", "Monaco", "Menlo", "Ubuntu Mono", "Consolas", monospace',
            fontSize: settings.fontSize,
            padding: "10px 0",
          },
          ".cm-gutters": {
            backgroundColor: effectiveTheme === 'dark' ? "#1c2333" : "#e9ecef",
            color: effectiveTheme === 'dark' ? "#9ca3af" : "#6c757d",
            border: "none",
            borderRight: effectiveTheme === 'dark' ? "1px solid #2e3646" : "1px solid #dee2e6",
          },
          ".cm-activeLine": { 
            backgroundColor: effectiveTheme === 'dark' ? "rgba(55, 65, 81, 0.3)" : "rgba(230, 235, 244, 0.5)"
          },
          ".cm-activeLineGutter": {
            backgroundColor: effectiveTheme === 'dark' ? "#242a38" : "#dee2e6",
            color: effectiveTheme === 'dark' ? "#6366f1" : "#6366f1",
            fontWeight: "bold",
          },
          ".cm-selectionMatch": { 
            backgroundColor: effectiveTheme === 'dark' ? "rgba(99, 102, 241, 0.2)" : "rgba(59, 130, 246, 0.2)" 
          },
          ".cm-matchingBracket": {
            backgroundColor: effectiveTheme === 'dark' ? "rgba(99, 102, 241, 0.3)" : "rgba(59, 130, 246, 0.3)",
            border: "1px solid rgba(99, 102, 241, 0.5)",
          },
          ".cm-cursor": {
            borderLeft: effectiveTheme === 'dark' ? "2px solid #a855f7" : "2px solid #8b5cf6",
          },
          ".cm-line": {
            padding: "0 10px",
          }
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
  }, [language, editorRef.current, settings.theme, settings.fontSize, effectiveTheme]);

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
      className="flex-1 min-h-[100px] flex flex-col border-b border-[#374151] last:border-b-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-[#1c2333] px-4 py-2 flex justify-between items-center">
        <span className="text-sm font-medium flex items-center gap-2">
          <span className="opacity-70">{displayName}</span>
        </span>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={copyToClipboard}
                  className="p-1.5 text-xs rounded-md transition-all duration-200 hover:bg-[#2e3646]"
                >
                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-[#9ca3af]" />}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy code</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <span
            className="text-xs px-2 py-1 rounded-md transition-all duration-300 hover:opacity-80 flex items-center gap-1"
            style={{ backgroundColor: tagBgColor, color: tagColor }}
          >
            <Tag size={10} />
            {language}
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-[#151922] relative">
        <div ref={editorRef} className="absolute inset-0" />
      </div>
    </motion.div>
  );
};
