
import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { motion } from 'framer-motion';
import { Clock, Users, Wifi, WifiOff, CircleSlash, Circle } from 'lucide-react';
import { useFileSystem } from '@/contexts/FileSystemContext';
import { getLanguageName } from './utils/EditorUtils';

export const StatusBar: React.FC = () => {
  const { settings } = useSettings();
  const { currentFile } = useFileSystem();
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  
  // Update time every minute
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
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

  return (
    <motion.div 
      className="h-6 text-xs flex items-center justify-between bg-gradient-to-r from-[#151922]/90 to-[#1a1f2c]/90 border-t border-[#2d3748]/50 px-3 text-[#9ca3af]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1.5">
          {isOnline ? (
            <Wifi size={12} className="text-green-500" />
          ) : (
            <WifiOff size={12} className="text-red-500" />
          )}
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>
        
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
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1.5">
          <Users size={12} />
          <span>Editing: {currentFile || 'None'}</span>
        </div>
        
        <div className="flex items-center space-x-1.5">
          <Clock size={12} />
          <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </motion.div>
  );
};
