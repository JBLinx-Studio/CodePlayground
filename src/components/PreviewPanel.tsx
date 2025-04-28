
import { useEffect, useRef } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewPanelProps {
  html: string;
  css: string;
  js: string;
}

export const PreviewPanel = ({ html, css, js }: PreviewPanelProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const updatePreview = () => {
    if (!iframeRef.current) return;
    
    const iframe = iframeRef.current;
    const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
    
    if (!iframeDocument) return;
    
    // Combine all code into a complete HTML document
    const combinedOutput = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap">
        <style>${css}</style>
      </head>
      <body>${html}
        <script>${js}</script>
      </body>
      </html>
    `;
    
    // Update the iframe content
    iframeDocument.open();
    iframeDocument.write(combinedOutput);
    iframeDocument.close();
  };
  
  // Update preview when code changes
  useEffect(() => {
    updatePreview();
  }, [html, css, js]);
  
  return (
    <div className="flex flex-col h-full">
      <div className="bg-[#1c2333] px-4 py-2 flex justify-between items-center">
        <span className="text-sm font-medium">Preview</span>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={updatePreview}
          className="h-8 w-8 p-0 text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38]"
        >
          <RefreshCw size={16} />
        </Button>
      </div>
      <div className="flex-1 bg-white overflow-auto">
        <iframe 
          ref={iframeRef}
          title="preview" 
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
};
