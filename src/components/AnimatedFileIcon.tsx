
import React from 'react';
import { motion } from 'framer-motion';
import { getFileIcon, getLanguageTagColors } from './utils/EditorUtils';

interface AnimatedFileIconProps {
  fileName: string;
  size?: number;
  showAnimation?: boolean;
  className?: string;
}

export const AnimatedFileIcon: React.FC<AnimatedFileIconProps> = ({
  fileName,
  size = 16,
  showAnimation = true,
  className = '',
}) => {
  const icon = getFileIcon(fileName, size);
  const { color } = getLanguageTagColors(fileName);
  
  // Animation variants
  const containerVariants = {
    initial: { 
      scale: 0.8,
      opacity: 0,
      rotate: -5
    },
    animate: { 
      scale: 1, 
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.1,
      y: -2,
      transition: {
        duration: 0.2
      }
    },
    active: {
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  };
  
  const pulseAnimation = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.85, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };
  
  return (
    <motion.div
      className={`inline-flex items-center justify-center ${className}`}
      variants={containerVariants}
      initial={showAnimation ? "initial" : "animate"}
      animate="animate"
      whileHover="hover"
      whileTap="active"
      style={{ color }}
    >
      <motion.div 
        variants={showAnimation ? pulseAnimation : {}} 
        animate={showAnimation ? "pulse" : undefined}
      >
        {icon}
      </motion.div>
    </motion.div>
  );
};
