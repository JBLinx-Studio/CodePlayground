
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/CodeEditor";
import { PreviewPanel } from "@/components/PreviewPanel";
import { Github, RefreshCw, Trash2, Code } from "lucide-react";

// Default code templates
const defaultHTML = `<!-- Write your HTML here -->
<div class="container">
  <h1>Hello, World!</h1>
  <p>Welcome to CodePlayground</p>
</div>`;

const defaultCSS = `/* Write your CSS here */
.container {
  text-align: center;
  font-family: sans-serif;
  padding: 2rem;
}

h1 {
  color: #6366f1;
}`;

const defaultJS = `// Write your JavaScript here
console.log("CodePlayground is running!");`;

const Index = () => {
  const [html, setHtml] = useState(defaultHTML);
  const [css, setCss] = useState(defaultCSS);
  const [js, setJs] = useState(defaultJS);
  const [panelWidth, setPanelWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = window.innerWidth <= 768;

  // Initialize editors with stored code or defaults
  useEffect(() => {
    const savedData = localStorage.getItem('codeplayground-data');
    
    if (savedData) {
      try {
        const { html: savedHtml, css: savedCss, js: savedJs } = JSON.parse(savedData);
        setHtml(savedHtml || defaultHTML);
        setCss(savedCss || defaultCSS);
        setJs(savedJs || defaultJS);
      } catch (e) {
        console.error('Failed to load saved code:', e);
        resetToDefaults();
      }
    }
  }, []);

  // Save to localStorage whenever code changes
  useEffect(() => {
    saveToLocalStorage();
  }, [html, css, js]);

  // Handle resize events
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const newWidth = startWidthRef.current + (e.clientX - startXRef.current);
      const widthPercentage = (newWidth / containerWidth) * 100;
      
      // Limit min/max width
      if (widthPercentage >= 20 && widthPercentage <= 80) {
        setPanelWidth(widthPercentage);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        // Mobile layout
        document.body.classList.add('mobile-layout');
      } else {
        // Desktop layout
        document.body.classList.remove('mobile-layout');
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const startResize = (e: React.MouseEvent) => {
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = containerRef.current ? containerRef.current.offsetWidth * (panelWidth / 100) : 0;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const resetToDefaults = () => {
    setHtml(defaultHTML);
    setCss(defaultCSS);
    setJs(defaultJS);
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all code?')) {
      setHtml('<!-- Write your HTML here -->');
      setCss('/* Write your CSS here */');
      setJs('// Write your JavaScript here');
    }
  };

  const saveToLocalStorage = () => {
    const codeData = { html, css, js };
    localStorage.setItem('codeplayground-data', JSON.stringify(codeData));
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#1a1f2c] text-[#e4e5e7]">
      {/* Header */}
      <header className="bg-[#151922] border-b border-[#374151] px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="text-[#6366f1]">
            <Code size={24} />
          </div>
          <h1 className="text-xl font-semibold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
            CodePlayground
          </h1>
        </div>
        <div className="flex gap-4 items-center">
          <Button 
            variant="ghost" 
            onClick={resetToDefaults}
            className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38] flex items-center gap-1"
          >
            <RefreshCw size={18} />
            <span>Reset</span>
          </Button>
          <Button 
            variant="ghost" 
            onClick={clearAll}
            className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38] flex items-center gap-1"
          >
            <Trash2 size={18} />
            <span>Clear All</span>
          </Button>
          <Button 
            variant="ghost" 
            asChild
            className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38] flex items-center gap-1"
          >
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github size={18} />
              <span>GitHub</span>
            </a>
          </Button>
        </div>
      </header>

      {/* Editor Container */}
      <div className="flex flex-1 overflow-hidden" ref={containerRef}>
        {/* Editors Panel */}
        <div 
          className={`flex flex-col ${isMobile ? 'w-full h-[60%]' : ''}`}
          style={{ width: isMobile ? '100%' : `${panelWidth}%` }}
        >
          <CodeEditor 
            language="html"
            displayName="HTML"
            value={html}
            onChange={setHtml}
            tagColor="#ef4444"
            tagBgColor="rgba(239, 68, 68, 0.2)"
          />
          <CodeEditor 
            language="css"
            displayName="CSS"
            value={css}
            onChange={setCss}
            tagColor="#3b82f6"
            tagBgColor="rgba(59, 130, 246, 0.2)"
          />
          <CodeEditor 
            language="javascript"
            displayName="JS"
            value={js}
            onChange={setJs}
            tagColor="#f59e0b"
            tagBgColor="rgba(245, 158, 11, 0.2)"
          />
        </div>

        {/* Resize Handle */}
        {!isMobile && (
          <div 
            className="w-2 bg-[#374151] hover:bg-[#6366f1] cursor-col-resize transition-colors"
            onMouseDown={startResize}
          />
        )}

        {/* Preview Panel */}
        <PreviewPanel html={html} css={css} js={js} />
      </div>
    </div>
  );
};

export default Index;
