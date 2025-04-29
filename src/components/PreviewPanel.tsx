
import { useEffect, useRef, useState } from "react";
import { RefreshCw, Smartphone, Tablet, Monitor, ExternalLink, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PreviewPanelProps {
  html: string;
  css: string;
  js: string;
}

export const PreviewPanel = ({ html, css, js }: PreviewPanelProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<{type: 'log' | 'error' | 'warn'; content: string}[]>([]);
  
  const updatePreview = () => {
    if (!iframeRef.current) return;
    
    const iframe = iframeRef.current;
    const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
    
    if (!iframeDocument) return;
    
    setIsLoading(true);
    
    // Capture console logs
    const consoleLogScript = `
      const originalConsole = console;
      console = {
        log: function() {
          originalConsole.log.apply(originalConsole, arguments);
          window.parent.postMessage({
            type: 'console-log',
            level: 'log',
            content: Array.from(arguments).map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')
          }, '*');
        },
        error: function() {
          originalConsole.error.apply(originalConsole, arguments);
          window.parent.postMessage({
            type: 'console-log',
            level: 'error',
            content: Array.from(arguments).map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')
          }, '*');
        },
        warn: function() {
          originalConsole.warn.apply(originalConsole, arguments);
          window.parent.postMessage({
            type: 'console-log',
            level: 'warn',
            content: Array.from(arguments).map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')
          }, '*');
        },
        info: originalConsole.info,
        debug: originalConsole.debug
      };
      
      window.onerror = function(message, source, lineno, colno, error) {
        window.parent.postMessage({
          type: 'console-log',
          level: 'error',
          content: message + ' at line ' + lineno + ':' + colno
        }, '*');
        return false;
      };
    `;
    
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
        <script>${consoleLogScript}</script>
        <script>${js}</script>
      </body>
      </html>
    `;
    
    // Update the iframe content
    iframeDocument.open();
    iframeDocument.write(combinedOutput);
    iframeDocument.close();
    
    // Handle the loading state
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };
  
  // Listen for console messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'console-log') {
        setConsoleOutput(prev => [
          ...prev, 
          { 
            type: event.data.level as 'log' | 'error' | 'warn', 
            content: event.data.content 
          }
        ]);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  
  // Update preview when code changes
  useEffect(() => {
    updatePreview();
    setConsoleOutput([]); // Clear console on code change
  }, [html, css, js]);
  
  const handleOpenExternalPreview = () => {
    const blob = new Blob([
      `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${css}</style>
        <title>CodePlayground Preview</title>
      </head>
      <body>${html}
        <script>${js}</script>
      </body>
      </html>`
    ], { type: 'text/html' });
    
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const copyPreviewUrl = () => {
    const blob = new Blob([
      `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${css}</style>
        <title>CodePlayground Preview</title>
      </head>
      <body>${html}
        <script>${js}</script>
      </body>
      </html>`
    ], { type: 'text/html' });
    
    const url = URL.createObjectURL(blob);
    navigator.clipboard.writeText(url)
      .then(() => toast.success('Preview URL copied to clipboard'))
      .catch(err => toast.error('Failed to copy preview URL'));
  };
  
  const getIframeClasses = () => {
    switch (viewportSize) {
      case 'mobile':
        return 'w-[320px] h-full border-0 mx-auto';
      case 'tablet':
        return 'w-[768px] h-full border-0 mx-auto';
      default:
        return 'w-full h-full border-0';
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="bg-[#1c2333] px-4 py-2 flex justify-between items-center">
        <span className="text-sm font-medium">Preview</span>
        <div className="flex gap-1 items-center">
          <div className="flex bg-[#242a38] rounded-md overflow-hidden mr-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setViewportSize('mobile')}
              className={`h-7 w-7 p-0 ${viewportSize === 'mobile' ? 'bg-[#374151] text-white' : 'text-[#9ca3af]'}`}
              title="Mobile View"
            >
              <Smartphone size={14} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setViewportSize('tablet')}
              className={`h-7 w-7 p-0 ${viewportSize === 'tablet' ? 'bg-[#374151] text-white' : 'text-[#9ca3af]'}`}
              title="Tablet View"
            >
              <Tablet size={14} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setViewportSize('desktop')}
              className={`h-7 w-7 p-0 ${viewportSize === 'desktop' ? 'bg-[#374151] text-white' : 'text-[#9ca3af]'}`}
              title="Desktop View"
            >
              <Monitor size={14} />
            </Button>
          </div>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={copyPreviewUrl}
            className="h-7 w-7 p-0 text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38]"
            title="Copy Preview URL"
          >
            <Copy size={14} />
          </Button>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleOpenExternalPreview}
            className="h-7 w-7 p-0 text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38]"
            title="Open in New Tab"
          >
            <ExternalLink size={14} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={updatePreview}
            className="h-7 w-7 p-0 text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38]"
            title="Refresh Preview"
          >
            <RefreshCw size={14} />
          </Button>
        </div>
      </div>
      <div className="flex-1 bg-white overflow-auto flex flex-col">
        <div className={`flex-1 ${viewportSize !== 'desktop' ? 'flex justify-center bg-[#f0f0f0]' : ''}`}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366f1]"></div>
            </div>
          )}
          <iframe 
            ref={iframeRef}
            title="preview" 
            className={getIframeClasses()}
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
        
        {/* Console Output */}
        {consoleOutput.length > 0 && (
          <div className="h-32 bg-[#1c2333] text-white overflow-auto p-2 border-t border-[#374151]">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium">Console</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConsoleOutput([])}
                className="h-6 p-1 text-xs text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38]"
              >
                Clear
              </Button>
            </div>
            <div>
              {consoleOutput.map((log, index) => (
                <div
                  key={index}
                  className={`text-xs font-mono mb-1 ${
                    log.type === 'error' ? 'text-red-400' : log.type === 'warn' ? 'text-amber-300' : 'text-gray-300'
                  }`}
                >
                  &gt; {log.content}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
