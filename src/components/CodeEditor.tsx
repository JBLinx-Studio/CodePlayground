
import { useRef, useEffect } from "react";

interface CodeEditorProps {
  language: string;
  displayName: string;
  value: string;
  onChange: (value: string) => void;
  tagColor: string;
  tagBgColor: string;
}

export const CodeEditor = ({ 
  language, 
  displayName, 
  value, 
  onChange,
  tagColor,
  tagBgColor
}: CodeEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle tab key in the editor
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = '  ';
      
      const newValue = textarea.value.substring(0, start) + spaces + textarea.value.substring(end);
      onChange(newValue);
      
      // Set cursor position after tab insertion
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
      }, 0);
    }
  };

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
      <div className="flex-1 overflow-auto bg-[#151922]">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-full p-4 bg-[#151922] text-[#e4e5e7] font-mono text-sm resize-none border-none outline-none leading-relaxed"
          spellCheck="false"
        />
      </div>
    </div>
  );
};
