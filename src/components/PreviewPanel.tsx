
import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewPanelProps {
  html: string;
  css: string;
  js: string;
}

export const PreviewPanel = ({ html, css, js }: PreviewPanelProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  // Generate and update preview
  const updatePreview = () => {
    if (!iframeRef.current) return;
    
    const combinedOutput = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${css}</style>
      </head>
      <body>${html}
        <script>${js}</script>
      </body>
      </html>
    `;
    
    const iframe = iframeRef.current;
    const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
    
    if (iframeDocument) {
      iframeDocument.open();
      iframeDocument.write(combinedOutput);
      iframeDocument.close();
    }
  };

  // Update preview when code changes (with debounce)
  useEffect(() => {
    if (!autoRefresh) return;
    
    const timer = setTimeout(() => {
      updatePreview();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [html, css, js, autoRefresh]);

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-[#1c2333] px-4 py-2 flex justify-between items-center">
        <span className="text-sm font-medium">Preview</span>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={updatePreview}
          className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38] h-8 w-8"
        >
          <RefreshCw size={16} />
        </Button>
      </div>
      <div className="flex-1 bg-white overflow-auto">
        <iframe 
          ref={iframeRef}
          title="preview" 
          sandbox="allow-scripts allow-same-origin"
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
};
