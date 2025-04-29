
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface LayoutContextProps {
  view: 'split' | 'editor' | 'preview';
  setView: (view: 'split' | 'editor' | 'preview') => void;
  panelWidth: number;
  setPanelWidth: (width: number) => void;
  isResizing: boolean;
  setIsResizing: (isResizing: boolean) => void;
  startResize: (e: React.MouseEvent) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  isMobile: boolean;
  showAiAssistant: boolean;
  setShowAiAssistant: (show: boolean) => void;
}

const LayoutContext = createContext<LayoutContextProps | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<'split' | 'editor' | 'preview'>('split');
  const [panelWidth, setPanelWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Handle resize events
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const newWidth = startWidthRef.current + (e.clientX - startXRef.current);
      const widthPercentage = (newWidth / containerWidth) * 100;
      
      // Limit min/max width with enhanced smoothing
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
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Switch to appropriate view on mobile
      if (mobile && view === 'split') {
        setView('editor');
      }
      
      // Update body class for responsive styles
      if (mobile) {
        document.body.classList.add('mobile-layout');
      } else {
        document.body.classList.remove('mobile-layout');
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [view]);

  // Gracefully handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const startResize = (e: React.MouseEvent) => {
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = containerRef.current ? containerRef.current.offsetWidth * (panelWidth / 100) : 0;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(err => console.error('Error exiting fullscreen:', err));
    } else {
      document.documentElement.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error('Error entering fullscreen:', err));
    }
  };

  // Share the container ref with parent components
  const setContainerRef = (ref: HTMLDivElement | null) => {
    containerRef.current = ref;
  };

  // Custom view setter that handles mobile constraints
  const handleSetView = (newView: 'split' | 'editor' | 'preview') => {
    // On mobile, don't allow split view
    if (isMobile && newView === 'split') {
      setView('editor');
    } else {
      setView(newView);
    }
  };

  return (
    <LayoutContext.Provider
      value={{
        view,
        setView: handleSetView,
        panelWidth,
        setPanelWidth,
        isResizing,
        setIsResizing,
        startResize,
        isFullscreen,
        toggleFullscreen,
        isMobile,
        showAiAssistant,
        setShowAiAssistant,
      }}
    >
      {React.cloneElement(children as React.ReactElement, { ref: setContainerRef })}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
