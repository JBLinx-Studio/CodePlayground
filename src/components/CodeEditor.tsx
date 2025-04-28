
import React, { useEffect, useRef } from "react";
import { EditorView, basicSetup } from "@codemirror/basic-setup";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";

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

    // Create editor
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
            backgroundColor: "#151922",
            color: "#e4e5e7",
            height: "100%",
          },
          ".cm-content": {
            fontFamily: '"Monaco", "Menlo", "Ubuntu Mono", "Consolas", monospace',
            fontSize: "0.875rem",
          },
          ".cm-gutters": {
            backgroundColor: "#1c2333",
            color: "#9ca3af",
            border: "none",
          },
          ".cm-activeLine": { 
            backgroundColor: "rgba(55, 65, 81, 0.3)"
          },
          ".cm-activeLineGutter": {
            backgroundColor: "#242a38" 
          },
          ".cm-selectionMatch": { 
            backgroundColor: "rgba(99, 102, 241, 0.2)" 
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
  }, [language, editorRef.current]);

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
    <div className="flex-1 min-h-[100px] flex flex-col border-b border-[#374151] last:border-b-0">
      <div className="bg-[#1c2333] px-4 py-2 flex justify-between items-center">
        <span className="text-sm font-medium">{displayName}</span>
        <span
          className="text-xs px-2 py-1 rounded-md"
          style={{ backgroundColor: tagBgColor, color: tagColor }}
        >
          {language}
        </span>
      </div>
      <div className="flex-1 overflow-auto bg-[#151922] relative">
        <div ref={editorRef} className="absolute inset-0" />
      </div>
    </div>
  );
};
