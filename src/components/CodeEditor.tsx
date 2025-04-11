
import { useRef, useEffect } from "react";

interface CodeEditorProps {
  language: string;
  displayName: string;
  value: string;
  onChange: (value: string) => void;
  tagColor: string;
  tagBgColor: string;
  lineNumbers?: boolean;
}

export const CodeEditor = ({ 
  language, 
  displayName, 
  value, 
  onChange,
  tagColor,
  tagBgColor,
  lineNumbers = true
}: CodeEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Update line numbers when content changes
  useEffect(() => {
    if (lineNumbers && lineNumbersRef.current) {
      const lines = value.split('\n');
      let lineNumbersHTML = '';
      
      for (let i = 1; i <= lines.length; i++) {
        lineNumbersHTML += `<div class="line-number">${i}</div>`;
      }
      
      lineNumbersRef.current.innerHTML = lineNumbersHTML;
    }
  }, [value, lineNumbers]);

  // Sync scroll between textarea and line numbers
  useEffect(() => {
    const textarea = textareaRef.current;
    const lineNumbersElement = lineNumbersRef.current;
    
    if (!textarea || !lineNumbersElement || !lineNumbers) return;
    
    const handleScroll = () => {
      lineNumbersElement.scrollTop = textarea.scrollTop;
    };
    
    textarea.addEventListener('scroll', handleScroll);
    return () => textarea.removeEventListener('scroll', handleScroll);
  }, [lineNumbers]);

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
      <div className="flex-1 overflow-auto bg-[#151922] flex">
        {lineNumbers && (
          <div 
            ref={lineNumbersRef} 
            className="line-numbers-container bg-[#1a1f2c] text-[#535966] text-right pr-2 pl-3 pt-4 text-sm font-mono select-none overflow-hidden"
          ></div>
        )}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`w-full h-full p-4 bg-[#151922] text-[#e4e5e7] font-mono text-sm resize-none border-none outline-none leading-relaxed ${lineNumbers ? 'pl-2' : 'pl-4'}`}
          spellCheck="false"
        />
      </div>
    </div>
  );
};
