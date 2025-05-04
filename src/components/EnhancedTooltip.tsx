
import React from 'react';
import { motion } from 'framer-motion';

interface EnhancedTooltipProps {
  children: React.ReactNode;
  tooltip: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export const EnhancedTooltip: React.FC<EnhancedTooltipProps> = ({
  children,
  tooltip,
  position = 'top',
  className = '',
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  // Calculate tooltip position
  const getTooltipPosition = () => {
    switch (position) {
      case 'top':
        return 'bottom-full mb-2';
      case 'right':
        return 'left-full ml-2';
      case 'bottom':
        return 'top-full mt-2';
      case 'left':
        return 'right-full mr-2';
      default:
        return 'bottom-full mb-2';
    }
  };
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      {isHovered && (
        <motion.div
          className={`absolute z-50 px-2 py-1 text-xs rounded-md whitespace-nowrap ${getTooltipPosition()} bg-[#1a1f2c]/95 text-white border border-[#374151]/70 shadow-xl backdrop-blur-sm ${className}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          {tooltip}
          <div 
            className={`absolute w-2 h-2 bg-[#1a1f2c]/95 border-[#374151]/70 transform rotate-45 
              ${position === 'top' ? 'bottom-[-4px] border-b border-r left-1/2 ml-[-4px]' : ''}
              ${position === 'right' ? 'left-[-4px] border-l border-t top-1/2 mt-[-4px]' : ''}
              ${position === 'bottom' ? 'top-[-4px] border-t border-l left-1/2 ml-[-4px]' : ''}
              ${position === 'left' ? 'right-[-4px] border-r border-b top-1/2 mt-[-4px]' : ''}
            `}
          />
        </motion.div>
      )}
    </div>
  );
};
