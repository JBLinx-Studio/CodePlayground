
import { useEffect, useRef, useState } from "react";
import { RefreshCw, Smartphone, Tablet, Monitor, ExternalLink, Copy, Terminal, X, FileCode, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLanguageName, getFileIcon } from "@/components/utils/EditorUtils";
import { useFileSystem } from "@/contexts/FileSystemContext";

interface PreviewPanelProps {
  html: string;
  css: string;
  js: string;
  currentFileName: string;
}

export const PreviewPanel = ({ 
  html, 
  css, 
  js,
  currentFileName
}: PreviewPanelProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { files, getCurrentFileType } = useFileSystem();
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<{type: 'log' | 'error' | 'warn'; content: string}[]>([]);
  const [showConsole, setShowConsole] = useState(false);
  const [viewMode, setViewMode] = useState<'browser' | 'file'>('browser');
  
  // Handle console logs
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Handle console logs
      if (event.data && event.data.type === 'console-log') {
        setConsoleOutput(prev => [
          ...prev, 
          { 
            type: event.data.level as 'log' | 'error' | 'warn', 
            content: event.data.content 
          }
        ]);
        
        // Auto show console when there's an error
        if (event.data.level === 'error' && !showConsole) {
          setShowConsole(true);
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [showConsole]);
  
  const updatePreview = () => {
    if (!iframeRef.current || viewMode !== 'browser') return;
    
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
  
  // Update preview when code changes
  useEffect(() => {
    updatePreview();
    setConsoleOutput([]); // Clear console on code change
  }, [html, css, js, viewMode]);
  
  const handleOpenExternalPreview = () => {
    if (viewMode !== 'browser') {
      toast.error("External preview is only available for browser view");
      return;
    }
    
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
    toast.success("Preview opened in new tab");
  };

  const copyPreviewUrl = () => {
    if (viewMode !== 'browser') {
      // Copy file content instead
      const fileContent = files[currentFileName]?.content || '';
      navigator.clipboard.writeText(fileContent)
        .then(() => toast.success('File content copied to clipboard'))
        .catch(err => toast.error('Failed to copy file content'));
      return;
    }
    
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
        return 'w-[320px] h-full border-0 mx-auto shadow-lg';
      case 'tablet':
        return 'w-[768px] h-full border-0 mx-auto shadow-lg';
      default:
        return 'w-full h-full border-0';
    }
  };

  const toggleConsole = () => {
    setShowConsole(prev => !prev);
  };

  // Get file content for direct preview
  const getFileContent = () => {
    const fileContent = files[currentFileName]?.content || '';
    const fileType = getCurrentFileType(currentFileName);
    
    if (fileType === 'md') {
      // For markdown, we could render it properly if we had a markdown renderer
      return (
        <div className="bg-white p-6 font-mono whitespace-pre-wrap text-gray-800 h-full overflow-auto">
          {fileContent}
        </div>
      );
    }

    if (fileType === 'json') {
      // For JSON, try to pretty print it
      try {
        const parsedJson = JSON.parse(fileContent);
        return (
          <div className="bg-[#1a1f2c] p-6 font-mono whitespace-pre-wrap text-[#e4e5e7] h-full overflow-auto">
            {JSON.stringify(parsedJson, null, 2)}
          </div>
        );
      } catch (e) {
        return (
          <div className="bg-[#1a1f2c] p-6 font-mono whitespace-pre-wrap text-[#e4e5e7] h-full overflow-auto">
            {fileContent}
            <div className="text-red-400 mt-4">Invalid JSON format</div>
          </div>
        );
      }
    }

    // For all other files, just show as text
    return (
      <div className="bg-[#1a1f2c] p-6 font-mono whitespace-pre-wrap text-[#e4e5e7] h-full overflow-auto">
        {fileContent}
      </div>
    );
  };
  
  // Determine if the preview should show browser or direct file view
  useEffect(() => {
    // Check if current file can be shown in browser preview
    const fileType = getCurrentFileType(currentFileName);
    if (fileType === 'html') {
      setViewMode('browser');
    } else if (currentFileName === 'index.html') {
      setViewMode('browser');
    } else {
      setViewMode('file');
    }
  }, [currentFileName]);
  
  return (
    <div className="flex flex-col h-full">
      <div className="bg-[#1c2333] px-4 py-2 flex justify-between items-center border-b border-[#2e3646]">
        <Tabs className="w-full" value={viewMode} onValueChange={(v) => setViewMode(v as 'browser' | 'file')}>
          <div className="flex items-center justify-between w-full">
            <TabsList className="bg-[#242a38]">
              <TabsTrigger value="browser" className="flex gap-1 items-center text-xs">
                <Globe size={14} />
                Browser
              </TabsTrigger>
              <TabsTrigger value="file" className="flex gap-1 items-center text-xs">
                <FileCode size={14} />
                {getLanguageName(currentFileName)}
              </TabsTrigger>
            </TabsList>
          
            <div className="flex gap-1 items-center">
              {viewMode === 'browser' && (
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
              )}

              <Button 
                variant="ghost" 
                size="sm"
                onClick={toggleConsole}
                className={`h-7 w-7 p-0 text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38] ${showConsole ? 'bg-[#242a38] text-[#6366f1]' : ''} ${consoleOutput.some(log => log.type === 'error') ? 'text-red-400' : ''}`}
                title="Toggle Console"
              >
                <Terminal size={14} />
              </Button>

              <Button 
                variant="ghost" 
                size="sm"
                onClick={copyPreviewUrl}
                className="h-7 w-7 p-0 text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38]"
                title={viewMode === 'browser' ? "Copy Preview URL" : "Copy File Content"}
              >
                <Copy size={14} />
              </Button>

              {viewMode === 'browser' && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleOpenExternalPreview}
                  className="h-7 w-7 p-0 text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38]"
                  title="Open in New Tab"
                >
                  <ExternalLink size={14} />
                </Button>
              )}
              
              {viewMode === 'browser' && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={updatePreview}
                  className="h-7 w-7 p-0 text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38]"
                  title="Refresh Preview"
                >
                  <RefreshCw size={14} />
                </Button>
              )}
            </div>
          </div>
        </Tabs>
      </div>
      
      <div className="flex-1 overflow-auto flex flex-col">
        <TabsContent value="browser" className="flex-1 bg-white">
          <div className={`flex-1 ${viewportSize !== 'desktop' ? 'flex justify-center bg-[#f0f0f0] h-full' : ''}`}>
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
        </TabsContent>
        
        <TabsContent value="file" className="flex-1 h-full mt-0">
          {getFileContent()}
        </TabsContent>
        
        {/* Console Output */}
        <AnimatePresence>
          {showConsole && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-[#1c2333] text-white overflow-auto border-t border-[#374151]"
            >
              <div className="flex justify-between items-center p-2 border-b border-[#374151]">
                <div className="flex items-center">
                  <Terminal size={14} className="mr-2 text-[#9ca3af]" />
                  <span className="text-xs font-medium">Console</span>
                  <span className="ml-2 text-xs bg-[#374151] px-2 py-0.5 rounded-full text-[#9ca3af]">
                    {consoleOutput.length}
                  </span>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConsoleOutput([])}
                    className="h-6 p-1 text-xs text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38]"
                  >
                    Clear
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConsole(false)}
                    className="h-6 w-6 p-0 text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38]"
                  >
                    <X size={14} />
                  </Button>
                </div>
              </div>
              <div className="p-2 max-h-64 overflow-auto">
                {consoleOutput.length === 0 ? (
                  <div className="text-xs text-[#9ca3af] italic p-2">No console output yet...</div>
                ) : (
                  consoleOutput.map((log, index) => (
                    <div
                      key={index}
                      className={`text-xs font-mono mb-1 p-1 border-l-2 ${
                        log.type === 'error' ? 'text-red-400 border-red-500 bg-red-900/20' : 
                        log.type === 'warn' ? 'text-amber-300 border-amber-500 bg-amber-900/20' : 
                        'text-gray-300 border-blue-500 bg-blue-900/10'
                      }`}
                    >
                      {log.content}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
