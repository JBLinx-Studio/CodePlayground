
import React, { useState, useRef, useEffect } from "react";
import { Code, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  visible: boolean;
  onClose: () => void;
  onInsertCode: (code: string) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ visible, onClose, onInsertCode }) => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      type: 'ai',
      content: "Hi! I'm your coding assistant. I can help you with HTML, CSS, JavaScript, and more. Ask me anything!",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length,
      type: 'user',
      content: prompt,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setPrompt("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      generateAIResponse(prompt);
      setIsLoading(false);
    }, 1000);
  };

  const generateAIResponse = (userPrompt: string) => {
    let response = "";
    
    // Very simple pattern matching for demo purposes
    const lowerPrompt = userPrompt.toLowerCase();
    
    if (lowerPrompt.includes("hello") || lowerPrompt.includes("hi")) {
      response = "Hello! How can I help you with your coding project today?";
    } 
    else if (lowerPrompt.includes("html")) {
      if (lowerPrompt.includes("button")) {
        response = "Here's a styled HTML button:\n\n```html\n<button class=\"btn\">\n  Click Me\n</button>\n\n<style>\n.btn {\n  padding: 8px 16px;\n  background-color: #4f46e5;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n}\n\n.btn:hover {\n  background-color: #3730a3;\n}\n</style>\n```\n\nYou can click the code block to insert it into your editor.";
      } else {
        response = "HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser. What specific HTML element or concept would you like to know about?";
      }
    }
    else if (lowerPrompt.includes("css")) {
      response = "CSS (Cascading Style Sheets) is used for styling web pages. What specific CSS property or technique would you like to learn about?";
    }
    else if (lowerPrompt.includes("javascript") || lowerPrompt.includes("js")) {
      if (lowerPrompt.includes("function") || lowerPrompt.includes("method")) {
        response = "Here's a JavaScript function example:\n\n```javascript\n// Function to toggle an element's visibility\nfunction toggleVisibility(elementId) {\n  const element = document.getElementById(elementId);\n  if (element) {\n    if (element.style.display === 'none') {\n      element.style.display = 'block';\n    } else {\n      element.style.display = 'none';\n    }\n  }\n}\n\n// Usage\n// toggleVisibility('myElement');\n```\n\nClick the code block to insert it into your editor.";
      } else {
        response = "JavaScript is a programming language that enables interactive web pages. What specific JS function, concept, or problem are you working on?";
      }
    }
    else if (lowerPrompt.includes("help")) {
      response = "I can help with HTML, CSS, JavaScript, and other web development topics. Try asking me specific questions like:\n\n- How do I center a div with CSS?\n- Example of a responsive navigation bar\n- How to fetch data with JavaScript\n- Show me a dark mode toggle implementation";
    }
    else {
      response = "I'm here to help with your coding questions! Could you provide more details about what you're trying to accomplish? I can assist with HTML, CSS, JavaScript, or general web development concepts.";
    }
    
    const aiMessage: Message = {
      id: messages.length + 1,
      type: 'ai',
      content: response,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, aiMessage]);
  };

  const handleCodeBlockClick = (code: string) => {
    // Extract code from markdown code blocks
    const codeMatch = code.match(/```(?:\w+)?\n([\s\S]+?)\n```/);
    if (codeMatch && codeMatch[1]) {
      onInsertCode(codeMatch[1]);
    }
  };

  // Function to format message content with markdown-like syntax highlighting
  const formatMessageContent = (content: string) => {
    // Replace code blocks with styled pre elements
    const formattedContent = content.replace(/```(?:\w+)?\n([\s\S]+?)\n```/g, (match, code) => {
      return `<pre class="bg-[#242a38] text-[#e4e5e7] p-3 rounded my-2 cursor-pointer hover:bg-[#2d3748] text-xs overflow-x-auto" data-code="${encodeURIComponent(code)}">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
    });
    
    // Replace inline code
    return formattedContent.replace(/`([^`]+)`/g, '<code class="bg-[#242a38] text-[#e4e5e7] px-1 rounded text-xs">$1</code>');
  };

  if (!visible) return null;

  return (
    <div className="fixed right-0 top-[56px] bottom-0 w-80 bg-[#1a1f2c] border-l border-[#374151] flex flex-col z-50 shadow-2xl transform transition-transform duration-300">
      <div className="flex items-center justify-between p-4 border-b border-[#374151]">
        <div className="flex items-center gap-2">
          <Code size={20} className="text-[#6366f1]" />
          <h3 className="font-medium text-sm">AI Assistant</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`mb-4 flex ${
              message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user' 
                  ? 'bg-[#6366f1] text-white' 
                  : 'bg-[#242a38] text-[#e4e5e7]'
              }`}
            >
              <div 
                className="text-sm whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.tagName === 'PRE') {
                    const code = decodeURIComponent(target.getAttribute('data-code') || '');
                    handleCodeBlockClick(code);
                  }
                }}
              />
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-[#242a38] text-[#e4e5e7] p-3 rounded-lg max-w-[80%]">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[#6366f1] rounded-full mr-1 animate-pulse"></div>
                <div className="w-2 h-2 bg-[#6366f1] rounded-full mr-1 animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-[#6366f1] rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form 
        onSubmit={handleSubmit}
        className="border-t border-[#374151] p-4 flex gap-2"
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask for code help..."
          className="flex-1 bg-[#242a38] border border-[#374151] rounded p-2 text-[#e4e5e7] text-sm focus:outline-none focus:border-[#6366f1]"
        />
        <Button 
          type="submit"
          className="bg-[#6366f1] text-white hover:bg-[#4f46e5] h-9 w-9 p-0"
          disabled={isLoading || !prompt.trim()}
        >
          <SendHorizontal size={16} />
        </Button>
      </form>
    </div>
  );
};
