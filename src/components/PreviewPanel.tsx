
import { useEffect, useRef, useState } from "react";
import { RefreshCw, Smartphone, Tablet, Monitor, ExternalLink, Copy, Terminal, X, Server, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { motion, AnimatePresence } from "framer-motion";
import { mockBackend, createMockFetchForIframe } from "@/utils/MockBackendService";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFileSystem } from "@/contexts/FileSystemContext";

interface PreviewPanelProps {
  html: string;
  css: string;
  js: string;
  showBackendPanel?: boolean;
  onToggleBackendPanel?: () => void;
}

export const PreviewPanel = ({ 
  html, 
  css, 
  js, 
  showBackendPanel = false,
  onToggleBackendPanel
}: PreviewPanelProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<{type: 'log' | 'error' | 'warn'; content: string}[]>([]);
  const [showConsole, setShowConsole] = useState(false);
  const [previewTab, setPreviewTab] = useState<string>("browser");
  const { files, currentFile, getCurrentFileType } = useFileSystem();
  
  // Handle mock fetch requests from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'mock-fetch') {
        const { url, options } = event.data;
        
        // Process request using mock backend
        mockBackend.fetch(url, options)
          .then(async (response) => {
            const contentType = response.headers.get('Content-Type');
            let data;
            
            if (contentType && contentType.includes('application/json')) {
              data = await response.json();
            } else {
              data = await response.text();
            }
            
            // Convert headers to plain object
            const headers: Record<string, string> = {};
            response.headers.forEach((value, key) => {
              headers[key] = value;
            });
            
            // Send response back to iframe
            if (iframeRef.current && iframeRef.current.contentWindow) {
              iframeRef.current.contentWindow.postMessage({
                type: 'mock-fetch-response',
                url,
                response: {
                  data,
                  status: response.status,
                  headers
                }
              }, '*');
            }
          })
          .catch(error => {
            console.error('Mock backend error:', error);
            
            // Send error response back to iframe
            if (iframeRef.current && iframeRef.current.contentWindow) {
              iframeRef.current.contentWindow.postMessage({
                type: 'mock-fetch-response',
                url,
                response: {
                  data: { error: 'Internal server error' },
                  status: 500,
                  headers: { 'Content-Type': 'application/json' }
                }
              }, '*');
            }
          });
      }
      
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
    
    // Add mock fetch implementation
    const mockFetchScript = createMockFetchForIframe();
    
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
        <script>${mockFetchScript}</script>
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
    toast.success("Preview opened in new tab");
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

  // Helper to render different file types in preview mode
  const renderFilePreview = () => {
    const fileType = getCurrentFileType(currentFile);
    const fileContent = files[currentFile]?.content || '';

    switch (fileType) {
      case 'html':
        return (
          <div className="h-full w-full bg-white">
            <iframe
              srcDoc={fileContent}
              title="HTML Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        );
        
      case 'css':
        return (
          <div className="p-4 h-full overflow-auto">
            <div className="p-4 rounded-md bg-[#f8fafc]">
              <pre className="text-sm font-mono text-[#334155] overflow-auto whitespace-pre-wrap">
                {fileContent}
              </pre>
            </div>
            <div className="mt-6 p-6 rounded-lg border border-[#e2e8f0]">
              <h3 className="text-lg font-medium mb-3">CSS Preview</h3>
              <iframe
                srcDoc={`
                  <html>
                    <head>
                      <style>${fileContent}</style>
                    </head>
                    <body>
                      <div class="preview-element">Element with your CSS</div>
                      <p>Paragraph element</p>
                      <button>Button</button>
                      <div class="container">Container</div>
                    </body>
                  </html>
                `}
                title="CSS Preview"
                className="w-full h-[300px] border rounded-md"
              ></iframe>
            </div>
          </div>
        );
          
      case 'svg':
        return (
          <div className="h-full w-full bg-white flex items-center justify-center p-4">
            <div 
              className="svg-container bg-[#f8fafc] p-6 rounded-lg border border-[#e2e8f0] max-w-2xl"
              dangerouslySetInnerHTML={{ __html: fileContent }}
            />
          </div>
        );
          
      case 'json':
        let formattedJson = '';
        let jsonObject = null;
        try {
          jsonObject = JSON.parse(fileContent);
          formattedJson = JSON.stringify(jsonObject, null, 2);
        } catch {
          formattedJson = "Invalid JSON";
        }
        
        return (
          <div className="p-4 h-full overflow-auto">
            <div className="rounded-md bg-[#1a1f2c] p-4 shadow-inner">
              <pre className="text-sm font-mono text-[#e2e8f0] overflow-auto">
                {formattedJson}
              </pre>
            </div>
            {jsonObject && (
              <div className="mt-6 bg-[#f8fafc] rounded-lg p-4 border border-[#e2e8f0]">
                <h3 className="text-sm font-medium mb-2 text-[#64748b]">Object Preview</h3>
                <div className="json-tree">
                  {Object.entries(jsonObject).map(([key, value]) => (
                    <div key={key} className="mb-2">
                      <span className="text-[#0284c7] font-medium">{key}: </span>
                      <span className="text-[#334155]">
                        {typeof value === 'object' 
                          ? JSON.stringify(value) 
                          : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
          
      case 'md':
        // Simple MD to HTML conversion
        const mdToHtml = (md: string) => {
          return md
            .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold my-4">$1</h1>')
            .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold my-3">$1</h2>')
            .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold my-2">$1</h3>')
            .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-gray-100 font-mono text-sm">$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/^\s*>(.+)$/gm, '<blockquote class="pl-4 border-l-4 border-gray-300 italic my-2">$1</blockquote>')
            .replace(/^- (.+)$/gm, '<li class="ml-6 list-disc">$1</li>')
            .replace(/\n\n/g, '<br><br>');
        };
        
        return (
          <div className="flex flex-col h-full">
            <Tabs defaultValue="preview" className="h-full flex flex-col">
              <TabsList className="w-full justify-start bg-[#f1f5f9] border-b p-0 h-10">
                <TabsTrigger value="preview" className="px-4 h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#6366f1]">
                  Preview
                </TabsTrigger>
                <TabsTrigger value="source" className="px-4 h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#6366f1]">
                  Source
                </TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="flex-1 p-6 overflow-auto bg-white">
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: mdToHtml(fileContent) }} />
              </TabsContent>
              <TabsContent value="source" className="flex-1 p-4 overflow-auto bg-[#1a1f2c]">
                <pre className="text-sm font-mono text-[#e2e8f0]">{fileContent}</pre>
              </TabsContent>
            </Tabs>
          </div>
        );
          
      case 'sql':
        return (
          <div className="p-4 h-full overflow-auto bg-[#1a1f2c] text-white">
            <h3 className="text-lg mb-3">SQL Preview</h3>
            <pre className="text-sm font-mono text-[#e2e8f0] overflow-auto whitespace-pre-wrap bg-[#151922] p-4 rounded-md">
              {fileContent}
            </pre>
            <div className="mt-6 p-4 rounded-md bg-[#151922] border border-[#374151]">
              <h4 className="text-md mb-2 text-[#9ca3af]">SQL Execution (Simulated)</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-[#1a1f2c] border border-[#374151]">
                  <thead>
                    <tr className="bg-[#1e293b]">
                      <th className="px-4 py-2 text-left text-xs font-medium text-[#9ca3af]">id</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[#9ca3af]">name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[#9ca3af]">email</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-[#374151]">
                      <td className="px-4 py-2 text-sm text-[#e2e8f0]">1</td>
                      <td className="px-4 py-2 text-sm text-[#e2e8f0]">John Doe</td>
                      <td className="px-4 py-2 text-sm text-[#e2e8f0]">john@example.com</td>
                    </tr>
                    <tr className="border-t border-[#374151]">
                      <td className="px-4 py-2 text-sm text-[#e2e8f0]">2</td>
                      <td className="px-4 py-2 text-sm text-[#e2e8f0]">Jane Smith</td>
                      <td className="px-4 py-2 text-sm text-[#e2e8f0]">jane@example.com</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
          
      case 'tsx':
      case 'jsx':
      case 'ts':
      case 'js':
        return (
          <div className="h-full flex flex-col">
            <div className="p-4 bg-[#1a1f2c] text-white flex-1 overflow-auto">
              <pre className="text-sm font-mono text-[#e2e8f0] whitespace-pre-wrap">{fileContent}</pre>
            </div>
            <div className="p-4 bg-[#0f172a] border-t border-[#374151]">
              <p className="text-[#9ca3af] text-sm">
                {fileType === 'tsx' || fileType === 'jsx' 
                  ? 'React components require a build process to preview. Try adding them to an HTML file to see them in action.' 
                  : 'JavaScript/TypeScript files run in the browser when referenced in HTML.'}
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-center p-8">
              <FileCode size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">Preview not available</h3>
              <p className="text-gray-500">This file type doesn't support direct preview.</p>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="bg-[#1c2333] px-4 py-2 flex justify-between items-center border-b border-[#2e3646]">
        <span className="text-sm font-medium flex items-center">
          <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
          Preview
        </span>
        <div className="flex gap-1 items-center">
          {/* Preview Tabs */}
          <Tabs
            value={previewTab}
            onValueChange={setPreviewTab}
            className="mr-2"
          >
            <TabsList className="h-7 p-1 bg-[#242a38]">
              <TabsTrigger
                value="browser"
                className="h-5 px-2 text-xs data-[state=active]:bg-[#374151] data-[state=active]:text-white"
              >
                Browser
              </TabsTrigger>
              <TabsTrigger
                value="file"
                className="h-5 px-2 text-xs data-[state=active]:bg-[#374151] data-[state=active]:text-white"
              >
                File
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
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
            onClick={toggleConsole}
            className={`h-7 w-7 p-0 text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38] ${showConsole ? 'bg-[#242a38] text-[#6366f1]' : ''} ${consoleOutput.some(log => log.type === 'error') ? 'text-red-400' : ''}`}
            title="Toggle Console"
          >
            <Terminal size={14} />
          </Button>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={onToggleBackendPanel}
            className={`h-7 w-7 p-0 text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38] ${showBackendPanel ? 'bg-[#242a38] text-[#6366f1]' : ''}`}
            title="Toggle Backend Panel"
          >
            <Server size={14} />
          </Button>

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
      <div className="flex-1 overflow-auto flex flex-col">
        <TabsContent value="browser" className="flex-1" hidden={previewTab !== 'browser'}>
          <div className={`flex-1 bg-white ${viewportSize !== 'desktop' ? 'flex justify-center bg-[#f0f0f0]' : ''}`}>
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
        
        <TabsContent value="file" className="flex-1 h-full" hidden={previewTab !== 'file'}>
          <ScrollArea className="h-full">
            {renderFilePreview()}
          </ScrollArea>
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
