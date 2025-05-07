
import React from "react";
import { FileCode, FileText, File, Folder } from "lucide-react";

/**
 * Get file type icon based on file extension
 */
export const getFileIcon = (fileName: string, size: number = 16) => {
  // Extract extension from filename
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch(extension) {
    case 'html':
      return <FileText size={size} className="text-[#f06529]" />;
    case 'css':
      return <File size={size} className="text-[#2965f1]" />;
    case 'js':
      return <FileCode size={size} className="text-[#f7df1e]" />;
    case 'jsx':
    case 'tsx':
      return <FileCode size={size} className="text-[#61dafb]" />;
    case 'json':
      return <FileCode size={size} className="text-[#8bc34a]" />;
    case 'md':
      return <FileText size={size} className="text-[#9ca3af]" />;
    default:
      if (!extension) {
        return <Folder size={size} className="text-[#90caf9]" />;
      }
      return <FileCode size={size} className="text-[#9ca3af]" />;
  }
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Generate a random pastel color
 */
export const getRandomPastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 80%)`;
};

/**
 * Format timestamp for display
 */
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

/**
 * Get language name from extension
 */
export const getLanguageName = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch(extension) {
    case 'html': return 'HTML';
    case 'css': return 'CSS';
    case 'js': return 'JavaScript';
    case 'jsx': return 'React JSX';
    case 'tsx': return 'TypeScript React';
    case 'ts': return 'TypeScript';
    case 'json': return 'JSON';
    case 'md': return 'Markdown';
    default: return extension ? extension.toUpperCase() : 'Unknown';
  }
};

/**
 * Get color for tag based on language
 */
export const getLanguageTagColors = (fileName: string): {color: string, bgColor: string} => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch(extension) {
    case 'html':
      return { color: '#f06529', bgColor: 'rgba(240, 101, 41, 0.2)' };
    case 'css':
      return { color: '#2965f1', bgColor: 'rgba(41, 101, 241, 0.2)' };
    case 'js':
      return { color: '#f7df1e', bgColor: 'rgba(247, 223, 30, 0.2)' };
    case 'jsx':
      return { color: '#61dafb', bgColor: 'rgba(97, 218, 251, 0.2)' };
    case 'tsx':
    case 'ts':
      return { color: '#3178c6', bgColor: 'rgba(49, 120, 198, 0.2)' };
    case 'json':
      return { color: '#8bc34a', bgColor: 'rgba(139, 195, 74, 0.2)' };
    case 'md':
      return { color: '#9ca3af', bgColor: 'rgba(156, 163, 175, 0.2)' };
    default:
      return { color: '#9ca3af', bgColor: 'rgba(156, 163, 175, 0.2)' };
  }
};
