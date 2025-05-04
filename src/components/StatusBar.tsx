
import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Users, 
  Wifi, 
  WifiOff, 
  CircleSlash, 
  Circle, 
  Cpu, 
  SaveAll,
  Calendar,
  Github
} from 'lucide-react';
import { useFileSystem } from '@/contexts/FileSystemContext';
import { getLanguageName } from './utils/EditorUtils';
import { StatusBarTooltip } from './StatusBarTooltip';

export const StatusBar: React.FC = () => {
  const { settings } = useSettings();
  const { currentFile } = useFileSystem();
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [currentDate, setCurrentDate] = React.useState(new Date().toLocaleDateString());
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [lastSaved, setLastSaved] = React.useState<string | null>(null);
  const [memoryUsage, setMemoryUsage] = React.useState<number>(0);
  
  // Update time every minute
  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setCurrentDate(now.toLocaleDateString());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Update online status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Simulate memory usage monitoring
  React.useEffect(() => {
    if ('performance' in window && 'memory' in performance) {
      const updateMemory = () => {
        // @ts-ignore - TypeScript doesn't know about the memory property
        const memoryInfo = (performance as any).memory;
        if (memoryInfo) {
          const usedHeap = Math.round(memoryInfo.usedJSHeapSize / (1024 * 1024));
          setMemoryUsage(usedHeap);
        }
      };
      
      updateMemory();
      const memTimer = setInterval(updateMemory, 5000);
      return () => clearInterval(memTimer);
    }
  }, []);

  // Simulate last save time - in a real app, this would come from actual save events
  React.useEffect(() => {
    const initialSaveTime = new Date();
    initialSaveTime.setMinutes(initialSaveTime.getMinutes() - 5);
    setLastSaved(initialSaveTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    
    const simulateSaves = setInterval(() => {
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 120000); // Simulate auto-save every 2 minutes
    
    return () => clearInterval(simulateSaves);
  }, []);

  return (
    <motion.div 
      className="h-6 text-xs flex items-center justify-between bg-gradient-to-r from-[#151922]/90 to-[#1a1f2c]/90 border-t border-[#2d3748]/50 px-3 text-[#9ca3af]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="flex items-center space-x-4">
        <StatusBarTooltip label={isOnline ? "Connected to internet" : "No internet connection"}>
          <div className="flex items-center space-x-1.5">
            {isOnline ? (
              <Wifi size={12} className="text-green-500" />
            ) : (
              <WifiOff size={12} className="text-red-500" />
            )}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </StatusBarTooltip>
        
        <StatusBarTooltip label={currentFile ? `Editing ${currentFile}` : "No file selected"}>
          <div className="flex items-center space-x-1.5">
            {currentFile ? (
              <>
                <Circle size={12} className="text-green-500" />
                <span>{getLanguageName(currentFile)}</span>
              </>
            ) : (
              <>
                <CircleSlash size={12} className="text-gray-500" />
                <span>No file selected</span>
              </>
            )}
          </div>
        </StatusBarTooltip>

        <StatusBarTooltip label={`Memory usage: ${memoryUsage} MB`}>
          <div className="flex items-center space-x-1.5">
            <Cpu size={12} className="text-blue-400" />
            <span>{memoryUsage > 0 ? `${memoryUsage} MB` : 'Ready'}</span>
          </div>
        </StatusBarTooltip>
      </div>
      
      <div className="hidden md:flex items-center space-x-4">
        <StatusBarTooltip label="Last auto-save time">
          <div className="flex items-center space-x-1.5">
            <SaveAll size={12} className="text-indigo-400" />
            <span>Saved: {lastSaved || 'Never'}</span>
          </div>
        </StatusBarTooltip>
        
        <StatusBarTooltip label="Active file">
          <div className="flex items-center space-x-1.5">
            <Users size={12} />
            <span>{currentFile || 'None'}</span>
          </div>
        </StatusBarTooltip>
        
        <StatusBarTooltip label="Current date">
          <div className="flex items-center space-x-1.5">
            <Calendar size={12} className="text-purple-400" />
            <span>{currentDate}</span>
          </div>
        </StatusBarTooltip>
        
        <StatusBarTooltip label="Current time">
          <div className="flex items-center space-x-1.5">
            <Clock size={12} />
            <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </StatusBarTooltip>

        <StatusBarTooltip label="Version information">
          <div className="flex items-center space-x-1.5">
            <Github size={12} className="text-gray-400" />
            <span>Demo Ver. 1.0</span>
          </div>
        </StatusBarTooltip>
      </div>
    </motion.div>
  );
};
