
import React from 'react';
import { Button } from "@/components/ui/button";
import { useLayout } from '@/contexts/LayoutContext';
import { Layout, Code, Monitor } from "lucide-react";

export const MobileControls: React.FC = () => {
  const { view, setView } = useLayout();

  return (
    <div className="md:hidden flex p-2 bg-[#151922] border-b border-[#374151]">
      <div className="flex w-full bg-[#242a38] rounded-md overflow-hidden">
        <Button
          variant="ghost"
          className={`flex-1 px-2 py-1 h-8 ${view === 'split' ? 'bg-[#374151] text-white' : 'text-[#9ca3af]'}`}
          onClick={() => setView('split')}
        >
          <Layout size={14} className="mr-1" />
          Split
        </Button>
        <Button
          variant="ghost"
          className={`flex-1 px-2 py-1 h-8 ${view === 'editor' ? 'bg-[#374151] text-white' : 'text-[#9ca3af]'}`}
          onClick={() => setView('editor')}
        >
          <Code size={14} className="mr-1" />
          Code
        </Button>
        <Button
          variant="ghost"
          className={`flex-1 px-2 py-1 h-8 ${view === 'preview' ? 'bg-[#374151] text-white' : 'text-[#9ca3af]'}`}
          onClick={() => setView('preview')}
        >
          <Monitor size={14} className="mr-1" />
          Result
        </Button>
      </div>
    </div>
  );
};
